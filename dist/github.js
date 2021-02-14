"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDetailsToLabels = void 0;
const locale_codes_1 = require("locale-codes");
const randomcolor_1 = __importDefault(require("randomcolor"));
/**
 * Convert a string to title case and trim it
 * @private
 * @param str - String to clean up
 */
const clean = (str) => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()).trim();
const addDetailsToLabels = async (owner, repo, octokit) => {
    const labels = await octokit.issues.listLabelsForRepo({ owner, repo });
    for await (const label of labels.data) {
        let color = label.color;
        let description = label.description;
        if (label.color === "ededed")
            color = randomcolor_1.default({ luminosity: "light" });
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
                description = `This book was published in ${locale_codes_1.getByTag(label.name.split("language: ")[1].trim())}`;
            else if (label.name.startsWith("publisher: "))
                description = `This book was published by ${clean(label.name.split("publisher: ")[1])}`;
            else if (label.name.startsWith("author: "))
                description = `This book was written by ${clean(label.name.split("author: ")[1])}`;
            else if (label.name.startsWith("category: "))
                description = `This book is of the category "${clean(label.name.split("category: ")[1])}"`;
        }
        if (color !== label.color || description !== label.description)
            await octokit.issues.updateLabel({ owner, repo, name: label.name, color, description });
    }
};
exports.addDetailsToLabels = addDetailsToLabels;
//# sourceMappingURL=github.js.map