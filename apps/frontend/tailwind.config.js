export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      spacing: {
        'sidebar-width': '260px',
        'header-height': '64px',
        'container-padding': '24px',
        'margin-page': '24px',
        'widget-gap': '16px',
        'gutter': '16px',
        'unit': '4px',
      },
      colors: {
        background: '#09090b', // zinc-950
        surface: '#18181b', // zinc-900
        brand: {
          orange: 'var(--brand-orange, #f38020)',
          cyan: 'var(--brand-cyan, #00dbe7)',
        },
        primary: {
          50: '#f4f4f5', 100: '#e4e4e7', 200: '#d4d4d8', 300: '#a1a1aa',
          400: '#71717a', 500: '#52525b', 600: '#3f3f46', 700: '#27272a',
          800: '#18181b', 900: '#09090b'
        }
      }
    }
  },
  plugins: []
};
