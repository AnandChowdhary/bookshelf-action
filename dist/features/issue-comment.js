"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onIssueComment = void 0;
const core_1 = require("@actions/core");
const update_summary_1 = require("./update-summary");
const onIssueComment = async (owner, repo, context, octokit) => {
    core_1.debug("Started onIssueComment");
    const issue = await octokit.issues.get({
        owner: context.issue.owner,
        repo: context.issue.repo,
        issue_number: context.issue.number,
    });
    core_1.debug(`Got issue #${issue.data.number}`);
    if (!issue.data.labels.find((i) => i.name === "kind: book"))
        return core_1.debug('Issue not of "kind: book", skipping');
    if (issue.data.body.includes("This comment is autogenerated"))
        return core_1.debug("Comment was autogenerated, skipping");
    const comments = await octokit.issues.listComments({
        owner: context.issue.owner,
        repo: context.issue.repo,
        issue_number: context.issue.number,
    });
    core_1.debug(`Got ${comments.data.length} comments in issue`);
    if (comments.data.length < 2)
        return core_1.debug("Less than 2 comments, skipping");
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
    core_1.debug("Got JSON data for book");
    if (json)
        core_1.debug(`Total pages in JSON are ${json.pageCount}`);
    const lastComment = comments.data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    if (!lastComment)
        throw new Error("Last comment not found");
    core_1.debug(`Found last comment #${lastComment.id}`);
    let progressPercent = 0;
    let totalPages = json ? json.pageCount : 1;
    if (lastComment.body.includes("/")) {
        core_1.debug("Last comment includes slash so must have length");
        const num = lastComment.body.split("/")[1].match(/\d+/g);
        if (num && num.length) {
            core_1.debug(`Got ${num.length} numerical matches`);
            const potentialPages = parseInt(num[0]);
            if (!isNaN(potentialPages)) {
                totalPages = potentialPages;
                core_1.debug(`Total pages in book are ${totalPages}`);
            }
        }
    }
    else
        core_1.debug("Last comment doesn't have slash");
    core_1.debug(`Total pages in book are ${totalPages}`);
    const valuesInComment = lastComment.body.match(/\d+\%?/g);
    if (valuesInComment && valuesInComment.length) {
        core_1.debug(`Got ${valuesInComment.length} numerical matches`);
        const values = valuesInComment.map((val) => parseInt(val)).filter((val) => !isNaN(val));
        const firstVal = valuesInComment[0];
        core_1.debug(`Potential value is ${firstVal}`);
        if (values.length)
            if (firstVal.includes("%") && !isNaN(parseInt(firstVal))) {
                progressPercent = parseInt(firstVal);
                core_1.debug(`Potential value has % sign: ${progressPercent}`);
            }
            else {
                progressPercent = Math.min(Math.round(values[0] / totalPages), 100);
                core_1.debug(`Potential value is in pages: ${values[0]}`);
                core_1.debug(`Potential percent count: ${Math.round(values[0] / totalPages)}`);
            }
    }
    core_1.debug(`Progress is ${progressPercent}%`);
    if (progressPercent !== 0) {
        try {
            await octokit.reactions.createForIssueComment({
                owner: context.issue.owner,
                repo: context.issue.repo,
                issue_number: context.issue.number,
                comment_id: lastComment.id,
                content: "+1",
            });
            core_1.debug("Added reaction to comment");
        }
        catch (error) {
            core_1.debug("Unable to add reaction to comment");
        }
        const currentPercentage = issue.data.title.match(/\(\d+\%\)/g);
        await octokit.issues.update({
            owner: context.issue.owner,
            repo: context.issue.repo,
            issue_number: context.issue.number,
            title: currentPercentage && currentPercentage.length
                ? `${issue.data.title.split(currentPercentage[0])} (${progressPercent}%)`
                : `${issue.data.title} (${progressPercent}%)`,
        });
        core_1.debug("Updated issue title with progress");
    }
    await update_summary_1.updateSummary(owner, repo, context, octokit);
};
exports.onIssueComment = onIssueComment;
//# sourceMappingURL=issue-comment.js.map