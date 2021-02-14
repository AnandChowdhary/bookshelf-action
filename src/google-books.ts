import got from "got/dist/source";

export interface Book {
  kind: "books#volume";
  id: string;
  volumeInfo: {
    title: string;
    authors: string;
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

export const search = async (q: string) => {
  const results = await got<{
    items: Book[];
  }>(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(q)}`);
  const result = results.body.items.sort(
    (a, b) => (Number(b.volumeInfo.ratingsCount) || 0) - (Number(a.volumeInfo.ratingsCount) || 0)
  )[0];
  if (!result) throw new Error("Book not found");

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
    isbn10: result.volumeInfo.industryIdentifiers.find((i) => i.type === "ISBN_10"),
    isbn13: result.volumeInfo.industryIdentifiers.find((i) => i.type === "ISBN_13"),
    googleBooks: {
      id: result.id,
      preview: result.volumeInfo.previewLink,
      info: result.volumeInfo.infoLink,
      canonical: result.volumeInfo.canonicalVolumeLink,
    },
  };
};
