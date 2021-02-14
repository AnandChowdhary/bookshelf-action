import { debug } from "@actions/core";
import { Context } from "@actions/github/lib/context";
import type { GitHub } from "@actions/github/lib/utils";
import HumanizeDuration from "humanize-duration";
import { updateSummary } from "./update-summary";

export const onCloseIssue = async (
  owner: string,
  repo: string,
  context: Context,
  octokit: InstanceType<typeof GitHub>
) => {
  debug("Started onCloseIssue");
  const issue = await octokit.issues.get({
    owner: context.issue.owner,
    repo: context.issue.repo,
    issue_number: context.issue.number,
  });
  debug(`Got issue #${issue.data.number}`);
  await octokit.issues.unlock({
    owner: context.issue.owner,
    repo: context.issue.repo,
    issue_number: context.issue.number,
  });
  debug("Unlocked issue");
  await octokit.issues.createComment({
    owner: context.issue.owner,
    repo: context.issue.repo,
    issue_number: context.issue.number,
    body: `You completed this book in ${HumanizeDuration(
      new Date(issue.data.closed_at).getTime() - new Date(issue.data.created_at).getTime()
    )}, great job!`,
  });
  debug(`Created comment in issue #${issue.data.number}`);
  await octokit.issues.lock({
    owner: context.issue.owner,
    repo: context.issue.repo,
    issue_number: context.issue.number,
  });
  debug("Locked issue");
  await octokit.issues.addLabels({
    owner: context.issue.owner,
    repo: context.issue.repo,
    issue_number: context.issue.number,
    labels: [
      `completed: ${new Date().toLocaleString("en", { month: "long" }).toLowerCase()}`,
      `completed: ${new Date().getUTCFullYear()}`,
    ],
  });
  debug(`Added "completed" labels to issue #${issue.data.number}`);
  const currentPercentage = issue.data.title.match(/\(\d+\%\)/g);
  await octokit.issues.update({
    owner: context.issue.owner,
    repo: context.issue.repo,
    issue_number: context.issue.number,
    title:
      currentPercentage && currentPercentage.length
        ? `${issue.data.title.split(currentPercentage[0])[0].trim()} (${100}%)`
        : `${issue.data.title.trim()} (${100}%)`,
  });
  await updateSummary(owner, repo, context, octokit);
};
