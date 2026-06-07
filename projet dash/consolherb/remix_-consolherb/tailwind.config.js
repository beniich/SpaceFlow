// tailwind.config.js
module.exports = {
  darkMode: 'class', // enables .dark class on <html> or <body>
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Accent (Terracotta)
        accent: {
          DEFAULT: '#c25a3d',
          light: '#e2725b',
          dark: '#a14a32',
        },
        // Light mode palette
        light: {
          bg: '#fdfbf9',          // crème très doux
          surface: '#ffffff',     // cartes & menus
          border: '#e5e7eb',      // bordures subtiles
          textMain: '#1e293b',    // texte principal (Slate 800)
          textMuted: '#64748b',   // texte secondaire (Slate 500)
        },
        // Dark mode palette
        dark: {
          bg: '#0f172a',          // bleu nuit profond
          surface: '#1e293b',     // cartes & menus
          border: 'rgba(255,255,255,0.1)',
          textMain: '#f1f5f9',    // texte principal
          textMuted: '#94a3b8',   // texte secondaire
        },
      },
    },
  },
  plugins: [],
};
