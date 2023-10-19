"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onCloseIssue = void 0;
const core_1 = require("@actions/core");
const cosmic_1 = require("@anandchowdhary/cosmic");
const slugify_1 = __importDefault(require("@sindresorhus/slugify"));
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const update_summary_1 = require("./update-summary");
const onCloseIssue = async (owner, repo, context, octokit) => {
    (0, core_1.debug)("Started onCloseIssue");
    try {
        await (0, cosmic_1.cosmic)("bookshelf");
        (0, core_1.debug)("Got config object");
    }
    catch (error) { }
    const issue = await octokit.rest.issues.get({
        owner: context.issue.owner,
        repo: context.issue.repo,
        issue_number: context.issue.number,
    });
    (0, core_1.debug)(`Got issue #${issue.data.number}`);
    if ((0, cosmic_1.config)("users") && Array.isArray((0, cosmic_1.config)("users"))) {
        if (!(0, cosmic_1.config)("users").find((i) => (issue.data.user || {}).login))
            return (0, core_1.debug)("User not allowed, skipping");
    }
    await octokit.rest.issues.unlock({
        owner: context.issue.owner,
        repo: context.issue.repo,
        issue_number: context.issue.number,
    });
    (0, core_1.debug)("Unlocked issue");
    if (!issue.data.closed_at)
        throw new Error("Closed date not found");
    await octokit.rest.issues.createComment({
        owner: context.issue.owner,
        repo: context.issue.repo,
        issue_number: context.issue.number,
        body: `You completed this book in ${(0, humanize_duration_1.default)(new Date(issue.data.closed_at).getTime() - new Date(issue.data.created_at).getTime())}, great job!`,
    });
    (0, core_1.debug)(`Created comment in issue #${issue.data.number}`);
    await octokit.rest.issues.lock({
        owner: context.issue.owner,
        repo: context.issue.repo,
        issue_number: context.issue.number,
    });
    (0, core_1.debug)("Locked issue");
    await octokit.rest.issues.addLabels({
        owner: context.issue.owner,
        repo: context.issue.repo,
        issue_number: context.issue.number,
        labels: [
            `completed: ${(0, slugify_1.default)(new Date().toLocaleString("en", { month: "long" }))}`,
            `completed: ${new Date().getUTCFullYear()}`,
        ],
    });
    (0, core_1.debug)(`Added "completed" labels to issue #${issue.data.number}`);
    const currentPercentage = issue.data.title.match(/\(\d+\%\)/g);
    await octokit.rest.issues.update({
        owner: context.issue.owner,
        repo: context.issue.repo,
        issue_number: context.issue.number,
        title: currentPercentage && currentPercentage.length
            ? `${issue.data.title.split(currentPercentage[0])[0].trim()} (${100}%)`
            : `${issue.data.title.trim()} (${100}%)`,
    });
    // Remove "want to read" label if it's there
    if (issue.data.labels.find((i) => typeof i === "string" ? i === "want to read" : i.name === "want to read")) {
        await octokit.rest.issues.removeLabel({
            owner: context.issue.owner,
            repo: context.issue.repo,
            issue_number: context.issue.number,
            name: "want to read",
        });
        (0, core_1.debug)("Removed 'want to read' label");
    }
    await (0, update_summary_1.updateSummary)(owner, repo, context, octokit);
};
exports.onCloseIssue = onCloseIssue;
//# sourceMappingURL=close-issue.js.map