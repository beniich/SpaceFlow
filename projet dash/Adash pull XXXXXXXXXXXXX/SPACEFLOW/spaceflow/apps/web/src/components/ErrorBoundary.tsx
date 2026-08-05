import { Component, ReactNode } from 'react';

interface Props { children: ReactNode; }

interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
          <div className="max-w-md text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Une erreur est survenue</h1>
            <p className="text-slate-600 mb-4">
              L'application a rencontré un problème. Nos équipes ont été notifiées.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
