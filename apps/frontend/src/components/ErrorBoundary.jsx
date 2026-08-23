import React from 'react';
import * as Sentry from '@sentry/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
    try {
      if (Sentry?.captureException) {
        Sentry.captureException(error, { extra: errorInfo });
      }
    } catch {
      // ignore sentry reporting failure
    }
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleReset = () => {
    // Clear caches and reload
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for (let registration of registrations) {
          registration.unregister();
        }
      });
    }
    try {
      localStorage.removeItem('beecarbonat-auth');
      sessionStorage.clear();
    } catch {
      // ignore storage error
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-zinc-100 font-sans p-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-xl w-full text-center shadow-2xl space-y-5">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <div>
              <h1 className="text-lg font-bold text-zinc-100 font-display uppercase tracking-wider">
                Incident d'affichage intercepté
              </h1>
              <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
                Une anomalie inattendue a été capturée par le garde-fou applicatif. Les données de session sont protégées.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-zinc-950 p-4 rounded-xl text-left overflow-auto max-h-40 text-xs text-red-400 border border-red-950/60 font-mono leading-relaxed">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold font-mono text-xs uppercase tracking-wider rounded-lg transition-all shadow-md"
              >
                Recharger la page
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold font-mono text-xs rounded-lg transition-all border border-zinc-700"
              >
                Vider le cache & Accueil
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
