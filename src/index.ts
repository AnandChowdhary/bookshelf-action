import { getInput, setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { GitHub } from "@actions/github/lib/utils";
import { promises } from "fs";
import humanizeDuration from "humanize-duration";
import { join } from "path";
import { exec } from "shelljs";
import type { Book } from "./goodreads";
import { search } from "./goodreads";

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
      `completed in ${new Date().toLocaleString("en", { month: "long" }).toLowerCase()}`,
      `completed in ${new Date().getUTCFullYear()}`,
    ],
  });
  updateSummary(octokit);
};

const onNewIssue = async (octokit: InstanceType<typeof GitHub>) => {
  const key = getInput("goodreads-key") || process.env.GOODREADS_KEY || process.env.GOODREADS_KEY;
  const secret =
    getInput("goodreads-secret") || process.env.GOODREADS_SECRET || process.env.GOODREADS_SECRET;
  if (!key) throw new Error("GoodReads API key not found");
  if (!secret) throw new Error("GoodReads API secret not found");
  const issue = await octokit.issues.get({
    owner: context.issue.owner,
    repo: context.issue.repo,
    issue_number: context.issue.number,
  });
  let body =
    "<!-- This comment is autogenerated by book-tracker <https://github.com/AnandChowdhary/book-tracker> -->\n\n";
  const labels: string[] = [
    "book",
    `started in ${new Date().toLocaleString("en", { month: "long" }).toLowerCase()}`,
    `started in ${new Date().getUTCFullYear()}`,
  ];
  try {
    const details = await search(key, secret, issue.data.title);
    body += `Congrats on starting **${details.title}** by ${
      details.author
    }, I hope you enjoy it! It has an average of ${
      details.goodreads.averageRating
    }/5 stars and ${details.goodreads.ratingsCount.toLocaleString()} ratings on [Goodreads](https://www.goodreads.com/book/show/${
      details.goodreads.id
    }).\n\n<details>
 <summary>Book details (JSON)</summary>

\`\`\`json
${JSON.stringify(details, null, 2)}
\`\`\`

</details>`;
    labels.push(`${details.author.toLowerCase()}`);
    if (details.year) {
      labels.push(`${details.year} books`);
      labels.push(`${Math.floor(details.year / 10) * 10}s books`);
    }
  } catch (error) {
    body +=
      "I couldn't find details about this book using the GoodReads API. Don't worry, you can still track it.\n\n";
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
  const api: (Book & {
    state: "reading" | "completed";
    startedAt: string;
    completedAt?: string;
    timeToCompleteMinutes?: number;
    timeToCompleteFormatted?: string;
  })[] = [];
  for await (const issue of issues.data) {
    const comments = await octokit.issues.listComments({
      owner: context.issue.owner,
      repo: context.issue.repo,
      issue_number: issue.number,
    });
    let json: Book | undefined = undefined;
    try {
      comments.data.forEach((comment) => {
        if (comment.body.includes("Book details (JSON)"))
          json = JSON.parse(comment.body.split("```json")[1].split("```")[0]) as Book;
      });
    } catch (error) {
      console.log("JSON parsing error", error);
    }
    if (json)
      api.push({
        ...(json as Book),
        state: issue.state === "open" ? "reading" : "completed",
        startedAt: new Date(issue.created_at).toISOString(),
        completedAt: issue.state === "closed" ? new Date(issue.closed_at).toISOString() : undefined,
        timeToCompleteMinutes:
          issue.state === "closed"
            ? Math.round(
                (new Date(issue.closed_at).getTime() - new Date(issue.created_at).getTime()) / 60000
              )
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
