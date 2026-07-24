import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getItem, setItem } from '../utils/storage';
import { getActiveChild } from '../services/api';

const MAX_VIDEOS = 5;

function parseHistory(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const valid = parsed.filter(e => e.id && e.timestamp > weekAgo);
    valid.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    return valid.slice(0, MAX_VIDEOS);
  } catch (e) {
    return [];
  }
}

const ContinueWatchingContext = createContext({
  recentVideos: [],
  recordWatched: () => {},
  clearHistory: () => {},
  loaded: false,
  loadHistory: () => {},
});

export function ContinueWatchingProvider({ children }) {
  const [recentVideos, setRecentVideos] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [currentChildId, setCurrentChildId] = useState(null);

  const getWatchedKey = useCallback(async () => {
    const child = await getActiveChild();
    const accessKey = child?.access_key || 'global';
    return `@kidoro_continue_watching_${accessKey}`;
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
            const raw = await getItem(`@kidoro_continue_watching_${accessKey}`);
            setRecentVideos(parseHistory(raw));
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

  const loadHistory = useCallback(async () => {
    try {
      const key = await getWatchedKey();
      const raw = await getItem(key);
      setRecentVideos(parseHistory(raw));
    } catch (e) { /* silent */ }
  }, [getWatchedKey]);

  const recordWatched = useCallback(async (video) => {
    if (!video || !video.id) return;

    const entry = {
      id: video.id,
      title: video.title || '',
      thumbnail: video.thumbnail || '',
      youtubeId: video.youtubeId || '',
      timestamp: Date.now(),
    };

    setRecentVideos(prev => {
      const filtered = prev.filter(e => e.id !== entry.id);
      return [entry, ...filtered].slice(0, MAX_VIDEOS);
    });

    try {
      const key = await getWatchedKey();
      const raw = await getItem(key);
      const current = parseHistory(raw);
      const filtered = current.filter(e => e.id !== entry.id);
      const updated = [entry, ...filtered].slice(0, MAX_VIDEOS);
      await setItem(key, JSON.stringify(updated));
    } catch (e) { /* non-blocking */ }
  }, [getWatchedKey]);

  const clearHistory = useCallback(async () => {
    setRecentVideos([]);
    try {
      const key = await getWatchedKey();
      await setItem(key, JSON.stringify([]));
    } catch (e) {}
  }, [getWatchedKey]);

  return (
    <ContinueWatchingContext.Provider value={{ recentVideos, recordWatched, clearHistory, loaded, loadHistory }}>
      {children}
    </ContinueWatchingContext.Provider>
  );
}

export function useContinueWatchingContext() {
  return useContext(ContinueWatchingContext);
}

export default ContinueWatchingContext;
