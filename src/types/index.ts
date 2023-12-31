export interface MovieObject {
  id: string;
  reviews: number[];
  title: string;
  filmCompanyId: string;
  cost: number;
  releaseYear: number;
  movieCompanyName?: string;
  averageReviewScore?: number;
}
