import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initSentry } from './sentry.js'

initSentry();

// Initialize custom theme accent color from localStorage
const savedAccent = localStorage.getItem('beecarbonat_accent_color') || '#f38020';
document.documentElement.style.setProperty('--brand-orange', savedAccent);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
