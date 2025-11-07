import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

interface ThemeContextValue {
  theme: 'light' | 'dark';
  toggle: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'rotaperfeita_theme';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggle: () => setThemeState((prev) => (prev === 'light' ? 'dark' : 'light')),
      setTheme: (next: 'light' | 'dark') => setThemeState(next)
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
