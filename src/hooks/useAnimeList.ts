import { useState, useCallback, useRef, useEffect } from 'react';
import { Anime, AnimeCategory } from '../types/anime';
import { 
  fetchAnimeRecommendations, 
  fetchTrendingAnime,
  fetchUpcomingAnime,
  fetchPopularAnime
} from '../services/animeService';
import { FilterValues } from '../types/filters';

export const useAnimeList = () => {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AnimeCategory>('trending');
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchAnimeByCategory = useCallback(async (category: AnimeCategory, filters?: FilterValues) => {
    if (!isMounted.current) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let results: Anime[] = [];
      
      switch (category) {
        case 'trending':
          results = await fetchTrendingAnime();
          break;
        case 'upcoming':
          results = await fetchUpcomingAnime();
          break;
        case 'popular':
          results = await fetchPopularAnime();
          break;
        case 'search':
          if (filters) {
            results = await fetchAnimeRecommendations(
              filters.genre,
              filters.year ? parseInt(filters.year) : undefined,
              filters.rating,
              filters.episodes ? parseInt(filters.episodes) : undefined
            );
          }
          break;
      }

      if (!isMounted.current) return;
      
      if (results.length === 0) {
        setError('No anime found matching your criteria.');
        setAnimeList([]);
      } else {
        setAnimeList(results.filter(anime => 
          anime && 
          anime.mal_id && 
          anime.title && 
          anime.images?.jpg?.image_url
        ));
      }
      setCurrentIndex(0);
    } catch (err) {
      if (!isMounted.current) return;
      setError(err instanceof Error ? err.message : 'Failed to fetch anime. Please try again.');
      setAnimeList([]);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const handleTabChange = useCallback(async (tab: AnimeCategory) => {
    setActiveTab(tab);
    await fetchAnimeByCategory(tab);
  }, [fetchAnimeByCategory]);

  const handleSearch = useCallback(async (filters: FilterValues) => {
    setActiveTab('search');
    await fetchAnimeByCategory('search', filters);
  }, [fetchAnimeByCategory]);

  const showMore = useCallback(() => {
    if (activeTab === 'search' && animeList.length > 0) {
      setCurrentIndex((prev) => (prev + 3 >= animeList.length ? 0 : prev + 3));
    }
  }, [animeList.length, activeTab]);

  const getCurrentAnime = useCallback(() => {
    if (activeTab === 'search') {
      return animeList.slice(currentIndex, currentIndex + 3);
    }
    return animeList.slice(0, 9);
  }, [animeList, currentIndex, activeTab]);

  return {
    animeList,
    currentAnime: getCurrentAnime(),
    loading,
    error,
    activeTab,
    handleTabChange,
    handleSearch,
    showMore,
  };
};