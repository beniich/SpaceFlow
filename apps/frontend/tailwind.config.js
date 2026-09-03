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
        background: '#000000',
        surface: '#0a0a0a',
        'surface-container': '#111111',
        'surface-container-high': '#161616',
        'surface-container-highest': '#222222',
        'on-surface': '#ededed',
        'on-surface-variant': '#a1a1a1',
        primary: '#ededed',
        'primary-container': '#ffffff',
        'on-primary-container': '#000000',
        'secondary-fixed-dim': '#888888',
        'secondary-fixed': '#ededed',
        'secondary-container': '#222222',
        'outline-variant': '#333333',
        error: '#ededed',
        'error-container': '#222222',
        tertiary: '#707070',
        brand: {
          orange: '#ededed',
          cyan: '#ffffff',
        },
      }
    }
  },
  plugins: []
};
