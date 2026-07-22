import { useState, useEffect, useCallback } from 'react';
import { getItem, setItem } from '../utils/storage';

const YT_ICON_KEY = '@kidoro_yt_icon';

let alternateAppIcons = null;
try {
  alternateAppIcons = require('expo-alternate-app-icons');
} catch (e) {
  // Native module not linked in Expo Go / current dev build
}

/**
 * useYTIcon — manages the YouTube-style app icon toggle.
 * Safely handles missing native module in Expo Go or custom dev client.
 */
export default function useYTIcon() {
  const [showYTIcon, setShowYTIcon] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [switching, setSwitching] = useState(false);

  // Load saved preference on mount
  useEffect(() => {
    (async () => {
      try {
        if (alternateAppIcons && typeof alternateAppIcons.getAppIconName === 'function') {
          const currentIcon = await alternateAppIcons.getAppIconName();
          if (currentIcon === 'YouTubeIcon') {
            setShowYTIcon(true);
            setLoaded(true);
            return;
          }
        }
        const stored = await getItem(YT_ICON_KEY);
        if (stored !== null) {
          setShowYTIcon(stored === 'true');
        }
      } catch (e) { /* silent fallback */ }
      setLoaded(true);
    })();
  }, []);

  const toggleYTIcon = useCallback(async () => {
    const next = !showYTIcon;
    setSwitching(true);

    try {
      if (alternateAppIcons && typeof alternateAppIcons.setAlternateAppIcon === 'function') {
        if (next) {
          await alternateAppIcons.setAlternateAppIcon('YouTubeIcon');
        } else {
          await alternateAppIcons.setAlternateAppIcon(null);
        }
      }
      setShowYTIcon(next);
      await setItem(YT_ICON_KEY, next ? 'true' : 'false');
    } catch (e) {
      console.warn('App icon switch failed:', e);
    } finally {
      setSwitching(false);
    }
  }, [showYTIcon]);

  return { showYTIcon, toggleYTIcon, loaded, switching };
}
