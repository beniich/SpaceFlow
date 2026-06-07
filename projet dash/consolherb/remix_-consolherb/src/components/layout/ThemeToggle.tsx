import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

/**
 * Simple toggle button for light/dark mode.
 * It displays a sun icon when the current theme is 'dark' and a moon when it's 'light'.
 */
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-8 h-8 rounded-full bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:bg-light-bg/80 dark:hover:bg-dark-bg/80 transition-colors duration-200"
      aria-label="Toggle light/dark theme"
    >
      {theme === 'dark' ? (
        <Sun size={16} className="text-light-textMain dark:text-dark-textMain" />
      ) : (
        <Moon size={16} className="text-light-textMain dark:text-dark-textMain" />
      )}
    </button>
  );
};

export default ThemeToggle;
