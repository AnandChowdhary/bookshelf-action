import { debug } from "@actions/core";
import { Context } from "@actions/github/lib/context";
import type { GitHub } from "@actions/github/lib/utils";
import { promises } from "fs";
import humanizeDuration from "humanize-duration";
import { join } from "path";
import { exec } from "shelljs";
import { format } from "prettier";
import { addDetailsToLabels } from "../github";
import { BookResult } from "../google-books";

export const updateSummary = async (
  owner: string,
  repo: string,
  context: Context,
  octokit: InstanceType<typeof GitHub>
) => {
  debug("Starting updateSummary");
  const issues = await octokit.issues.listForRepo({
    owner: context.issue.owner,
    repo: context.issue.repo,
    labels: "kind: book",
    state: "all",
  });
  debug(`Got ${issues.data.length} issues`);
  const api: (BookResult & {
    state: "reading" | "completed";
    issueNumber: number;
    startedAt: string;
    progressPercent: number;
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
    debug(`Got ${comments.data.length} comments in issue ${issue.number}`);
    let json: BookResult | undefined = undefined;
    try {
      comments.data.forEach((comment) => {
        if (comment.body.includes("Book details (JSON)"))
          json = JSON.parse(comment.body.split("```json")[1].split("```")[0]) as BookResult;
      });
    } catch (error) {
      console.log("JSON parsing error", error);
    }
    if (json) {
      debug(`Found JSON data for ${(json as BookResult).title}`);
      const currentPercentage = issue.title.match(/\(\d+\%\)/g);
      api.push({
        ...(json as BookResult),
        issueNumber: issue.number,
        progressPercent:
          currentPercentage && currentPercentage.length && !isNaN(parseInt(currentPercentage[0]))
            ? parseInt(currentPercentage[0])
            : 0,
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
    } else debug(`Unable to find JSON data for #${issue.id}`);
  }
  await promises.writeFile(join(".", "api.json"), JSON.stringify(api, null, 2) + "\n");
  debug("Written api.json file");
  const apiLeft = api.filter((_, i) => i % 2 !== 0);
  const apiRight = api.filter((_, i) => i % 2 === 0);
  debug(`api has length ${api.length}`);
  debug(`apiLeft has length ${apiLeft.length}`);
  debug(`apiRight has length ${apiRight.length}`);
  let mdContent = "<table>";
  [apiLeft, apiRight].forEach((apiItem) => {
    apiItem.forEach((_, i) => {
      if (i % 2 === 0) mdContent += "<tr>";
      if (apiItem[i])
        mdContent += `<td>
    <table>
      <tr>
        <td>
          <a href="https://github.com/${owner}/${repo}/issues/${
          apiItem[i].issueNumber
        }"><img alt="" src="${apiItem[i].image}" height="128"></a>
        </td>   
        <td>
          <strong><a href="https://github.com/${owner}/${repo}/issues/${apiItem[i].issueNumber}">${
          apiItem[i].title
        }</a></strong><br>
          ${apiItem[i].authors
            .map(
              (i) =>
                `<a href="https://github.com/${owner}/${repo}/issues?q=is%3Aissue+label%3A%22author%3A+${encodeURIComponent(
                  i
                )}%22">${i}</a>`
            )
            .join(", ")}<br><br>
          ${
            apiItem[i].state === "completed"
              ? `✔️ <a href="https://github.com/${owner}/${repo}/issues?q=is%3Aissue+is%3Aclosed">Completed</a><br>${
                  apiItem[i].timeToComplete
                    ? `⌛ ${humanizeDuration(apiItem[i].timeToComplete || 0)}`
                    : ""
                }`
              : `⌛ Reading${apiItem[i].progressPercent ? ` (${apiItem[i].progressPercent}%)` : ""}`
          }<br>
          ${
            apiItem[i].completedAt
              ? `📅 <a href="https://github.com/${owner}/${repo}/issues?q=is%3Aissue+is%3Aclosed+label%3A%22completed%3A+${new Date(
                  apiItem[i].completedAt || 0
                )
                  .toLocaleDateString("en", {
                    month: "long",
                  })
                  .toLowerCase()}%22">${new Date(apiItem[i].completedAt || 0).toLocaleDateString(
                  "en",
                  {
                    month: "long",
                  }
                )}</a> <a href="https://github.com/${owner}/${repo}/issues?q=is%3Aissue+is%3Aclosed+label%3A%22completed%3A+${new Date(
                  apiItem[i].completedAt || 0
                ).getUTCFullYear()}%22#">${new Date(
                  apiItem[i].completedAt || 0
                ).getUTCFullYear()}</a>`
              : ""
          }
        </td>
      </tr>
    </table>
  </td>
  `;
      if (i % 2 === 0) mdContent += "</tr>";
    });
  });
  mdContent += "</table>";
  debug(`Generated README.md content of length ${mdContent.length}`);
  const content = await promises.readFile(join(".", "README.md"), "utf8");
  debug(`Read README.md file of length ${content.length}`);
  await promises.writeFile(
    join(".", "README.md"),
    content.split("<!--start:bookshelf-action-->")[0] +
      `<!--start:bookshelf-action-->\n${format(mdContent, {
        parser: "html",
      })}\n<!--end:bookshelf-action-->` +
      content.split("<!--end:bookshelf-action-->")[1]
  );
  debug("Written README.md file");
  exec(`git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"`);
  exec(`git config --global user.name "github-actions[bot]"`);
  debug("Added git config user details");
  exec("git add .");
  exec('git commit -m ":bento: Update API and README summary [skip ci]"');
  debug("Committed to git history");
  exec("git push");
  debug("Pushed to repository");
  await addDetailsToLabels(owner, repo, octokit);
  debug("Updated label details");
};
