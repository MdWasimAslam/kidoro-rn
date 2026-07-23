import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getItem, setItem } from '../utils/storage';

const WATCHED_KEY = '@kidoro_continue_watching';
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

  // Load from AsyncStorage once on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await getItem(WATCHED_KEY);
        setRecentVideos(parseHistory(raw));
      } catch (e) { /* silent */ }
      setLoaded(true);
    })();
  }, []);

  // Public reload — reads AsyncStorage and updates shared state
  const loadHistory = useCallback(async () => {
    try {
      const raw = await getItem(WATCHED_KEY);
      setRecentVideos(parseHistory(raw));
    } catch (e) { /* silent */ }
  }, []);

  // Record a video as watched — updates shared state AND persists to AsyncStorage
  const recordWatched = useCallback(async (video) => {
    if (!video || !video.id) return;

    const entry = {
      id: video.id,
      title: video.title || '',
      thumbnail: video.thumbnail || '',
      youtubeId: video.youtubeId || '',
      timestamp: Date.now(),
    };

    // Update shared state immediately
    setRecentVideos(prev => {
      const filtered = prev.filter(e => e.id !== entry.id);
      return [entry, ...filtered].slice(0, MAX_VIDEOS);
    });

    // Persist to AsyncStorage (for persistence across app restarts)
    try {
      const raw = await getItem(WATCHED_KEY);
      const current = parseHistory(raw);
      const filtered = current.filter(e => e.id !== entry.id);
      const updated = [entry, ...filtered].slice(0, MAX_VIDEOS);
      await setItem(WATCHED_KEY, JSON.stringify(updated));
    } catch (e) { /* non-blocking */ }
  }, []);

  const clearHistory = useCallback(async () => {
    setRecentVideos([]);
    await setItem(WATCHED_KEY, JSON.stringify([]));
  }, []);

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
