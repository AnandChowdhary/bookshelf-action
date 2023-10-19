import { debug } from "@actions/core";
import { Context } from "@actions/github/lib/context";
import type { GitHub } from "@actions/github/lib/utils";
import { config, cosmic } from "@anandchowdhary/cosmic";
import slugify from "@sindresorhus/slugify";
import HumanizeDuration from "humanize-duration";
import { updateSummary } from "./update-summary";

export const onCloseIssue = async (
  owner: string,
  repo: string,
  context: Context,
  octokit: InstanceType<typeof GitHub>
) => {
  debug("Started onCloseIssue");
  try {
    await cosmic("bookshelf");
    debug("Got config object");
  } catch (error) {}
  const issue = await octokit.rest.issues.get({
    owner: context.issue.owner,
    repo: context.issue.repo,
    issue_number: context.issue.number,
  });
  debug(`Got issue #${issue.data.number}`);
  if (config("users") && Array.isArray(config("users"))) {
    if (!(config("users") as string[]).find((i) => (issue.data.user || {}).login))
      return debug("User not allowed, skipping");
  }
  await octokit.rest.issues.unlock({
    owner: context.issue.owner,
    repo: context.issue.repo,
    issue_number: context.issue.number,
  });
  debug("Unlocked issue");
  if (!issue.data.closed_at) throw new Error("Closed date not found");
  await octokit.rest.issues.createComment({
    owner: context.issue.owner,
    repo: context.issue.repo,
    issue_number: context.issue.number,
    body: `You completed this book in ${HumanizeDuration(
      new Date(issue.data.closed_at).getTime() - new Date(issue.data.created_at).getTime()
    )}, great job!`,
  });
  debug(`Created comment in issue #${issue.data.number}`);
  await octokit.rest.issues.lock({
    owner: context.issue.owner,
    repo: context.issue.repo,
    issue_number: context.issue.number,
  });
  debug("Locked issue");
  await octokit.rest.issues.addLabels({
    owner: context.issue.owner,
    repo: context.issue.repo,
    issue_number: context.issue.number,
    labels: [
      `completed: ${slugify(new Date().toLocaleString("en", { month: "long" }))}`,
      `completed: ${new Date().getUTCFullYear()}`,
    ],
  });
  debug(`Added "completed" labels to issue #${issue.data.number}`);
  const currentPercentage = issue.data.title.match(/\(\d+\%\)/g);
  await octokit.rest.issues.update({
    owner: context.issue.owner,
    repo: context.issue.repo,
    issue_number: context.issue.number,
    title:
      currentPercentage && currentPercentage.length
        ? `${issue.data.title.split(currentPercentage[0])[0].trim()} (${100}%)`
        : `${issue.data.title.trim()} (${100}%)`,
  });
  // Remove "want to read" label if it's there
  if (
    issue.data.labels.find((i) =>
      typeof i === "string" ? i === "want to read" : i.name === "want to read"
    )
  ) {
    await octokit.rest.issues.removeLabel({
      owner: context.issue.owner,
      repo: context.issue.repo,
      issue_number: context.issue.number,
      name: "want to read",
    });
    debug("Removed 'want to read' label");
  }
  await updateSummary(owner, repo, context, octokit);
};
