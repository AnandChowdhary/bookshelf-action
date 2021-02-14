"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = void 0;
const source_1 = __importDefault(require("got/dist/source"));
const search = async (q) => {
    const results = await source_1.default(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(q)}`);
    const result = results.body.items.sort((a, b) => (Number(b.volumeInfo.ratingsCount) || 0) - (Number(a.volumeInfo.ratingsCount) || 0))[0];
    if (!result)
        throw new Error("Book not found");
    return {
        title: result.volumeInfo.title,
        authors: result.volumeInfo.authors,
        publisher: result.volumeInfo.publisher,
        publishedDate: result.volumeInfo.publishedDate,
        description: result.volumeInfo.description,
        image: result.volumeInfo.imageLinks.thumbnail,
        language: result.volumeInfo.language,
        averageRating: result.volumeInfo.averageRating,
        ratingsCount: result.volumeInfo.ratingsCount,
        categories: result.volumeInfo.categories,
        pageCount: result.volumeInfo.pageCount,
        isbn10: (result.volumeInfo.industryIdentifiers.find((i) => i.type === "ISBN_10") || {})
            .identifier,
        isbn13: (result.volumeInfo.industryIdentifiers.find((i) => i.type === "ISBN_13") || {})
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