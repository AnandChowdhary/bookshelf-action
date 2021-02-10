import goodreads from "goodreads-api-node";

interface Book {
  title: string;
  author: string;
  image: string;
  year: number;
  goodreads: {
    id: number;
    ratingsCount: number;
    averageRating: number;
    authorId: number;
  };
}

export const search = async (key: string, secret: string, q: string): Promise<Book> => {
  const gr = goodreads({ key, secret });
  const results = await gr.searchBooks({ q });
  const result = results.search.results.work.sort(
    (a, b) => (parseInt(a.ratings_count._) || 0) - (parseInt(b.ratings_count._) || 0)
  )[0];
  if (!result) throw new Error("Book not found");
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
