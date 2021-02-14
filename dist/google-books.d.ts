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
export declare const search: (q: string) => Promise<BookResult>;
