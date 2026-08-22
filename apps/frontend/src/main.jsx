import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initSentry } from './sentry.js'
import { LanguageProvider } from './context/LanguageContext';
import { SiteConfigProvider } from './context/SiteConfigContext';

initSentry();

// Initialize custom theme accent color from localStorage
const savedAccent = localStorage.getItem('beecarbonat_accent_color') || '#f38020';
document.documentElement.style.setProperty('--brand-orange', savedAccent);

import ErrorBoundary from './components/ErrorBoundary';
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Une nouvelle version est disponible. Recharger ?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('App is ready to work offline');
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <SiteConfigProvider>
          <App />
        </SiteConfigProvider>
      </LanguageProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
