import { getInput, setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { GitHub } from "@actions/github/lib/utils";
import { promises } from "fs";
import humanizeDuration from "humanize-duration";
import { join } from "path";
import { exec } from "shelljs";
import type { BookResult } from "./google-books";
import { search } from "./google-books";

const token = getInput("token") || process.env.GH_PAT || process.env.GITHUB_TOKEN;
const [owner, repo] = (process.env.GITHUB_REPOSITORY || "").split("/");

export const run = async () => {
  const COMMAND = getInput("command");
  if (!COMMAND) throw new Error("Command not found");
  if (!token) throw new Error("GitHub token not found");

  const octokit = getOctokit(token);
  if (COMMAND === "onNewIssue") return onNewIssue(octokit);
  if (COMMAND === "onCloseIssue") return onCloseIssue(octokit);
  throw new Error("Command not recognized");
};

const onCloseIssue = async (octokit: InstanceType<typeof GitHub>) => {
  const issue = await octokit.issues.get({
    owner: context.issue.owner,
    repo: context.issue.repo,
    issue_number: context.issue.number,
  });
  await octokit.issues.createComment({
    owner: context.issue.owner,
    repo: context.issue.repo,
    issue_number: context.issue.number,
    body: `You completed this book in ${humanizeDuration(
      new Date(issue.data.closed_at).getTime() - new Date(issue.data.created_at).getTime()
    )}, great job!`,
  });
  await octokit.issues.addLabels({
    owner: context.issue.owner,
    repo: context.issue.repo,
    issue_number: context.issue.number,
    labels: [
      `completed: ${new Date().toLocaleString("en", { month: "long" }).toLowerCase()}`,
      `completed: ${new Date().getUTCFullYear()}`,
    ],
  });
  updateSummary(octokit);
};

const onNewIssue = async (octokit: InstanceType<typeof GitHub>) => {
  const issue = await octokit.issues.get({
    owner: context.issue.owner,
    repo: context.issue.repo,
    issue_number: context.issue.number,
  });
  let body =
    "<!-- This comment is autogenerated by book-tracker <https://github.com/AnandChowdhary/book-tracker> -->\n\n";
  const labels: string[] = [
    "kind: book",
    `started: ${new Date().toLocaleString("en", { month: "long" }).toLowerCase()}`,
    `started: ${new Date().getUTCFullYear()}`,
  ];
  try {
    const details = await search(issue.data.title);
    body += `Congrats on starting **${details.title}** by ${details.authors.join(
      ", "
    )}, I hope you enjoy it! It has an average of ${
      details.averageRating
    }/5 stars and ${details.ratingsCount.toLocaleString()} ratings on [Google Books](${
      details.googleBooks.info
    }).\n\n<details>
 <summary>Book details (JSON)</summary>

\`\`\`json
${JSON.stringify(details, null, 2)}
\`\`\`

</details>`;
    details.authors.forEach((i) => labels.push(`author: ${i.toLowerCase()}`));
    details.categories.forEach((i) => labels.push(`category: ${i.toLowerCase()}`));
    if (details.publishedDate) {
      labels.push(`year: ${details.publishedDate}`);
      labels.push(`decade: ${Math.floor(Number(details.publishedDate) / 10) * 10}s`);
    }
    if (details.language) labels.push(`language: ${details.language}`);
    if (details.publisher) labels.push(`publisher: ${details.publisher}`);
  } catch (error) {
    body +=
      "I couldn't find details about this book using the Google Books API. Don't worry, you can still track it.\n\n";
  }
  body += `When you're finished with reading this book, just close this issue and I'll mark it as completed. Best of luck! 👍`;
  await octokit.issues.createComment({
    owner: context.issue.owner,
    repo: context.issue.repo,
    issue_number: context.issue.number,
    body,
  });
  await octokit.issues.addLabels({
    owner: context.issue.owner,
    repo: context.issue.repo,
    issue_number: context.issue.number,
    labels,
  });
  await octokit.issues.lock({
    owner: context.issue.owner,
    repo: context.issue.repo,
    issue_number: context.issue.number,
  });
  updateSummary(octokit);
};

const updateSummary = async (octokit: InstanceType<typeof GitHub>) => {
  const issues = await octokit.issues.listForRepo({
    owner: context.issue.owner,
    repo: context.issue.repo,
    labels: "book",
    state: "all",
  });
  const api: (BookResult & {
    state: "reading" | "completed";
    startedAt: string;
    completedAt?: string;
    timeToComplete?: number;
    timeToCompleteFormatted?: string;
  })[] = [];
  for await (const issue of issues.data) {
    const comments = await octokit.issues.listComments({
      owner: context.issue.owner,
      repo: context.issue.repo,
      issue_number: issue.number,
    });
    let json: BookResult | undefined = undefined;
    try {
      comments.data.forEach((comment) => {
        if (comment.body.includes("Book details (JSON)"))
          json = JSON.parse(comment.body.split("```json")[1].split("```")[0]) as BookResult;
      });
    } catch (error) {
      console.log("JSON parsing error", error);
    }
    if (json)
      api.push({
        ...(json as BookResult),
        state: issue.state === "open" ? "reading" : "completed",
        startedAt: new Date(issue.created_at).toISOString(),
        completedAt: issue.state === "closed" ? new Date(issue.closed_at).toISOString() : undefined,
        timeToComplete:
          issue.state === "closed"
            ? new Date(issue.closed_at).getTime() - new Date(issue.created_at).getTime()
            : undefined,
        timeToCompleteFormatted:
          issue.state === "closed"
            ? humanizeDuration(
                new Date(issue.closed_at).getTime() - new Date(issue.created_at).getTime()
              )
            : undefined,
      });
  }
  await promises.writeFile(join(".", "api.json"), JSON.stringify(api, null, 2) + "\n");
  const apiLeft = api.filter((_, i) => i % 2 !== 0);
  const apiRight = api.filter((_, i) => i % 2 === 0);
  let mdContent = "<table>";
  [apiLeft, apiRight].forEach((apiItem) => {
    apiLeft.forEach((_, i) => {
      mdContent += "<tr>";
      if (apiItem[i])
        mdContent += `<td>
    <table>
      <tr>
        <td>
          <img alt="" src="${apiItem[i].image}" height="128">
        </td>   
        <td>
          <strong>${apiItem[i].title}</strong><br>
          ${apiItem[i].authors.join(", ")}<br><br>
          ${apiItem[i].state === "completed" ? "✔️ Completed" : "⌛ Reading"}<br>
          ${
            apiItem[i].timeToComplete
              ? `⌛ ${humanizeDuration((apiItem[i].timeToComplete || 0) * 60000)}`
              : ""
          }
          ${
            apiItem[i].completedAt
              ? `📅 ${new Date(apiItem[i].completedAt || 0).toLocaleDateString("en", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}`
              : ""
          }
        </td>
      </tr>
    </table>
  </td>
  `;
      mdContent += "</tr>";
    });
  });
  mdContent += "</table>";
  const content = await promises.readFile(join(".", "README.md"), "utf8");
  await promises.writeFile(
    join(".", "README.md"),
    content.split("<!--start:book-tracker-->")[0] +
      `<!--start:book-tracker-->\n${mdContent}\n<!--end:book-tracker-->` +
      content.split("<!--end:book-tracker-->")[1]
  );
  exec(`git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"`);
  exec(`git config --global user.name "github-actions[bot]"`);
  exec("git add .");
  exec('git commit -m ":bento: Update API and README summary [skip ci]"');
  exec("git push");
};

run()
  .then(() => {})
  .catch((error) => {
    console.error("ERROR", error);
    setFailed(error.message);
  });
