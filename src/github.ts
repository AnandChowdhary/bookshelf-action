import type { GitHub } from "@actions/github/lib/utils";
import type { IssuesListLabelsForRepoResponseData } from "@octokit/types";
import randomColor from "randomcolor";

/**
 * Convert a string to title case and trim it
 * @private
 * @param str - String to clean up
 */
const clean = (str: string) =>
  str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()).trim();

export const addDetailsToLabels = async (
  owner: string,
  repo: string,
  octokit: InstanceType<typeof GitHub>
) => {
  const options = octokit.issues.listLabelsForRepo.endpoint.merge({ owner, repo });
  for await (const labels of octokit.paginate.iterator(options)) {
    for await (const label of labels.data as IssuesListLabelsForRepoResponseData) {
      let color = label.color;
      let description = label.description;
      if (label.color === "ededed") color = randomColor({ luminosity: "light" }).replace("#", "");
      if (label.description === null) {
        if (label.name === "kind: book")
          description = "This issue tracks a book (reading progress)";
        else if (label.name.startsWith("started: "))
          description = `This book was started in ${clean(label.name.split("started: ")[1])}`;
        else if (label.name.startsWith("completed: "))
          description = `This book was completed in ${clean(label.name.split("completed: ")[1])}`;
        else if (label.name.startsWith("year: "))
          description = `This book was published in ${clean(label.name.split("year: ")[1])}`;
        else if (label.name.startsWith("decade: "))
          description = `This book was published in the ${clean(label.name.split("decade: ")[1])}s`;
        else if (label.name.startsWith("language: "))
          description = `This book was published in ${clean(label.name.split("language: ")[1])}`;
        else if (label.name.startsWith("publisher: "))
          description = `This book was published by ${clean(label.name.split("publisher: ")[1])}`;
        else if (label.name.startsWith("author: "))
          description = `This book was written by ${clean(label.name.split("author: ")[1])}`;
        else if (label.name.startsWith("category: "))
          description = `This book is of the category "${clean(
            label.name.split("category: ")[1]
          )}"`;
      }
      if (color !== label.color || description !== label.description)
        await octokit.issues.updateLabel({ owner, repo, name: label.name, color, description });
    }
  }
};
