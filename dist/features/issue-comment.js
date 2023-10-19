"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onIssueComment = void 0;
const core_1 = require("@actions/core");
const cosmic_1 = require("@anandchowdhary/cosmic");
const update_summary_1 = require("./update-summary");
const onIssueComment = async (owner, repo, context, octokit) => {
    (0, core_1.debug)("Started onIssueComment");
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
    if (!issue.data.labels.find((i) => typeof i === "string" ? i === "kind: book" : i.name === "kind: book"))
        return (0, core_1.debug)('Issue not of "kind: book", skipping');
    if ((issue.data.body || "").includes("This comment is autogenerated"))
        return (0, core_1.debug)("Comment was autogenerated, skipping");
    const comments = await octokit.rest.issues.listComments({
        owner: context.issue.owner,
        repo: context.issue.repo,
        issue_number: context.issue.number,
    });
    (0, core_1.debug)(`Got ${comments.data.length} comments in issue`);
    if (comments.data.length < 2)
        return (0, core_1.debug)("Less than 2 comments, skipping");
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
    (0, core_1.debug)("Got JSON data for book");
    if (json)
        (0, core_1.debug)(`Total pages in JSON are ${json.pageCount}`);
    const lastComment = comments.data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    if (!lastComment)
        throw new Error("Last comment not found");
    (0, core_1.debug)(`Found last comment #${lastComment.id}`);
    let progressPercent = 0;
    let totalPages = json ? json.pageCount : 1;
    if ((lastComment.body || "").includes("/")) {
        (0, core_1.debug)("Last comment includes slash so must have length");
        const num = (lastComment.body || "").split("/")[1].match(/\d+/g);
        if (num && num.length) {
            (0, core_1.debug)(`Got ${num.length} numerical matches`);
            const potentialPages = parseInt(num[0]);
            if (!isNaN(potentialPages)) {
                if (potentialPages)
                    totalPages = potentialPages;
                (0, core_1.debug)(`Total pages from comment are ${totalPages}`);
            }
        }
    }
    else
        (0, core_1.debug)("Last comment doesn't have slash");
    (0, core_1.debug)(`Total pages in book are ${totalPages}`);
    const valuesInComment = (lastComment.body || "").match(/\d+\%?/g);
    if (valuesInComment && valuesInComment.length) {
        (0, core_1.debug)(`Got ${valuesInComment.length} numerical matches`);
        const values = valuesInComment.map((val) => parseInt(val)).filter((val) => !isNaN(val));
        const firstVal = valuesInComment[0];
        (0, core_1.debug)(`Potential value is ${firstVal}`);
        if (values.length)
            if (firstVal.includes("%") && !isNaN(parseInt(firstVal))) {
                progressPercent = parseInt(firstVal);
                (0, core_1.debug)(`Potential value has % sign: ${progressPercent}`);
            }
            else {
                progressPercent = Math.min(Math.round((100 * values[0]) / totalPages), 100);
                (0, core_1.debug)(`Potential value is in pages: ${values[0]}`);
                (0, core_1.debug)(`Potential percent count rounded: ${Math.round((100 * values[0]) / totalPages)}`);
            }
    }
    (0, core_1.debug)(`Progress is ${progressPercent}%`);
    if (progressPercent !== 0) {
        try {
            await octokit.rest.reactions.createForIssueComment({
                owner: context.issue.owner,
                repo: context.issue.repo,
                issue_number: context.issue.number,
                comment_id: lastComment.id,
                content: "+1",
            });
            (0, core_1.debug)("Added reaction to comment");
        }
        catch (error) {
            (0, core_1.debug)("Unable to add reaction to comment");
        }
        const currentPercentage = issue.data.title.match(/\(\d+\%\)/g);
        await octokit.rest.issues.update({
            owner: context.issue.owner,
            repo: context.issue.repo,
            issue_number: context.issue.number,
            title: currentPercentage && currentPercentage.length
                ? `${issue.data.title.split(currentPercentage[0])[0].trim()} (${progressPercent}%)`
                : `${issue.data.title.trim()} (${progressPercent}%)`,
        });
        (0, core_1.debug)("Updated issue title with progress");
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
    }
    await (0, update_summary_1.updateSummary)(owner, repo, context, octokit);
};
exports.onIssueComment = onIssueComment;
//# sourceMappingURL=issue-comment.js.map