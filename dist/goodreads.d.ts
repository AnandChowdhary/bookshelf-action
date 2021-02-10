interface Book {
    title: string;
    author: string;
    image: string;
    year: number;
    goodreads: {
        id: number;
        image: string;
        ratingsCount: number;
        averageRating: number;
        authorId: number;
    };
}
export declare const search: (key: string, secret: string, q: string) => Promise<Book>;
export {};
