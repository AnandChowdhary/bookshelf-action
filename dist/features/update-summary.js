"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSummary = void 0;
const core_1 = require("@actions/core");
const cosmic_1 = require("@anandchowdhary/cosmic");
const fs_1 = require("fs");
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const path_1 = require("path");
const prettier_1 = require("prettier");
const shelljs_1 = require("shelljs");
const github_1 = require("../github");
const updateSummary = async (owner, repo, context, octokit) => {
    (0, core_1.debug)("Starting updateSummary");
    try {
        await (0, cosmic_1.cosmic)("bookshelf");
        (0, core_1.debug)("Got config object");
    }
    catch (error) { }
    const issues = await octokit.rest.issues.listForRepo({
        owner: context.issue.owner,
        repo: context.issue.repo,
        labels: "kind: book",
        state: "all",
    });
    (0, core_1.debug)(`Got ${issues.data.length} issues`);
    let api = [];
    for await (const issue of issues.data) {
        const comments = await octokit.rest.issues.listComments({
            owner: context.issue.owner,
            repo: context.issue.repo,
            issue_number: issue.number,
        });
        (0, core_1.debug)(`Got ${comments.data.length} comments in issue ${issue.number}`);
        let json = undefined;
        try {
            comments.data.forEach((comment) => {
                if ((comment.body || "").includes("Book details (JSON)"))
                    json = JSON.parse((comment.body || "").split("```json")[1].split("```")[0]);
            });
        }
        catch (error) {
            console.log("JSON parsing error", error);
        }
        const isWantToRead = issue.labels.find((label) => typeof label === "string" ? label === "want to read" : label.name === "want to read");
        if (isWantToRead)
            (0, core_1.debug)(`Book is in category "want to read"`);
        if (json) {
            (0, core_1.debug)(`Found JSON data for ${json.title}`);
            const currentPercentage = issue.title.match(/\(\d+\%\)/g);
            const overwrites = (0, cosmic_1.config)("overwrites") || {};
            const openedAt = (overwrites[issue.number] || {}).started
                ? overwrites[issue.number].started
                : issue.created_at;
            const closedAt = (overwrites[issue.number] || {}).completed
                ? overwrites[issue.number].completed
                : issue.closed_at;
            api.push({
                ...json,
                issueNumber: issue.number,
                progressPercent: currentPercentage && currentPercentage.length && !isNaN(parseInt(currentPercentage[0]))
                    ? parseInt(currentPercentage[0])
                    : 0,
                state: issue.state === "open" ? (isWantToRead ? "want-to-read" : "reading") : "completed",
                startedAt: new Date(openedAt).toISOString(),
                completedAt: issue.state === "closed" ? new Date(closedAt).toISOString() : undefined,
                timeToComplete: issue.state === "closed"
                    ? new Date(closedAt).getTime() - new Date(openedAt).getTime()
                    : undefined,
                timeToCompleteFormatted: issue.state === "closed"
                    ? (0, humanize_duration_1.default)(new Date(closedAt).getTime() - new Date(openedAt).getTime()).split(",")[0]
                    : undefined,
            });
        }
        else
            (0, core_1.debug)(`Unable to find JSON data for #${issue.id}`);
    }
    api = api.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
    await fs_1.promises.writeFile((0, path_1.join)(".", "api.json"), JSON.stringify(api, null, 2) + "\n");
    (0, core_1.debug)("Written api.json file");
    (0, core_1.debug)(`api has length ${api.length}`);
    let mdContent = "";
    const apiCompleted = api.filter((i) => i.state === "completed");
    const apiWantToRead = api.filter((i) => i.state === "want-to-read");
    const apiReading = api.filter((i) => i.state === "reading");
    if (apiReading.length)
        mdContent += `### ⌛ Currently reading (${apiReading.length})\n\n${apiReading
            .map((i) => `[![Book cover of ${i.title.replace(/\"/g, "")}](https://images.weserv.nl/?url=${encodeURIComponent(i.image)}&w=128&h=196&fit=contain)](https://github.com/${owner}/${repo}/issues/${i.issueNumber} "${i.title.replace(/\"/g, "")} by ${i.authors.join(", ")}")`)
            .join("\n")}`;
    if (apiCompleted.length)
        mdContent += `${apiReading.length ? "\n\n" : ""}### ✅ Completed (${apiCompleted.length})\n\n${apiCompleted
            .map((i) => `[![Book cover of ${i.title.replace(/\"/g, "")}](https://images.weserv.nl/?url=${encodeURIComponent(i.image)}&w=128&h=196&fit=contain)](https://github.com/${owner}/${repo}/issues/${i.issueNumber} "${i.title.replace(/\"/g, "")} by ${i.authors
            .join(", ")
            .replace(/\"/g, "")} completed in ${i.timeToCompleteFormatted} on ${new Date(i.completedAt || "").toLocaleDateString("en-us", {
            month: "long",
            year: "numeric",
        })}")`)
            .join("\n")}`;
    if (apiWantToRead.length)
        mdContent += `${apiCompleted.length ? "\n\n" : ""}### ⏭️ Want to Read (${apiWantToRead.length})\n\n${apiWantToRead
            .map((i) => `[![Book cover of ${i.title.replace(/\"/g, "")}](https://images.weserv.nl/?url=${encodeURIComponent(i.image)}&w=128&h=196&fit=contain)](https://github.com/${owner}/${repo}/issues/${i.issueNumber} "${i.title.replace(/\"/g, "")} by ${i.authors
            .join(", ")
            .replace(/\"/g, "")} completed in ${i.timeToCompleteFormatted} on ${new Date(i.completedAt || "").toLocaleDateString("en-us", {
            month: "long",
            year: "numeric",
        })}")`)
            .join("\n")}`;
    (0, core_1.debug)(`Generated README.md content of length ${mdContent.length}`);
    const content = await fs_1.promises.readFile((0, path_1.join)(".", "README.md"), "utf8");
    (0, core_1.debug)(`Read README.md file of length ${content.length}`);
    await fs_1.promises.writeFile((0, path_1.join)(".", "README.md"), content.split("<!--start:bookshelf-action-->")[0] +
        `<!--start:bookshelf-action-->\n${(0, prettier_1.format)(mdContent, {
            parser: "markdown",
        })}\n<!--end:bookshelf-action-->` +
        content.split("<!--end:bookshelf-action-->")[1]);
    (0, core_1.debug)("Written README.md file");
    (0, shelljs_1.exec)(`git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"`);
    (0, shelljs_1.exec)(`git config --global user.name "github-actions[bot]"`);
    (0, core_1.debug)("Added git config user details");
    (0, shelljs_1.exec)("git add .");
    (0, shelljs_1.exec)('git commit -m ":bento: Update API and README summary [skip ci]"');
    (0, core_1.debug)("Committed to git history");
    (0, shelljs_1.exec)("git push");
    (0, core_1.debug)("Pushed to repository");
    await (0, github_1.addDetailsToLabels)(owner, repo, octokit);
    (0, core_1.debug)("Updated label details");
};
exports.updateSummary = updateSummary;
//# sourceMappingURL=update-summary.js.map