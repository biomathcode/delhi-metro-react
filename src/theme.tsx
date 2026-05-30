/* eslint-disable react-refresh/only-export-components */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const themeStorageKey = 'delhi-metro-theme';

const getBrowserTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';

  const storedTheme = window.localStorage.getItem(themeStorageKey);
  if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;

  return getBrowserTheme();
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [hasUserThemePreference, setHasUserThemePreference] = useState(() => {
    if (typeof window === 'undefined') return false;

    const storedTheme = window.localStorage.getItem(themeStorageKey);
    return storedTheme === 'light' || storedTheme === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
    if (hasUserThemePreference) {
      window.localStorage.setItem(themeStorageKey, theme);
    }
  }, [hasUserThemePreference, theme]);

  useEffect(() => {
    if (hasUserThemePreference) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateThemeFromBrowser = () => setThemeState(mediaQuery.matches ? 'dark' : 'light');

    updateThemeFromBrowser();
    mediaQuery.addEventListener('change', updateThemeFromBrowser);

    return () => mediaQuery.removeEventListener('change', updateThemeFromBrowser);
  }, [hasUserThemePreference]);

  const setTheme = useCallback((nextTheme: Theme) => {
    setHasUserThemePreference(true);
    setThemeState(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setHasUserThemePreference(true);
    setThemeState((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark');
  }, []);

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    setTheme,
    toggleTheme,
  }), [setTheme, theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');

  return context;
}
