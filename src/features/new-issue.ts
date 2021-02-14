import { debug } from "@actions/core";
import { Context } from "@actions/github/lib/context";
import type { GitHub } from "@actions/github/lib/utils";
import { getByTag } from "locale-codes";
import { updateSummary } from "./update-summary";
import { search } from "../google-books";

export const onNewIssue = async (
  owner: string,
  repo: string,
  context: Context,
  octokit: InstanceType<typeof GitHub>
) => {
  debug("Started onNewIssue");
  const issue = await octokit.issues.get({
    owner: context.issue.owner,
    repo: context.issue.repo,
    issue_number: context.issue.number,
  });
  debug(`Got issue #${issue.data.number}`);
  let body =
    "<!-- This comment is autogenerated by book-tracker <https://github.com/AnandChowdhary/book-tracker> -->\n\n";
  const labels: string[] = [
    "kind: book",
    `started: ${new Date().toLocaleString("en", { month: "long" }).toLowerCase()}`,
    `started: ${new Date().getUTCFullYear()}`,
  ];
  try {
    debug(`Searching for "${issue.data.title}"`);
    const details = await search(issue.data.title);
    body += `Congrats on starting **${details.title}** by ${details.authors.join(
      ", "
    )}, I hope you enjoy it! It has an average of ${
      details.averageRating
    }/5 stars and ${details.ratingsCount.toLocaleString()} ratings on [Google Books](${
      details.googleBooks.info
    }).\n\n<details>
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
      labels.push(
        `language: ${(getByTag(details.language).name || details.language).toLowerCase()}`
      );
    if (details.publisher) labels.push(`publisher: ${details.publisher.toLowerCase()}`);
    debug("Added labels from search results");
  } catch (error) {
    console.log(error);
    debug(`Got an error in search results: ${error.toString()}`);
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
  debug("Added comment to issue");
  await octokit.issues.addLabels({
    owner: context.issue.owner,
    repo: context.issue.repo,
    issue_number: context.issue.number,
    labels,
  });
  debug("Added all labels to issue");
  await octokit.issues.lock({
    owner: context.issue.owner,
    repo: context.issue.repo,
    issue_number: context.issue.number,
  });
  debug("Locked issue");
  await updateSummary(owner, repo, context, octokit);
};
