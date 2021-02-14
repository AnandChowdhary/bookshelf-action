"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onCloseIssue = void 0;
const core_1 = require("@actions/core");
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const update_summary_1 = require("./update-summary");
const onCloseIssue = async (owner, repo, context, octokit) => {
    core_1.debug("Started onCloseIssue");
    const issue = await octokit.issues.get({
        owner: context.issue.owner,
        repo: context.issue.repo,
        issue_number: context.issue.number,
    });
    core_1.debug(`Got issue #${issue.data.number}`);
    await octokit.issues.unlock({
        owner: context.issue.owner,
        repo: context.issue.repo,
        issue_number: context.issue.number,
    });
    core_1.debug("Unlocked issue");
    await octokit.issues.createComment({
        owner: context.issue.owner,
        repo: context.issue.repo,
        issue_number: context.issue.number,
        body: `You completed this book in ${humanize_duration_1.default(new Date(issue.data.closed_at).getTime() - new Date(issue.data.created_at).getTime())}, great job!`,
    });
    core_1.debug(`Created comment in issue #${issue.data.number}`);
    await octokit.issues.lock({
        owner: context.issue.owner,
        repo: context.issue.repo,
        issue_number: context.issue.number,
    });
    core_1.debug("Locked issue");
    await octokit.issues.addLabels({
        owner: context.issue.owner,
        repo: context.issue.repo,
        issue_number: context.issue.number,
        labels: [
            `completed: ${new Date().toLocaleString("en", { month: "long" }).toLowerCase()}`,
            `completed: ${new Date().getUTCFullYear()}`,
        ],
    });
    core_1.debug(`Added "completed" labels to issue #${issue.data.number}`);
    const currentPercentage = issue.data.title.match(/\(\d+\%\)/g);
    await octokit.issues.update({
        owner: context.issue.owner,
        repo: context.issue.repo,
        issue_number: context.issue.number,
        title: currentPercentage && currentPercentage.length
            ? `${issue.data.title.split(currentPercentage[0])[0].trim()} (${100}%)`
            : `${issue.data.title.trim()} (${100}%)`,
    });
    await update_summary_1.updateSummary(owner, repo, context, octokit);
};
exports.onCloseIssue = onCloseIssue;
//# sourceMappingURL=close-issue.js.map