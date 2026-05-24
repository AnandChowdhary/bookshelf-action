"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = exports.selectBestBook = void 0;
const source_1 = __importDefault(require("got/dist/source"));
const selectBestBook = (items) => {
    if (!items.length)
        throw new Error("Book not found");
    // Google Books already returns results in relevance order for the query. Sorting
    // by popularity can pick a more-reviewed but less-relevant book with a similar
    // title, which is surprising when the API's first result is the exact match.
    return items[0];
};
exports.selectBestBook = selectBestBook;
const search = async (q) => {
    const results = await (0, source_1.default)(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(q)}`, {
        responseType: "json",
    });
    if (!results.body.items || results.body.items.length === 0) {
        console.error("No results.body.items", JSON.stringify(results.body));
        throw new Error("Book not found");
    }
    const result = (0, exports.selectBestBook)(results.body.items);
    return {
        title: result.volumeInfo.title,
        authors: result.volumeInfo.authors,
        publisher: result.volumeInfo.publisher,
        publishedDate: result.volumeInfo.publishedDate,
        description: result.volumeInfo.description,
        image: (result.volumeInfo.imageLinks || {}).thumbnail ||
            `https://tse2.mm.bing.net/th?q=${encodeURIComponent(`${result.volumeInfo.title} by ${result.volumeInfo.authors.join(", ")}`)}&w=256&c=7&rs=1&p=0&dpr=3&pid=1.7&mkt=en-IN&adlt=moderate`,
        language: result.volumeInfo.language,
        averageRating: result.volumeInfo.averageRating,
        ratingsCount: result.volumeInfo.ratingsCount,
        categories: result.volumeInfo.categories,
        pageCount: result.volumeInfo.pageCount,
        isbn10: ((result.volumeInfo.industryIdentifiers || []).find((i) => i.type === "ISBN_10") || {})
            .identifier,
        isbn13: ((result.volumeInfo.industryIdentifiers || []).find((i) => i.type === "ISBN_13") || {})
            .identifier,
        googleBooks: {
            id: result.id,
            preview: result.volumeInfo.previewLink,
            info: result.volumeInfo.infoLink,
            canonical: result.volumeInfo.canonicalVolumeLink,
        },
    };
};
exports.search = search;
//# sourceMappingURL=google-books.js.map