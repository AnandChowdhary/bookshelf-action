import { debug, getInput, setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { onCloseIssue } from "./features/close-issue";
import { onIssueComment } from "./features/issue-comment";
import { onNewIssue } from "./features/new-issue";
import { updateSummary } from "./features/update-summary";

const token = getInput("token") || process.env.GH_PAT || process.env.GITHUB_TOKEN;
const [owner, repo] = (process.env.GITHUB_REPOSITORY || "").split("/");

export const run = async () => {
  const COMMAND = getInput("command");
  debug(`Got command: ${COMMAND}`);
  if (!COMMAND) throw new Error("Command not found");
  if (!token) throw new Error("GitHub token not found");

  const octokit = getOctokit(token);
  if (COMMAND === "onNewIssue") return onNewIssue(owner, repo, context, octokit);
  if (COMMAND === "onCloseIssue") return onCloseIssue(owner, repo, context, octokit);
  if (COMMAND === "onIssueComment") return onIssueComment(owner, repo, context, octokit);
  if (COMMAND === "updateSummary") return updateSummary(owner, repo, context, octokit);
  throw new Error("Command not recognized");
};

run()
  .then(() => {})
  .catch((error) => {
    console.error("ERROR", error);
    setFailed(error.message);
  });
