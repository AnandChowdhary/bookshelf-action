import { debug } from "@actions/core";
import { Context } from "@actions/github/lib/context";
import type { GitHub } from "@actions/github/lib/utils";
import { BookResult } from "../google-books";
import { updateSummary } from "./update-summary";

export const onIssueComment = async (
  owner: string,
  repo: string,
  context: Context,
  octokit: InstanceType<typeof GitHub>
) => {
  debug("Started onIssueComment");
  const issue = await octokit.issues.get({
    owner: context.issue.owner,
    repo: context.issue.repo,
    issue_number: context.issue.number,
  });
  debug(`Got issue #${issue.data.number}`);
  if (!issue.data.labels.find((i) => i.name === "kind: book"))
    return debug('Issue not of "kind: book", skipping');
  if (issue.data.body.includes("This comment is autogenerated"))
    return debug("Comment was autogenerated, skipping");

  const comments = await octokit.issues.listComments({
    owner: context.issue.owner,
    repo: context.issue.repo,
    issue_number: context.issue.number,
  });
  debug(`Got ${comments.data.length} comments in issue`);
  if (comments.data.length < 2) return debug("Less than 2 comments, skipping");

  let json: BookResult | undefined = undefined;
  try {
    comments.data.forEach((comment) => {
      if (comment.body.includes("Book details (JSON)"))
        json = JSON.parse(comment.body.split("```json")[1].split("```")[0]) as BookResult;
    });
  } catch (error) {
    console.log("JSON parsing error", error);
  }
  debug("Got JSON data for book");
  if (json) debug(`Total pages in JSON are ${(json as BookResult).pageCount}`);

  const lastComment = comments.data.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0];
  if (!lastComment) throw new Error("Last comment not found");
  debug(`Found last comment #${lastComment.id}`);
  let progressPercent = 0;
  let totalPages = json ? (json as BookResult).pageCount : 1;
  if (lastComment.body.includes("/")) {
    debug("Last comment includes slash so must have length");
    const num = lastComment.body.split("/")[1].match(/\d+/g);
    if (num && num.length) {
      debug(`Got ${num.length} numerical matches`);
      const potentialPages = parseInt(num[0]);
      if (!isNaN(potentialPages)) {
        totalPages = potentialPages;
        debug(`Total pages in book are ${totalPages}`);
      }
    }
  } else debug("Last comment doesn't have slash");
  debug(`Total pages in book are ${totalPages}`);
  const valuesInComment = lastComment.body.match(/\d+\%?/g);
  if (valuesInComment && valuesInComment.length) {
    debug(`Got ${valuesInComment.length} numerical matches`);
    const values = valuesInComment.map((val) => parseInt(val)).filter((val) => !isNaN(val));
    const firstVal = valuesInComment[0];
    debug(`Potential value is ${firstVal}`);
    if (values.length)
      if (firstVal.includes("%") && !isNaN(parseInt(firstVal))) {
        progressPercent = parseInt(firstVal);
        debug(`Potential value has % sign: ${progressPercent}`);
      } else {
        progressPercent = Math.min(Math.round(values[0] / totalPages), 100);
        debug(`Potential value is in pages: ${values[0]}`);
        debug(`Potential percent count: ${Math.round(values[0] / totalPages)}`);
      }
  }
  debug(`Progress is ${progressPercent}%`);
  if (progressPercent !== 0) {
    try {
      await octokit.reactions.createForIssueComment({
        owner: context.issue.owner,
        repo: context.issue.repo,
        issue_number: context.issue.number,
        comment_id: lastComment.id,
        content: "+1",
      });
      debug("Added reaction to comment");
    } catch (error) {
      debug("Unable to add reaction to comment");
    }
    const currentPercentage = issue.data.title.match(/\(\d+\%\)/g);
    await octokit.issues.update({
      owner: context.issue.owner,
      repo: context.issue.repo,
      issue_number: context.issue.number,
      title:
        currentPercentage && currentPercentage.length
          ? `${issue.data.title.split(currentPercentage[0])} (${progressPercent}%)`
          : `${issue.data.title} (${progressPercent}%)`,
    });
    debug("Updated issue title with progress");
  }
  await updateSummary(owner, repo, context, octokit);
};
