import { useEffect, useState, useCallback } from 'react';

export const THEME_KEY = 'beecarbon-theme';
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

export function getSystemTheme() {
  if (typeof window === 'undefined') return THEMES.LIGHT;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? THEMES.DARK
    : THEMES.LIGHT;
}

export function getInitialTheme() {
  if (typeof window === 'undefined') return THEMES.SYSTEM;
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored && Object.values(THEMES).includes(stored)) {
      return stored;
    }
  } catch (e) {
    console.warn('localStorage not available:', e);
  }
  return THEMES.SYSTEM;
}

export function applyTheme(theme) {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  const body = document.body;

  // Retirer toutes les classes de thème d'abord
  root.classList.remove('light', 'dark', 'dark-mode');
  if (body) {
    body.classList.remove('light', 'dark', 'dark-mode');
  }

  let effectiveTheme = theme;
  if (theme === THEMES.SYSTEM) {
    effectiveTheme = getSystemTheme();
  }

  if (effectiveTheme === THEMES.DARK) {
    root.classList.add('dark');
    if (body) body.classList.add('dark', 'dark-mode');
  } else {
    root.classList.add('light');
    if (body) body.classList.add('light');
  }

  // Mettre à jour la meta theme-color pour mobile
  const metaTheme = document.querySelector('meta[name="theme-color"]') || document.getElementById('dynamic-theme-color');
  if (metaTheme) {
    metaTheme.setAttribute(
      'content',
      effectiveTheme === THEMES.DARK ? '#000000' : '#ffffff'
    );
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState(getInitialTheme);
  const [resolvedTheme, setResolvedTheme] = useState(() => {
    const initial = getInitialTheme();
    return initial === THEMES.SYSTEM ? getSystemTheme() : initial;
  });

  // Appliquer le thème au montage et à chaque changement
  useEffect(() => {
    applyTheme(theme);

    let effective = theme;
    if (theme === THEMES.SYSTEM) {
      effective = getSystemTheme();
    }
    setResolvedTheme(effective);

    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      console.warn('Cannot persist theme:', e);
    }
  }, [theme]);

  // Écouter les changements système (prefers-color-scheme)
  useEffect(() => {
    if (theme !== THEMES.SYSTEM) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      applyTheme(THEMES.SYSTEM);
      setResolvedTheme(getSystemTheme());
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [theme]);

  // Synchroniser entre onglets (storage event)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === THEME_KEY && e.newValue && Object.values(THEMES).includes(e.newValue)) {
        setThemeState(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

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

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === THEMES.DARK,
    isLight: resolvedTheme === THEMES.LIGHT,
    isSystem: theme === THEMES.SYSTEM,
  };
}
