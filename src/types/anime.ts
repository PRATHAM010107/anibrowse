export interface AnimeResponse {
  data: Anime[];
  pagination: {
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

export interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  synopsis: string;
  score: number;
  episodes: number;
  year: number;
  rating: string;
  genres: {
    name: string;
  }[];
}

export type AnimeCategory = 'trending' | 'upcoming' | 'popular' | 'search';