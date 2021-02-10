declare module "goodreads-api-node" {
  export default function gr(credentials: {
    key: string;
    secret: string;
  }): {
    searchBooks(params: {
      q: string;
      page?: number;
      field?: "title" | "author" | "all";
    }): Promise<{
      search: {
        query: string;
        "results-start": string;
        "results-end": string;
        "total-results": string;
        results: {
          work: {
            id: {
              // _: "44323440";
              _: string;
              type: "integer";
            };
            books_count: {
              // _: "1";
              _: string;
              type: "integer";
            };
            ratings_count: {
              // _: "9";
              _: string;
              type: "integer";
            };
            text_reviews_count: {
              // _: "0";
              _: string;
              type: "integer";
            };
            original_publication_year: {
              // _: "2014";
              _: string;
              type: "integer";
            };
            original_publication_month: {
              // _: "8";
              _: string;
              type: "integer";
            };
            original_publication_day: {
              // _: "2";
              _: string;
              type: "integer";
            };
            average_rating: string;
            // average_rating: "4.67";
            best_book: {
              type: "Book";
              id: {
                _: string;
                // _: "24703920";
                type: "integer";
              };
              title: string;
              // title: "Steve Jobs by Walter Isaacson ;A Review";
              author: {
                id: {
                  _: string;
                  // _: "7967487";
                  type: "integer";
                };
                name: string;
                // name: "Noman salehzada";
              };
              image_url: string;
              small_image_url: string;
            };
          }[];
        };
      };
    }>;
  };
}
