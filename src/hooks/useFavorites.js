import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@kidoro_favorites';

export default function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(FAVORITES_KEY);
        if (stored) setFavoriteIds(JSON.parse(stored));
      } catch (e) {}
      setLoaded(true);
    })();
  }, []);

  const persist = useCallback(async (ids) => {
    try { await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(ids)); } catch (e) {}
  }, []);

  const isFavorite = useCallback((videoId) => favoriteIds.includes(videoId), [favoriteIds]);

  const toggleFavorite = useCallback(async (videoId) => {
    const updated = favoriteIds.includes(videoId)
      ? favoriteIds.filter(id => id !== videoId)
      : [...favoriteIds, videoId];
    setFavoriteIds(updated);
    await persist(updated);
  }, [favoriteIds, persist]);

  const clearFavorites = useCallback(async () => {
    setFavoriteIds([]);
    await persist([]);
  }, [persist]);

  return { favoriteIds, loaded, isFavorite, toggleFavorite, clearFavorites };
}
