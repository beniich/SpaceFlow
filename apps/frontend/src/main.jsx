import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initSentry } from './sentry.js'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { SiteConfigProvider } from './context/SiteConfigContext.jsx'

initSentry();

// Initialize custom theme accent color from localStorage
const savedAccent = localStorage.getItem('beecarbonat_accent_color') || '#f38020';
document.documentElement.style.setProperty('--brand-orange', savedAccent);

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

