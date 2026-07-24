import { useState, useEffect, useCallback } from 'react';
import { getItem, setItem } from '../utils/storage';
import { getActiveChild } from '../services/api';

export default function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [currentChildId, setCurrentChildId] = useState(null);

  const getFavoritesKey = useCallback(async () => {
    const child = await getActiveChild();
    const accessKey = child?.access_key || 'global';
    return `@kidoro_favorites_${accessKey}`;
  }, []);

  useEffect(() => {
    let active = true;
    const checkChild = async () => {
      try {
        const child = await getActiveChild();
        const childId = child?.id || null;
        if (childId !== currentChildId) {
          if (active) {
            setCurrentChildId(childId);
            const accessKey = child?.access_key || 'global';
            const stored = await getItem(`@kidoro_favorites_${accessKey}`);
            if (stored) {
              setFavoriteIds(JSON.parse(stored));
            } else {
              setFavoriteIds([]);
            }
            setLoaded(true);
          }
        }
      } catch (e) {}
    };

    checkChild();
    const interval = setInterval(checkChild, 500);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [currentChildId]);

  const persist = useCallback(async (ids) => {
    try {
      const key = await getFavoritesKey();
      await setItem(key, JSON.stringify(ids));
    } catch (e) {}
  }, [getFavoritesKey]);

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
