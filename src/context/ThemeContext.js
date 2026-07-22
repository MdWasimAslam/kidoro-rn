import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTheme } from '../constants/theme';

const THEME_KEY = '@kidoro_theme_mode';
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load saved theme preference on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_KEY);
        if (stored !== null) {
          setIsDark(stored === 'dark');
        }
      } catch (e) { /* silent */ }
      setLoaded(true);
    })();
  }, []);

  const toggleTheme = useCallback(async () => {
    const next = !isDark;
    setIsDark(next);
    try {
      await AsyncStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
    } catch (e) { /* silent */ }
  }, [isDark]);

  const theme = useMemo(() => getTheme({ isDark }), [isDark]);
  const statusBarStyle = isDark ? 'light-content' : 'dark-content';

  const value = useMemo(() => ({
    isDark,
    toggleTheme,
    theme,
    colors: theme.colors,
    statusBarStyle,
    loaded,
  }), [isDark, toggleTheme, theme, statusBarStyle, loaded]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    const theme = getTheme({ isDark: false });
    return { isDark: false, toggleTheme: () => {}, theme, colors: theme.colors, statusBarStyle: 'dark-content', loaded: true };
  }
  return context;
}

export default ThemeContext;
