"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onNewIssue = void 0;
const core_1 = require("@actions/core");
const locale_codes_1 = require("locale-codes");
const update_summary_1 = require("./update-summary");
const google_books_1 = require("../google-books");
const onNewIssue = async (owner, repo, context, octokit) => {
    core_1.debug("Started onNewIssue");
    const issue = await octokit.issues.get({
        owner: context.issue.owner,
        repo: context.issue.repo,
        issue_number: context.issue.number,
    });
    core_1.debug(`Got issue #${issue.data.number}`);
    let body = "<!-- This comment is autogenerated by bookshelf-action <https://github.com/AnandChowdhary/bookshelf-action> -->\n\n";
    const labels = [
        "kind: book",
        `started: ${new Date().toLocaleString("en", { month: "long" }).toLowerCase()}`,
        `started: ${new Date().getUTCFullYear()}`,
    ];
    try {
        core_1.debug(`Searching for "${issue.data.title}"`);
        const details = await google_books_1.search(issue.data.title);
        body += `Congrats on starting **${details.title}** by ${details.authors.join(", ")}, I hope you enjoy it! It has an average of ${details.averageRating}/5 stars and ${details.ratingsCount.toLocaleString()} ratings on [Google Books](${details.googleBooks.info}).\n\n<details>
 <summary>Book details (JSON)</summary>

\`\`\`json
${JSON.stringify(details, null, 2)}
\`\`\`

</details>`;
        details.authors.forEach((i) => labels.push(`author: ${i.toLowerCase()}`));
        details.categories.forEach((i) => labels.push(`category: ${i.toLowerCase()}`));
        if (details.publishedDate) {
            labels.push(`year: ${details.publishedDate}`);
            labels.push(`decade: ${Math.floor(Number(details.publishedDate) / 10) * 10}s`);
        }
        if (details.language)
            labels.push(`language: ${(locale_codes_1.getByTag(details.language).name || details.language).toLowerCase()}`);
        if (details.publisher)
            labels.push(`publisher: ${details.publisher.toLowerCase()}`);
        core_1.debug("Added labels from search results");
    }
    catch (error) {
        console.log(error);
        core_1.debug(`Got an error in search results: ${error.toString()}`);
        body +=
            "I couldn't find details about this book using the Google Books API. Don't worry, you can still track it.\n\n";
    }
    body += `When you're finished with reading this book, just close this issue and I'll mark it as completed. Best of luck! 👍`;
    await octokit.issues.createComment({
        owner: context.issue.owner,
        repo: context.issue.repo,
        issue_number: context.issue.number,
        body,
    });
    core_1.debug("Added comment to issue");
    await octokit.issues.addLabels({
        owner: context.issue.owner,
        repo: context.issue.repo,
        issue_number: context.issue.number,
        labels,
    });
    core_1.debug("Added all labels to issue");
    await octokit.issues.lock({
        owner: context.issue.owner,
        repo: context.issue.repo,
        issue_number: context.issue.number,
    });
    core_1.debug("Locked issue");
    await update_summary_1.updateSummary(owner, repo, context, octokit);
};
exports.onNewIssue = onNewIssue;
//# sourceMappingURL=new-issue.js.map