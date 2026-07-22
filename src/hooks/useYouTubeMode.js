import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAlternateAppIcon, getAppIconName } from 'expo-alternate-app-icons';

const YT_ICON_KEY = '@kidoro_yt_icon';

/**
 * useYTIcon — manages the YouTube-style app icon toggle.
 * Uses expo-alternate-app-icons to switch the actual iOS/Android home screen icon.
 */
export default function useYTIcon() {
  const [showYTIcon, setShowYTIcon] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [switching, setSwitching] = useState(false);

  // Load saved preference on mount
  useEffect(() => {
    (async () => {
      try {
        // Check if the current app icon is already the YouTube icon
        const currentIcon = await getAppIconName();
        if (currentIcon === 'YouTubeIcon') {
          setShowYTIcon(true);
        } else {
          // Fall back to AsyncStorage preference
          const stored = await AsyncStorage.getItem(YT_ICON_KEY);
          if (stored !== null) {
            setShowYTIcon(stored === 'true');
          }
        }
      } catch (e) { /* silent fallback */ }
      setLoaded(true);
    })();
  }, []);

  const toggleYTIcon = useCallback(async () => {
    const next = !showYTIcon;
    setSwitching(true);

    try {
      if (next) {
        // Switch to YouTube icon
        await setAlternateAppIcon('YouTubeIcon');
      } else {
        // Reset to default icon
        await setAlternateAppIcon(null);
      }
      // Success — update state and persist
      setShowYTIcon(next);
      await AsyncStorage.setItem(YT_ICON_KEY, next ? 'true' : 'false');
    } catch (e) {
      // If icon change fails, revert
      console.warn('App icon switch failed:', e);
    } finally {
      setSwitching(false);
    }
  }, [showYTIcon]);

  return { showYTIcon, toggleYTIcon, loaded, switching };
}
