import got from "got/dist/source";

export interface Book {
  kind: "books#volume";
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    publisher: string;
    publishedDate: string;
    description: string;
    industryIdentifiers: [
      {
        type: "ISBN_13";
        identifier: string;
      },
      {
        type: "ISBN_10";
        identifier: string;
      }
    ];
    pageCount: number;
    printType: "BOOK";
    categories: string[];
    averageRating: number;
    ratingsCount: number;
    maturityRating: "MATURE" | "NOT_MATURE";
    imageLinks: {
      thumbnail: string;
    };
    language: string;
    previewLink: string;
    infoLink: string;
    canonicalVolumeLink: string;
  };
}

export interface BookResult {
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  description: string;
  image: string;
  language: string;
  averageRating: number;
  ratingsCount: number;
  categories: string[];
  pageCount: number;
  isbn10?: string;
  isbn13?: string;
  googleBooks: {
    id: string;
    preview: string;
    info: string;
    canonical: string;
  };
}

export const selectBestBook = (items: Book[]): Book => {
  if (!items.length) throw new Error("Book not found");

  // Google Books already returns results in relevance order for the query. Sorting
  // by popularity can pick a more-reviewed but less-relevant book with a similar
  // title, which is surprising when the API's first result is the exact match.
  return items[0];
};

const rateLimitRetryDelaysMs = [1000, 3000, 5000];

const isRateLimitError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  (error as { response?: { statusCode?: number } }).response?.statusCode === 429;

const wait = async (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const search = async (q: string): Promise<BookResult> => {
  let results: { body: { items?: Book[] } } | undefined;
  const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(q)}`;

  for (let attempt = 0; !results; attempt += 1) {
    try {
      results = await got<{
        items: Book[];
      }>(url, {
        responseType: "json",
      });
    } catch (error) {
      if (!isRateLimitError(error) || attempt >= rateLimitRetryDelaysMs.length) throw error;
      await wait(rateLimitRetryDelaysMs[attempt]);
    }
  }

  if (!results.body.items || results.body.items.length === 0) {
    console.error("No results.body.items", JSON.stringify(results.body));
    throw new Error("Book not found");
  }
  const result = selectBestBook(results.body.items);

  return {
    title: result.volumeInfo.title,
    authors: result.volumeInfo.authors,
    publisher: result.volumeInfo.publisher,
    publishedDate: result.volumeInfo.publishedDate,
    description: result.volumeInfo.description,
    image:
      (result.volumeInfo.imageLinks || {}).thumbnail ||
      `https://tse2.mm.bing.net/th?q=${encodeURIComponent(
        `${result.volumeInfo.title} by ${result.volumeInfo.authors.join(", ")}`
      )}&w=256&c=7&rs=1&p=0&dpr=3&pid=1.7&mkt=en-IN&adlt=moderate`,
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
