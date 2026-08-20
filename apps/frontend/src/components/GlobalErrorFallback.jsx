import React from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

export function GlobalErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 text-zinc-100 font-sans">
      <div className="max-w-md w-full bg-zinc-900 border border-red-500/30 p-8 rounded shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
        
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-red-500/10 rounded-full">
            <AlertOctagon className="w-12 h-12 text-red-400" />
          </div>
          
          <h1 className="text-xl font-bold uppercase tracking-wider text-red-50">Erreur Inattendue</h1>
          <p className="text-sm text-zinc-400">
            Une erreur critique s'est produite. L'équipe technique a été notifiée.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="w-full mt-4 bg-zinc-950 p-3 rounded text-left border border-zinc-800">
              <p className="text-xs font-mono text-red-400 break-all">{error.message}</p>
            </div>
          )}
          
          <button
            onClick={resetErrorBoundary}
            className="mt-6 flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold uppercase text-xs tracking-wider transition rounded"
          >
            <RotateCcw className="w-4 h-4" />
            Recharger l'application
          </button>
        </div>
      </div>
    </div>
  );
}
