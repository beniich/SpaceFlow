import React from 'react';
import { X, AlertTriangle, CheckCircle2, ChevronRight, RefreshCw, Layers } from 'lucide-react';
import clsx from 'clsx';

/**
 * Reusable 'Conflict Resolution' modal component that displays side-by-side comparisons
 * of offline local changes vs incoming server updates, enabling users to choose how
 * to resolve conflicts during synchronization.
 *
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Callback to close the modal
 * @param {Array} conflicts - List of conflict items
 * @param {function} onResolve - Callback when a conflict is resolved: (id, choice: 'local'|'server')
 * @param {function} onKeepAll - Callback to resolve all conflicts globally: (choice: 'local'|'server')
 * @param {function} onApply - Callback to apply all resolved choices
 * @param {boolean} isSyncing - Loading state for applying updates
 */
export default function ConflictResolutionModal({
  isOpen,
  onClose,
  conflicts = [],
  onResolve,
  onKeepAll,
  onApply,
  isSyncing = false
}) {
  // Prevent background scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const totalConflicts = conflicts.length;
  const resolvedCount = conflicts.filter(c => c.resolved).length;
  const allResolved = resolvedCount === totalConflicts;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto">
      <div 
        id="conflict-resolution-dialog"
        className="bg-zinc-950 border border-zinc-800 w-full max-w-5xl rounded-lg shadow-[0_0_60px_rgba(243,128,32,0.15)] flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-900 bg-zinc-900/40 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-md shrink-0">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-sans uppercase tracking-wider text-zinc-50 flex items-center gap-2">
                <span>Conflict Resolution Hub</span>
                <span className="text-xs font-mono font-normal bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700">
                  Offline Sync
                </span>
              </h2>
              <p className="text-zinc-400 text-xs mt-1 max-w-2xl font-sans">
                Contradictory updates were made offline on the field while other edits were recorded on the server. 
                Choose which version to preserve for each resource.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 rounded-lg transition-colors"
            aria-label="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global actions banner */}
        {totalConflicts > 1 && (
          <div className="px-6 py-4 bg-zinc-900/60 border-b border-zinc-900/80 flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-xs">
            <div className="flex items-center gap-2 text-zinc-400">
              <Layers className="w-4 h-4 text-brand-orange" />
              <span>Bulk Action Override :</span>
            </div>
            <div className="flex gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onKeepAll('local')}
                className="flex-1 sm:flex-none px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded font-bold uppercase transition"
              >
                Keep All Field (Local)
              </button>
              <button
                type="button"
                onClick={() => onKeepAll('server')}
                className="flex-1 sm:flex-none px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-brand-cyan border border-brand-cyan/20 rounded font-bold uppercase transition"
              >
                Keep All Server (Incoming)
              </button>
            </div>
          </div>
        )}

        {/* Body (Scrollable conflicts view) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-zinc-950/20">
          {conflicts.map((conflict, idx) => {
            // Dynamically compare field differences to highlight discrepancies
            const localObj = conflict.local || {};
            const serverObj = conflict.server || {};
            
            // Collect all unique fields between local and server, excluding metadata helpers
            const keysToDiff = Array.from(new Set([
              ...Object.keys(localObj),
              ...Object.keys(serverObj)
            ])).filter(k => !['updatedAt', 'modifiedBy', 'id', 'reference'].includes(k));

            return (
              <div 
                key={conflict.id} 
                className={clsx(
                  "border rounded-lg overflow-hidden transition-all duration-300",
                  conflict.resolved 
                    ? "border-zinc-800 bg-zinc-900/10" 
                    : "border-brand-orange/30 bg-zinc-900/30 shadow-[0_4px_12px_rgba(243,128,32,0.03)]"
                )}
              >
                {/* Conflict Card Header */}
                <div className="bg-zinc-900/80 px-4 py-3 border-b border-zinc-900/90 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-2.5 font-mono text-xs">
                    <span className="bg-brand-orange/15 text-brand-orange px-2 py-0.5 rounded border border-brand-orange/20 font-bold uppercase">
                      {conflict.type || 'Fiche'}
                    </span>
                    <span className="text-zinc-200 font-bold tracking-tight">{conflict.reference}</span>
                    <span className="text-zinc-600">—</span>
                    <span className="text-zinc-300 font-sans font-semibold">{conflict.title}</span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-2">
                    <span>Index: {idx + 1}/{totalConflicts}</span>
                    <span className="bg-zinc-800 px-1.5 py-0.5 rounded">ID: {conflict.id}</span>
                  </div>
                </div>

                {/* Side-by-side comparison boxes */}
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800">
                  
                  {/* LOCAL CARD option */}
                  <div 
                    onClick={() => onResolve(conflict.id, 'local')}
                    className={clsx(
                      "p-5 space-y-4 cursor-pointer transition relative group",
                      conflict.resolved === 'local' 
                        ? "bg-emerald-500/[0.03] border-2 border-emerald-500/40 m-[-2px] z-10" 
                        : "bg-transparent hover:bg-zinc-900/40"
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                          Local Draft (Field)
                        </span>
                        {conflict.resolved === 'local' && (
                          <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                            ✓ Selectionné
                          </span>
                        )}
                      </div>
                      <div className={clsx(
                        "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                        conflict.resolved === 'local' 
                          ? "border-emerald-400 bg-emerald-500 text-black" 
                          : "border-zinc-700 group-hover:border-zinc-500"
                      )}>
                        {conflict.resolved === 'local' && (
                          <div className="w-2.5 h-2.5 bg-black rounded-full" />
                        )}
                      </div>
                    </div>

                    {/* Diff content fields */}
                    <div className="space-y-3 font-mono text-xs">
                      {keysToDiff.map(key => {
                        const localVal = localObj[key];
                        const serverVal = serverObj[key];
                        const isDifferent = String(localVal).trim() !== String(serverVal).trim();

                        return (
                          <div 
                            key={key} 
                            className={clsx(
                              "grid grid-cols-3 gap-2.5 p-2 rounded transition-colors",
                              isDifferent ? "bg-emerald-500/5 border border-emerald-500/10" : "bg-zinc-900/10"
                            )}
                          >
                            <span className="text-zinc-500 capitalize">{key} :</span>
                            <span className={clsx("col-span-2 text-zinc-200 font-sans", isDifferent && "text-emerald-300 font-semibold")}>
                              {String(localVal)}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer tag info */}
                    <div className="border-t border-zinc-900 pt-3 text-[10px] font-mono text-zinc-500 flex justify-between">
                      <span>By: {localObj.modifiedBy || 'Field Tech'}</span>
                      <span>{localObj.updatedAt || 'Offline'}</span>
                    </div>
                  </div>

                  {/* SERVER CARD option */}
                  <div 
                    onClick={() => onResolve(conflict.id, 'server')}
                    className={clsx(
                      "p-5 space-y-4 cursor-pointer transition relative group",
                      conflict.resolved === 'server' 
                        ? "bg-cyan-500/[0.03] border-2 border-cyan-500/40 m-[-2px] z-10" 
                        : "bg-transparent hover:bg-zinc-900/40"
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/10 text-brand-cyan border border-cyan-500/20 px-2 py-0.5 rounded">
                          Incoming (Server)
                        </span>
                        {conflict.resolved === 'server' && (
                          <span className="text-[10px] text-brand-cyan font-mono font-semibold">
                            ✓ Selectionné
                          </span>
                        )}
                      </div>
                      <div className={clsx(
                        "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                        conflict.resolved === 'server' 
                          ? "border-brand-cyan bg-brand-cyan text-black" 
                          : "border-zinc-700 group-hover:border-zinc-500"
                      )}>
                        {conflict.resolved === 'server' && (
                          <div className="w-2.5 h-2.5 bg-black rounded-full" />
                        )}
                      </div>
                    </div>

                    {/* Diff content fields */}
                    <div className="space-y-3 font-mono text-xs">
                      {keysToDiff.map(key => {
                        const localVal = localObj[key];
                        const serverVal = serverObj[key];
                        const isDifferent = String(localVal).trim() !== String(serverVal).trim();

                        return (
                          <div 
                            key={key} 
                            className={clsx(
                              "grid grid-cols-3 gap-2.5 p-2 rounded transition-colors",
                              isDifferent ? "bg-cyan-500/5 border border-cyan-500/10" : "bg-zinc-900/10"
                            )}
                          >
                            <span className="text-zinc-500 capitalize">{key} :</span>
                            <span className={clsx("col-span-2 text-zinc-200 font-sans", isDifferent && "text-brand-cyan font-semibold")}>
                              {String(serverVal)}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer tag info */}
                    <div className="border-t border-zinc-900 pt-3 text-[10px] font-mono text-zinc-500 flex justify-between">
                      <span>By: {serverObj.modifiedBy || 'Control Room'}</span>
                      <span>{serverObj.updatedAt || 'Server Live'}</span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Action Footer */}
        <div className="p-6 border-t border-zinc-900 bg-zinc-900/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className={clsx(
              "px-2 py-0.5 rounded font-bold border",
              allResolved 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                : "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse"
            )}>
              {resolvedCount} / {totalConflicts} Resolved
            </span>
            <span className="text-zinc-500">
              {allResolved ? "All conflicts solved." : "Please decide on a version for each resource above."}
            </span>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isSyncing}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 font-mono text-xs uppercase tracking-widest rounded transition"
            >
              Postpone
            </button>
            <button
              type="button"
              onClick={onApply}
              disabled={isSyncing || !allResolved}
              className={clsx(
                "flex-1 sm:flex-none px-6 py-2.5 font-mono text-xs uppercase tracking-widest font-bold rounded transition flex items-center justify-center gap-2",
                allResolved && !isSyncing
                  ? "bg-brand-orange text-black hover:bg-[#e27010] shadow-[0_0_15px_rgba(243,128,32,0.25)]"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed"
              )}
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Syncing...</span>
                </>
              ) : (
                <span>Apply Resolution</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
