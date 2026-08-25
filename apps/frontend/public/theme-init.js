// Script anti-FOUC (Flash of Unstyled Content) exécuté avant le montage React
(function() {
  const THEME_KEY = 'beecarbon-theme';

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  try {
    const stored = localStorage.getItem(THEME_KEY);
    const theme = stored && ['light', 'dark', 'system'].includes(stored)
      ? stored
      : 'system';

    const effective = theme === 'system' ? getSystemTheme() : theme;

    if (effective === 'dark') {
      document.documentElement.classList.add('dark');
      if (document.body) document.body.classList.add('dark', 'dark-mode');
    } else {
      document.documentElement.classList.add('light');
      if (document.body) document.body.classList.remove('dark', 'dark-mode');
    }
  } catch (e) {
    document.documentElement.classList.add('light');
  }
})();
