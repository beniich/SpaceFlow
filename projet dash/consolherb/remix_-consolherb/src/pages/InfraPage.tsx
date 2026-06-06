import { motion } from 'motion/react';
import { Cpu, HardDrive, Globe } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function InfraPage() {
  const { nodes, updateNode } = useStore();

  const handleNodeAction = (nodeId: string) => {
    // Placeholder action for testing
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
       updateNode(nodeId, { status: node.status === 'locked' ? 'critical' : 'locked' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Topological Table */}
      <div className="bg-dark-bg border border-[#334155] rounded-[4px] p-6 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
              RÉSEAU TOPOLOGIQUE DES MONITEURS CC_ARCH
            </h2>
            <p className="text-xs text-[#c5c6cd] mt-0.5">
              Vue microscopique des hôtes et performances de serveurs locaux à double sens.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-1 bg-[#0a192f] border border-slate-700 text-teal-400">
            AES-256-GCM SÉCURISÉ
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#334155] text-slate-400 font-mono text-[10px] uppercase">
                <th className="pb-3 pr-2">Nœud d'infrastructure</th>
                <th className="pb-3 px-2">Espace IP</th>
                <th className="pb-3 px-2">Ports Autorisés</th>
                <th className="pb-3 px-2">Système d'exploitation</th>
                <th className="pb-3 px-2">Charge CPU</th>
                <th className="pb-3 px-2">Uptime Actuel</th>
                <th className="pb-3 px-2 text-right">Contrôle Réseau</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]/60">
              {nodes.map((node, index) => {
                const randomCpuLoad = node.status === 'optimal' 
                  ? 12 + index * 4 
                  : node.status === 'critical' 
                    ? 88 
                    : node.status === 'locked' 
                      ? 1 
                      : 45;

                return (
                  <tr key={node.id} className="hover:bg-slate-800/20">
                    <td className="py-4 pr-2 font-mono font-bold text-white flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${node.status === 'critical' ? 'bg-red-500 animate-ping' : node.status === 'locked' ? 'bg-[#38BDF8]' : 'bg-[#4de082]'}`}></span>
                      <span>{node.id} ({node.name})</span>
                    </td>
                    <td className="py-4 px-2 font-mono text-slate-300">
                      10.0.{index + 1}.{Math.floor(12 + index * 10)}
                    </td>
                    <td className="py-4 px-2 font-mono text-slate-400">
                      {node.icon === 'shield' && '80, 443, 8080'}
                      {node.icon === 'database' && '5432, 5433'}
                      {node.icon === 'alert' && '110, 995, 3000'}
                      {node.icon === 'key' && '22, 1022, 4443'}
                    </td>
                    <td className="py-4 px-2 text-[#c5c6cd] font-mono">
                      {node.id === 'Node-A1' ? 'Alpine OS 3.19' : 'RedHat Linux 9.4'}
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2 w-28">
                        <div className="flex-1 bg-[#0d1c2d] h-2 rounded-xs overflow-hidden border border-slate-800">
                          <div 
                            className={`h-full ${randomCpuLoad > 80 ? 'bg-red-500' : 'bg-[#4de082]'}`}
                            style={{ width: `${randomCpuLoad}%` }}
                          />
                        </div>
                        <span className="font-mono text-[10px] text-slate-300 w-8 text-right">{randomCpuLoad}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 font-mono text-[#4de082]">{node.status === 'critical' ? '2.4 Hrs' : '294 Days'}</td>
                    <td className="py-4 px-2 text-right">
                      <button 
                        onClick={() => handleNodeAction(node.id)}
                        className={`text-[10px] font-mono font-bold border border-slate-700 hover:border-[#38BDF8] hover:text-white px-2 py-1 rounded-sm uppercase tracking-wide cursor-pointer text-slate-400`}
                      >
                        {node.status === 'locked' ? 'Débloquer' : 'Actionner'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hardware Telemetry Specs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-bg border border-[#334155] p-5 rounded-[4px] flex items-center gap-4">
          <div className="p-3 bg-[#0a192f] border border-slate-700/60 text-[#4de082] rounded-sm">
            <Cpu className="w-6 h-6 animate-pulse-slow" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#8f9097] uppercase">ALLOCATION MICROPROCESSEUR</span>
            <h4 className="text-lg font-mono font-bold text-white mt-1">24 CORES ACTIVE</h4>
            <p className="text-xs text-emerald-400 font-mono mt-0.5">Performance optimalized</p>
          </div>
        </div>

        <div className="bg-dark-bg border border-[#334155] p-5 rounded-[4px] flex items-center gap-4">
          <div className="p-3 bg-[#0a192f] border border-slate-700/60 text-[#38BDF8] rounded-sm">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#8f9097] uppercase">STOCKAGE CLOUD EN RELAIS</span>
            <h4 className="text-lg font-mono font-bold text-white mt-1">1.8 TB / 2.0 TB</h4>
            <p className="text-xs text-sky-400 font-mono mt-0.5">85% compression AES-XTS</p>
          </div>
        </div>

        <div className="bg-dark-bg border border-[#334155] p-5 rounded-[4px] flex items-center gap-4">
          <div className="p-3 bg-[#0a192f] border border-slate-700/60 text-emerald-400 rounded-sm">
            <Globe className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#8f9097] uppercase">RELAIS ZONE DE SÉCURITÉ</span>
            <h4 className="text-lg font-mono font-bold text-white mt-1">EU-WEST (LONDRES)</h4>
            <p className="text-xs text-[#4de082] font-mono mt-0.5">Transit via SSL Proxy (Active)</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
