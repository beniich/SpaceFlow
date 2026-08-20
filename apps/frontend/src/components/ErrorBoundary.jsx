import React from 'react';
import * as Sentry from '@sentry/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    if (import.meta.env.VITE_SENTRY_DSN) {
      Sentry.captureException(error, { extra: errorInfo });
    }
  }

  handleReset = () => {
    // Clear caches and reload
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
          registration.unregister();
        }
      });
    }
    window.location.reload(true);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-zinc-50 font-sans p-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 max-w-lg w-full text-center shadow-xl">
            <h1 className="text-xl font-bold text-red-500 font-mono mb-4 uppercase tracking-widest">System Error</h1>
            <p className="text-zinc-400 text-sm mb-6">
              A fatal error occurred in the application rendering tree. This is usually due to stale cache.
            </p>
            <div className="bg-black/50 p-4 rounded text-left overflow-auto mb-6 text-xs text-red-400 border border-red-500/20 font-mono">
              {this.state.error?.toString()}
            </div>
            <button
              onClick={this.handleReset}
              className="px-6 py-2 bg-brand-cyan text-black font-bold font-mono uppercase tracking-widest rounded hover:shadow-[0_0_15px_rgba(0,219,231,0.4)] transition-all"
            >
              Clear Cache & Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
