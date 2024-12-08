import axios from 'axios';
import { AnimeResponse } from '../types/anime';

const BASE_URL = 'https://api.jikan.moe/v4';

// Add delay to respect API rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const handleApiError = (error: unknown, context: string): never => {
  console.error(`Error ${context}:`, error);
  throw new Error(`Failed to fetch ${context}. Please try again later.`);
};

export const fetchAnimeRecommendations = async (
  genre?: string,
  year?: number,
  rating?: string,
  episodes?: number
): Promise<AnimeResponse['data']> => {
  try {
    await delay(1000);
    const params = {
      limit: '10',
      sfw: 'true',
      order_by: 'score',
      sort: 'desc',
      ...(genre && { genres: genre }),
      ...(year && { start_date: `${year}-01-01`, end_date: `${year}-12-31` }),
      ...(rating && { rating }),
      ...(episodes && { max_episodes: episodes.toString() }),
    };

    const response = await axios.get<AnimeResponse>(`${BASE_URL}/anime`, { params });
    return response.data.data;
  } catch (error) {
    handleApiError(error, 'recommendations');
  }
};

export const fetchTrendingAnime = async (): Promise<AnimeResponse['data']> => {
  try {
    await delay(1000);
    const response = await axios.get<AnimeResponse>(`${BASE_URL}/top/anime`, {
      params: {
        filter: 'airing',
        limit: 9,
        sfw: true,
      },
    });
    return response.data.data;
  } catch (error) {
    handleApiError(error, 'trending anime');
  }
};

export const fetchUpcomingAnime = async (): Promise<AnimeResponse['data']> => {
  try {
    await delay(1000);
    const response = await axios.get<AnimeResponse>(`${BASE_URL}/seasons/upcoming`, {
      params: {
        limit: 9,
        sfw: true,
      },
    });
    return response.data.data;
  } catch (error) {
    handleApiError(error, 'upcoming anime');
  }
};

export const fetchPopularAnime = async (): Promise<AnimeResponse['data']> => {
  try {
    await delay(1000);
    const response = await axios.get<AnimeResponse>(`${BASE_URL}/top/anime`, {
      params: {
        filter: 'bypopularity',
        limit: 9,
        sfw: true,
      },
    });
    return response.data.data;
  } catch (error) {
    handleApiError(error, 'popular anime');
  }
};