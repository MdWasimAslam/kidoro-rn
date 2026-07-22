import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getItem, setItem } from '../utils/storage';
import { getTheme, COLORS as BASE_COLORS } from '../constants/theme';

const THEME_KEY = '@kidoro_theme_mode';
const ThemeContext = createContext();

export function ThemeProvider({ children, configColors }) {
  const [isDark, setIsDark] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load saved theme preference on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await getItem(THEME_KEY);
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
      await setItem(THEME_KEY, next ? 'dark' : 'light');
    } catch (e) { /* silent */ }
  }, [isDark]);

  const theme = useMemo(() => getTheme({ isDark }), [isDark]);

  const overridden = useMemo(() => {
    const c = { ...theme.COLORS };
    if (configColors?.primaryColor) {
      c.primary = configColors.primaryColor;
      c.primaryAlpha10 = configColors.primaryColor + '1A';
      c.primaryAlpha20 = configColors.primaryColor + '33';
    }
    if (configColors?.secondaryColor) c.secondary = configColors.secondaryColor;
    if (configColors?.accentColor) c.blue = configColors.accentColor;
    return c;
  }, [theme.COLORS, configColors]);

  const statusBarStyle = isDark ? 'light-content' : 'dark-content';

  const value = useMemo(() => ({
    isDark,
    toggleTheme,
    theme,
    colors: overridden,
    statusBarStyle,
    loaded,
  }), [isDark, toggleTheme, theme, overridden, statusBarStyle, loaded]);

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
    return { isDark: false, toggleTheme: () => {}, theme, colors: theme.COLORS, statusBarStyle: 'dark-content', loaded: true };
  }
  return context;
}

export default ThemeContext;
