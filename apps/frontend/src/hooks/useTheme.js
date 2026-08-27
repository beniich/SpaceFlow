import { useContext } from 'react';
import { ThemeContext, THEMES } from '../context/ThemeContext';

export { THEMES };

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
