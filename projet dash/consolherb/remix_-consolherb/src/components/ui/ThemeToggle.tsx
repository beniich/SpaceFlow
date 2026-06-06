import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

/**
 * Animated sun/moon toggle for dark/light mode.
 * Drop this anywhere in the Navbar or header.
 */
export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? 'Passer au mode clair' : 'Passer au mode sombre'}
      className="relative w-9 h-9 rounded-xl flex items-center justify-center
                 bg-white/10 hover:bg-white/20 border border-white/10
                 transition-colors duration-200 overflow-hidden cursor-pointer"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0,   opacity: 1, scale: 1   }}
            exit={{    rotate:  90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="absolute"
          >
            <Moon className="w-4 h-4 text-blue-300" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90,  opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0,   opacity: 1, scale: 1   }}
            exit={{    rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="absolute"
          >
            <Sun className="w-4 h-4 text-amber-400" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
