"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
const close_issue_1 = require("./features/close-issue");
const issue_comment_1 = require("./features/issue-comment");
const new_issue_1 = require("./features/new-issue");
const update_summary_1 = require("./features/update-summary");
const token = (0, core_1.getInput)("token") || process.env.GH_PAT || process.env.GITHUB_TOKEN;
const [owner, repo] = (process.env.GITHUB_REPOSITORY || "").split("/");
const run = async () => {
    const COMMAND = (0, core_1.getInput)("command");
    (0, core_1.debug)(`Got command: ${COMMAND}`);
    if (!COMMAND)
        throw new Error("Command not found");
    if (!token)
        throw new Error("GitHub token not found");
    const octokit = (0, github_1.getOctokit)(token);
    if (COMMAND === "onNewIssue")
        return (0, new_issue_1.onNewIssue)(owner, repo, github_1.context, octokit);
    if (COMMAND === "onCloseIssue")
        return (0, close_issue_1.onCloseIssue)(owner, repo, github_1.context, octokit);
    if (COMMAND === "onIssueComment")
        return (0, issue_comment_1.onIssueComment)(owner, repo, github_1.context, octokit);
    if (COMMAND === "updateSummary")
        return (0, update_summary_1.updateSummary)(owner, repo, github_1.context, octokit);
    throw new Error("Command not recognized");
};
exports.run = run;
(0, exports.run)()
    .then(() => { })
    .catch((error) => {
    console.error("ERROR", error);
    (0, core_1.setFailed)(error.message);
});
//# sourceMappingURL=index.js.map