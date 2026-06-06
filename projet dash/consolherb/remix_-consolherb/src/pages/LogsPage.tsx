import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function LogsPage() {
  const { logs, clearLogs, addLog, nodes } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter(log => 
    log.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
    log.level.toLowerCase().includes(searchQuery.toLowerCase()) || 
    log.timestamp.includes(searchQuery)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="bg-dark-bg border border-[#334155] rounded-[4px] p-6 shadow-md">
        
        {/* Search Bar filter */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
              RÉGISTRE CENTRALISÉ DES ÉVÉNEMENTS & INCIDENTS
            </h2>
            <p className="text-xs text-[#c5c6cd] mt-0.5">
              Journal de conformité inaltérable retraçant toutes les actions materielles.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#c5c6cd]">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              className="w-full bg-[#07111c] border border-[#334155] focus:border-[#38BDF8] text-xs py-2 pl-9 pr-4 rounded-sm outline-none text-white font-mono placeholder:text-gray-500"
              placeholder="Filtrer les journaux (ex: ddos, warn, success)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Audit Timeline */}
        <div className="space-y-3 font-mono text-xs max-h-96 overflow-y-auto pr-2">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-10 text-gray-400 italic">
              Aucun message d'audit ne correspond à la requête "{searchQuery}".
            </div>
          ) : (
            filteredLogs.map((log) => {
              let levelColor = 'bg-slate-800 text-slate-300 border-slate-700';
              if (log.level === 'success') levelColor = 'bg-emerald-950 text-emerald-300 border-emerald-500/30';
              if (log.level === 'warn') levelColor = 'bg-sky-950 text-sky-300 border-sky-500/30';
              if (log.level === 'error') levelColor = 'bg-red-950 text-red-300 border-red-500/40 animate-pulse';

              return (
                <div key={log.id} className="p-3 bg-[#0a192f] border border-slate-800 rounded flex justify-between items-center gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-gray-500 shrink-0 select-none">[{log.timestamp}]</span>
                    <span className={`text-[10px] px-1.5 py-0.5 border rounded uppercase ${levelColor}`}>
                      {log.level}
                    </span>
                    <span className="text-slate-200">{log.message}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 hidden sm:-block">SECURED_BY_SHA256</span>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-[#334155] flex justify-between items-center text-xs">
          <div className="flex gap-2">
            <button
              onClick={() => clearLogs()}
              className="flex items-center gap-1.5 text-[#ffb3b0] hover:text-white hover:bg-red-950/20 px-3 py-1.5 border border-red-500/20 rounded transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Vider la console</span>
            </button>
            <button
              onClick={() => {
                addLog('info', 'Rejeu des audits de sécurité de conformité...');
                nodes.forEach((n) => addLog('success', `Nœud vérifié : ${n.name} (100% stable)`));
              }}
              className="bg-slate-900 border border-slate-700 hover:border-[#38BDF8] text-slate-300 hover:text-white px-3 py-1.5 rounded transition cursor-pointer"
            >
              Regénérer logs factices
            </button>
          </div>

          <span className="text-slate-400 font-mono text-[10px]">
            Affichage de {filteredLogs.length} / {logs.length} événements
          </span>
        </div>
      </div>
    </motion.div>
  );
}
