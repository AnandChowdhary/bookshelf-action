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
const prettier_1 = require("prettier");
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
                    ? humanize_duration_1.default(new Date(issue.closed_at).getTime() - new Date(issue.created_at).getTime())
                    : undefined,
            });
        }
        else
            core_1.debug(`Unable to find JSON data for #${issue.id}`);
    }
    await fs_1.promises.writeFile(path_1.join(".", "api.json"), JSON.stringify(api, null, 2) + "\n");
    core_1.debug("Written api.json file");
    const apiLeft = api.filter((_, i) => i % 2 !== 0);
    const apiRight = api.filter((_, i) => i % 2 === 0);
    core_1.debug(`api has length ${api.length}`);
    core_1.debug(`apiLeft has length ${apiLeft.length}`);
    core_1.debug(`apiRight has length ${apiRight.length}`);
    let mdContent = "<table>";
    [apiLeft, apiRight].forEach((apiItem) => {
        apiItem.forEach((_, i) => {
            if (i % 2 === 0)
                mdContent += "<tr>";
            if (apiItem[i])
                mdContent += `<td>
    <table>
      <tr>
        <td>
          <a href="https://github.com/${owner}/${repo}/issues/${apiItem[i].issueNumber}"><img alt="" src="${apiItem[i].image}" height="128"></a>
        </td>   
        <td>
          <strong><a href="https://github.com/${owner}/${repo}/issues/${apiItem[i].issueNumber}">${apiItem[i].title}</a></strong><br>
          ${apiItem[i].authors
                    .map((i) => `<a href="https://github.com/${owner}/${repo}/issues?q=is%3Aissue+label%3A%22author%3A+${encodeURIComponent(i)}%22">${i}</a>`)
                    .join(", ")}<br><br>
          ${apiItem[i].state === "completed"
                    ? `✔️ <a href="https://github.com/${owner}/${repo}/issues?q=is%3Aissue+is%3Aclosed">Completed</a><br>${apiItem[i].timeToComplete
                        ? `⌛ ${humanize_duration_1.default(apiItem[i].timeToComplete || 0)}`
                        : ""}`
                    : `⌛ Reading${apiItem[i].progressPercent ? ` (${apiItem[i].progressPercent}%)` : ""}`}<br>
          ${apiItem[i].completedAt
                    ? `📅 <a href="https://github.com/${owner}/${repo}/issues?q=is%3Aissue+is%3Aclosed+label%3A%22completed%3A+${new Date(apiItem[i].completedAt || 0)
                        .toLocaleDateString("en", {
                        month: "long",
                    })
                        .toLowerCase()}%22">${new Date(apiItem[i].completedAt || 0).toLocaleDateString("en", {
                        month: "long",
                    })}</a> <a href="https://github.com/${owner}/${repo}/issues?q=is%3Aissue+is%3Aclosed+label%3A%22completed%3A+${new Date(apiItem[i].completedAt || 0).getUTCFullYear()}%22#">${new Date(apiItem[i].completedAt || 0).getUTCFullYear()}</a>`
                    : ""}
        </td>
      </tr>
    </table>
  </td>
  `;
            if (i % 2 === 0)
                mdContent += "</tr>";
        });
    });
    mdContent += "</table>";
    core_1.debug(`Generated README.md content of length ${mdContent.length}`);
    const content = await fs_1.promises.readFile(path_1.join(".", "README.md"), "utf8");
    core_1.debug(`Read README.md file of length ${content.length}`);
    await fs_1.promises.writeFile(path_1.join(".", "README.md"), content.split("<!--start:bookshelf-action-->")[0] +
        `<!--start:bookshelf-action-->\n${prettier_1.format(mdContent, {
            parser: "html",
        })}\n<!--end:bookshelf-action-->` +
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