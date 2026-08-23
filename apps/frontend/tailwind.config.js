export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['Inter', 'Outfit', 'sans-serif'],
        'body-md': ['Inter', 'sans-serif'],
        'headline-lg': ['Inter', 'sans-serif'],
        'label-sm': ['"JetBrains Mono"', 'monospace'],
        'display-lg': ['Inter', 'sans-serif'],
        'title-md': ['Inter', 'sans-serif'],
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
        background: '#131313',
        surface: '#131313',
        'surface-container': '#20201f',
        'surface-container-high': '#2a2a2a',
        'surface-container-highest': '#353535',
        'on-surface': '#e5e2e1',
        'on-surface-variant': '#ddc1b1',
        primary: '#ffb787',
        'primary-container': '#f38020',
        'on-primary-container': '#592900',
        'secondary-fixed-dim': '#00dbe7',
        'secondary-fixed': '#74f5ff',
        'secondary-container': '#00f1fe',
        'outline-variant': '#564336',
        error: '#ffb4ab',
        'error-container': '#93000a',
        tertiary: '#c5c6cb',
        brand: {
          orange: 'var(--brand-orange, #f38020)',
          cyan: 'var(--brand-cyan, #00dbe7)',
        },
      }
    }
  },
  plugins: []
};
