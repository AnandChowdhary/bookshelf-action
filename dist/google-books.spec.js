"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const google_books_1 = require("./google-books");
const makeBook = (title, ratingsCount) => ({
    kind: "books#volume",
    id: title.toLowerCase().replace(/\s+/g, "-"),
    volumeInfo: {
        title,
        authors: ["Example Author"],
        publisher: "Example Publisher",
        publishedDate: "2024-01-01",
        description: `${title} description`,
        industryIdentifiers: [
            { type: "ISBN_13", identifier: "9780000000000" },
            { type: "ISBN_10", identifier: "0000000000" },
        ],
        pageCount: 123,
        printType: "BOOK",
        categories: ["Computers"],
        averageRating: 4,
        ratingsCount,
        maturityRating: "NOT_MATURE",
        imageLinks: {
            thumbnail: `https://example.com/${encodeURIComponent(title)}.jpg`,
        },
        language: "en",
        previewLink: `https://example.com/${encodeURIComponent(title)}/preview`,
        infoLink: `https://example.com/${encodeURIComponent(title)}/info`,
        canonicalVolumeLink: `https://example.com/${encodeURIComponent(title)}`,
    },
});
describe("selectBestBook", () => {
    it("keeps Google Books relevance order instead of sorting by popularity", () => {
        const relevantResult = makeBook("Operating Systems: Three Easy Pieces", 12);
        const morePopularButLessRelevantResult = makeBook("Operating System Concepts", 275);
        expect((0, google_books_1.selectBestBook)([relevantResult, morePopularButLessRelevantResult])).toBe(relevantResult);
    });
    it("throws when Google Books returns no items", () => {
        expect(() => (0, google_books_1.selectBestBook)([])).toThrow("Book not found");
    });
});
//# sourceMappingURL=google-books.spec.js.map