"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSummary = void 0;
const core_1 = require("@actions/core");
const fs_1 = require("fs");
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const path_1 = require("path");
const shelljs_1 = require("shelljs");
const github_1 = require("../github");
const updateSummary = async (owner, repo, context, octokit) => {
    core_1.debug("Starting updateSummary");
    const issues = await octokit.issues.listForRepo({
        owner: context.issue.owner,
        repo: context.issue.repo,
        labels: "kind: book",
        state: "all",
    });
    core_1.debug(`Got ${issues.data.length} issues`);
    const api = [];
    for await (const issue of issues.data) {
        const comments = await octokit.issues.listComments({
            owner: context.issue.owner,
            repo: context.issue.repo,
            issue_number: issue.number,
        });
        core_1.debug(`Got ${comments.data.length} comments in issue ${issue.number}`);
        let json = undefined;
        try {
            comments.data.forEach((comment) => {
                if (comment.body.includes("Book details (JSON)"))
                    json = JSON.parse(comment.body.split("```json")[1].split("```")[0]);
            });
        }
        catch (error) {
            console.log("JSON parsing error", error);
        }
        if (json) {
            core_1.debug(`Found JSON data for ${json.title}`);
            const currentPercentage = issue.title.match(/\(\d+\%\)/g);
            api.push({
                ...json,
                issueNumber: issue.number,
                progressPercent: currentPercentage && currentPercentage.length && !isNaN(parseInt(currentPercentage[0]))
                    ? parseInt(currentPercentage[0])
                    : 0,
                state: issue.state === "open" ? "reading" : "completed",
                startedAt: new Date(issue.created_at).toISOString(),
                completedAt: issue.state === "closed" ? new Date(issue.closed_at).toISOString() : undefined,
                timeToComplete: issue.state === "closed"
                    ? new Date(issue.closed_at).getTime() - new Date(issue.created_at).getTime()
                    : undefined,
                timeToCompleteFormatted: issue.state === "closed"
                    ? humanize_duration_1.default(new Date(issue.closed_at).getTime() - new Date(issue.created_at).getTime()).split(",")[0]
                    : undefined,
            });
        }
        else
            core_1.debug(`Unable to find JSON data for #${issue.id}`);
    }
    await fs_1.promises.writeFile(path_1.join(".", "api.json"), JSON.stringify(api, null, 2) + "\n");
    core_1.debug("Written api.json file");
    core_1.debug(`api has length ${api.length}`);
    let mdContent = "";
    const apiCompleted = api.filter((i) => i.state === "completed");
    const apiReading = api.filter((i) => i.state === "reading");
    if (apiReading.length)
        mdContent += `### ⌛ Currently reading (${apiReading.length})\n\n${apiReading
            .map((i) => `<a href="https://github.com/${owner}/${repo}/issues/${i.issueNumber}" title="${i.title} by ${i.authors.join(", ")}"><img alt="${i.title}" src="${i.image}"></a>`)
            .join("\n")}`;
    if (apiCompleted.length)
        mdContent += `### ✅ Completed (${apiCompleted.length})\n\n${apiCompleted
            .map((i) => `<a href="https://github.com/${owner}/${repo}/issues/${i.issueNumber}" title="${i.title} by ${i.authors.join(", ")} completed in ${i.timeToCompleteFormatted} on ${new Date(i.completedAt || "").toLocaleDateString("en-us", { month: "long" })}"><img alt="${i.title}" src="${i.image}"></a>`)
            .join("\n")}`;
    core_1.debug(`Generated README.md content of length ${mdContent.length}`);
    const content = await fs_1.promises.readFile(path_1.join(".", "README.md"), "utf8");
    core_1.debug(`Read README.md file of length ${content.length}`);
    await fs_1.promises.writeFile(path_1.join(".", "README.md"), content.split("<!--start:bookshelf-action-->")[0] +
        `<!--start:bookshelf-action-->\n${mdContent}\n<!--end:bookshelf-action-->` +
        content.split("<!--end:bookshelf-action-->")[1]);
    core_1.debug("Written README.md file");
    shelljs_1.exec(`git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"`);
    shelljs_1.exec(`git config --global user.name "github-actions[bot]"`);
    core_1.debug("Added git config user details");
    shelljs_1.exec("git add .");
    shelljs_1.exec('git commit -m ":bento: Update API and README summary [skip ci]"');
    core_1.debug("Committed to git history");
    shelljs_1.exec("git push");
    core_1.debug("Pushed to repository");
    await github_1.addDetailsToLabels(owner, repo, octokit);
    core_1.debug("Updated label details");
};
exports.updateSummary = updateSummary;
//# sourceMappingURL=update-summary.js.map