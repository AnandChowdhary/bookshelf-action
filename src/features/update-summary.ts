import { debug } from "@actions/core";
import { Context } from "@actions/github/lib/context";
import type { GitHub } from "@actions/github/lib/utils";
import { config, cosmic } from "@anandchowdhary/cosmic";
import { promises } from "fs";
import humanizeDuration from "humanize-duration";
import { join } from "path";
import { format } from "prettier";
import { exec } from "shelljs";
import { addDetailsToLabels } from "../github";
import { BookResult } from "../google-books";

export const updateSummary = async (
  owner: string,
  repo: string,
  context: Context,
  octokit: InstanceType<typeof GitHub>
) => {
  debug("Starting updateSummary");
  try {
    await cosmic("bookshelf");
    debug("Got config object");
  } catch (error) {}
  const issues = await octokit.rest.issues.listForRepo({
    owner: context.issue.owner,
    repo: context.issue.repo,
    labels: "kind: book",
    state: "all",
  });
  debug(`Got ${issues.data.length} issues`);
  let api: (BookResult & {
    state: "reading" | "completed" | "want-to-read";
    issueNumber: number;
    startedAt: string;
    progressPercent: number;
    completedAt?: string;
    timeToComplete?: number;
    timeToCompleteFormatted?: string;
  })[] = [];
  for await (const issue of issues.data) {
    const comments = await octokit.rest.issues.listComments({
      owner: context.issue.owner,
      repo: context.issue.repo,
      issue_number: issue.number,
    });
    debug(`Got ${comments.data.length} comments in issue ${issue.number}`);
    let json: BookResult | undefined = undefined;
    try {
      comments.data.forEach((comment) => {
        if ((comment.body || "").includes("Book details (JSON)"))
          json = JSON.parse((comment.body || "").split("```json")[1].split("```")[0]) as BookResult;
      });
    } catch (error) {
      console.log("JSON parsing error", error);
    }
    const isWantToRead = issue.labels.find((label) =>
      typeof label === "string" ? label === "want to read" : label.name === "want to read"
    );
    if (isWantToRead) debug(`Book is in category "want to read"`);
    if (json) {
      debug(`Found JSON data for ${(json as BookResult).title}`);
      const currentPercentage = issue.title.match(/\(\d+\%\)/g);
      const overwrites =
        config("overwrites") || ({} as Record<number, { started: string; completed: string }>);
      const openedAt = (overwrites[issue.number] || {}).started
        ? overwrites[issue.number].started
        : issue.created_at;
      const closedAt = (overwrites[issue.number] || {}).completed
        ? overwrites[issue.number].completed
        : issue.closed_at;
      api.push({
        ...(json as BookResult),
        issueNumber: issue.number,
        progressPercent:
          currentPercentage && currentPercentage.length && !isNaN(parseInt(currentPercentage[0]))
            ? parseInt(currentPercentage[0])
            : 0,
        state: issue.state === "open" ? (isWantToRead ? "want-to-read" : "reading") : "completed",
        startedAt: new Date(openedAt).toISOString(),
        completedAt: issue.state === "closed" ? new Date(closedAt).toISOString() : undefined,
        timeToComplete:
          issue.state === "closed"
            ? new Date(closedAt).getTime() - new Date(openedAt).getTime()
            : undefined,
        timeToCompleteFormatted:
          issue.state === "closed"
            ? humanizeDuration(new Date(closedAt).getTime() - new Date(openedAt).getTime()).split(
                ","
              )[0]
            : undefined,
      });
    } else debug(`Unable to find JSON data for #${issue.id}`);
  }
  api = api.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  await promises.writeFile(join(".", "api.json"), JSON.stringify(api, null, 2) + "\n");
  debug("Written api.json file");
  debug(`api has length ${api.length}`);
  let mdContent = "";
  const apiCompleted = api.filter((i) => i.state === "completed");
  const apiWantToRead = api.filter((i) => i.state === "want-to-read");
  const apiReading = api.filter((i) => i.state === "reading");
  if (apiReading.length)
    mdContent += `\n\n### ⌛ Currently reading (${apiReading.length})\n\n${apiReading
      .map(
        (i) =>
          `[![Book cover of ${i.title.replace(
            /\"/g,
            ""
          )}](https://images.weserv.nl/?url=${encodeURIComponent(
            i.image
          )}&w=128&h=196&fit=contain)](https://github.com/${owner}/${repo}/issues/${
            i.issueNumber
          } "${i.title.replace(/\"/g, "")} by ${i.authors.join(", ")}")`
      )
      .join("\n")}`;
  if (apiCompleted.length)
    mdContent += `\n\n### ✅ Completed (${apiCompleted.length})\n\n${apiCompleted
      .map(
        (i) =>
          `[![Book cover of ${i.title.replace(
            /\"/g,
            ""
          )}](https://images.weserv.nl/?url=${encodeURIComponent(
            i.image
          )}&w=128&h=196&fit=contain)](https://github.com/${owner}/${repo}/issues/${
            i.issueNumber
          } "${i.title.replace(/\"/g, "")} by ${i.authors
            .join(", ")
            .replace(/\"/g, "")} completed in ${i.timeToCompleteFormatted} on ${new Date(
            i.completedAt || ""
          ).toLocaleDateString("en-us", {
            month: "long",
            year: "numeric",
          })}")`
      )
      .join("\n")}`;
  if (apiWantToRead.length)
    mdContent += `\n\n### ⏭️ Want to Read (${apiWantToRead.length})\n\n${apiWantToRead
      .map(
        (i) =>
          `[![Book cover of ${i.title.replace(
            /\"/g,
            ""
          )}](https://images.weserv.nl/?url=${encodeURIComponent(
            i.image
          )}&w=128&h=196&fit=contain)](https://github.com/${owner}/${repo}/issues/${
            i.issueNumber
          } "${i.title.replace(/\"/g, "")} by ${i.authors
            .join(", ")
            .replace(/\"/g, "")} completed in ${i.timeToCompleteFormatted} on ${new Date(
            i.completedAt || ""
          ).toLocaleDateString("en-us", {
            month: "long",
            year: "numeric",
          })}")`
      )
      .join("\n")}`;
  debug(`Generated README.md content of length ${mdContent.length}`);
  const content = await promises.readFile(join(".", "README.md"), "utf8");
  debug(`Read README.md file of length ${content.length}`);
  await promises.writeFile(
    join(".", "README.md"),
    content.split("<!--start:bookshelf-action-->")[0] +
      `<!--start:bookshelf-action-->\n${format(mdContent, {
        parser: "markdown",
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
