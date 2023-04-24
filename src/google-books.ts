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

export const search = async (q: string): Promise<BookResult> => {
  const results = await got<{
    items: Book[];
  }>(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(q)}`, {
    responseType: "json",
  });
  if (!results.body.items || results.body.items.length === 0) {
    console.error("No results.body.items", JSON.stringify(results.body));
    throw new Error("Book not found");
  }
  const result = results.body.items.sort(
    (a, b) => (Number(b.volumeInfo.ratingsCount) || 0) - (Number(a.volumeInfo.ratingsCount) || 0)
  )[0];

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
