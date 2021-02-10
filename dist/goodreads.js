"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = void 0;
const goodreads_api_node_1 = __importDefault(require("goodreads-api-node"));
const search = async (key, secret, q) => {
    const gr = goodreads_api_node_1.default({ key, secret });
    const results = await gr.searchBooks({ q });
    const result = Array.isArray(results.search.results.work)
        ? results.search.results.work.sort((a, b) => (parseInt(b.ratings_count._) || 0) - (parseInt(a.ratings_count._) || 0))[0]
        : results.search.results.work;
    if (!result)
        throw new Error("Book not found");
    return {
        title: result.best_book.title,
        author: result.best_book.author.name,
        image: result.best_book.image_url,
        year: parseInt(result.original_publication_year._),
        goodreads: {
            id: parseInt(result.best_book.id._),
            ratingsCount: parseFloat(result.ratings_count._),
            averageRating: parseFloat(result.average_rating),
            authorId: parseInt(result.best_book.author.id._),
        },
    };
};
exports.search = search;
//# sourceMappingURL=goodreads.js.map