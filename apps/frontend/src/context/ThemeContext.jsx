import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

const THEME_KEY = 'theme_mode';

function getSystemTheme() {
  if (typeof window === 'undefined') return THEMES.LIGHT;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? THEMES.DARK
    : THEMES.LIGHT;
}

function getInitialTheme() {
  if (typeof window === 'undefined') return THEMES.SYSTEM;
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored && Object.values(THEMES).includes(stored)) {
      return stored;
    }
    // Fallback support for older theme storage
    if (stored === 'dark') return THEMES.DARK;
    if (stored === 'light') return THEMES.LIGHT;
  } catch (e) {
    console.warn('localStorage not available:', e);
  }
  return THEMES.SYSTEM;
}

function applyThemeClasses(effectiveTheme) {
  const root = document.documentElement;
  const body = document.body;

  root.classList.remove('light', 'dark', 'dark-mode');
  body.classList.remove('light', 'dark', 'dark-mode');

  if (effectiveTheme === THEMES.DARK) {
    root.classList.add('dark', 'dark-mode');
    body.classList.add('dark', 'dark-mode');
  } else {
    root.classList.add('light');
    body.classList.add('light');
  }

  const metaTheme = document.querySelector('meta[name="theme-color"]') || document.getElementById('dynamic-theme-color');
  if (metaTheme) {
    metaTheme.setAttribute(
      'content',
      effectiveTheme === THEMES.DARK ? '#000000' : '#ffffff'
    );
  }
}

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);
  const [resolvedTheme, setResolvedTheme] = useState(() => {
    const initial = getInitialTheme();
    return initial === THEMES.SYSTEM ? getSystemTheme() : initial;
  });

  useEffect(() => {
    let effective = theme;
    if (theme === THEMES.SYSTEM) {
      effective = getSystemTheme();
    }
    setResolvedTheme(effective);
    applyThemeClasses(effective);

    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      console.warn('Cannot persist theme:', e);
    }
  }, [theme]);

  useEffect(() => {
    if (theme !== THEMES.SYSTEM) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const newSystemTheme = getSystemTheme();
      setResolvedTheme(newSystemTheme);
      applyThemeClasses(newSystemTheme);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [theme]);

  const setTheme = useCallback((newTheme) => {
    if (!Object.values(THEMES).includes(newTheme)) {
      console.warn(`Invalid theme: ${newTheme}`);
      return;
    }
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(current => {
      if (current === THEMES.LIGHT) return THEMES.DARK;
      if (current === THEMES.DARK) return THEMES.LIGHT;
      return getSystemTheme() === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    });
  }, []);

  const value = useMemo(() => ({
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === THEMES.DARK,
    isLight: resolvedTheme === THEMES.LIGHT,
    isSystem: theme === THEMES.SYSTEM,
  }), [theme, resolvedTheme, setTheme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
