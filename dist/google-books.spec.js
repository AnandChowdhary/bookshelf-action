"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const source_1 = __importDefault(require("got/dist/source"));
const google_books_1 = require("./google-books");
jest.mock("got/dist/source", () => jest.fn());
const mockedGot = source_1.default;
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
describe("search", () => {
    beforeEach(() => {
        mockedGot.mockReset();
    });
    it("retries rate-limited Google Books requests before returning details", async () => {
        const book = makeBook("The Pragmatic Programmer", 42);
        const rateLimitError = Object.assign(new Error("Response code 429 (Too Many Requests)"), {
            response: { statusCode: 429 },
        });
        mockedGot.mockRejectedValueOnce(rateLimitError).mockResolvedValueOnce({ body: { items: [book] } });
        const result = await (0, google_books_1.search)("The Pragmatic Programmer");
        expect(result.title).toBe("The Pragmatic Programmer");
        expect(mockedGot).toHaveBeenCalledTimes(2);
    });
});
//# sourceMappingURL=google-books.spec.js.map