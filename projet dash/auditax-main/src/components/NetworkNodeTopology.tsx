import React from 'react';
import { motion } from 'motion/react';
import {
  Globe, 
  AlertCircle as ErrorIcon, 
  Cpu, 
  RefreshCw, 
  Plus, 
  Minus, 
  Locate, 
  AlertTriangle, 
  ListFilter, 
  Info 
} from 'lucide-react';
import { InfrastructureService, NetworkNode, NodeStats } from '../services/InfrastructureService';

import { useQuery } from '@tanstack/react-query';
import { useLiveUpdates } from '../hooks/useLiveUpdates';

const NetworkNodeTopology: React.FC = () => {
  useLiveUpdates(); // Enable real-time bridge
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null);

  const { data: nodes = [], isLoading: loadingNodes } = useQuery({
    queryKey: ['nodes'],
    queryFn: () => InfrastructureService.getNodes(),
  });

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => InfrastructureService.getStats(),
  });

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];
  const loading = loadingNodes || loadingStats;

  if (loading) return <div className="p-10 text-slate-500 font-bold animate-pulse">LOADING TOPOLOGY...</div>;

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-10 font-sans cursor-default">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Global Stats Ribbon */}
        <div className="grid grid-cols-4 gap-6">
           <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">TOTAL ACTIVE NODES</div>
              <div className="flex items-baseline gap-2">
                 <span className="text-3xl font-black text-slate-900 tracking-tighter">{stats?.total.toString().padStart(2, '0') || '00'}</span>
                 <span className="text-emerald-700 font-mono text-[10px] bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded font-bold">Online</span>
              </div>
           </div>
           
           <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">HEALTHY</div>
              <div className="flex items-baseline gap-2">
                 <span className="text-3xl font-black text-emerald-600 tracking-tighter">{stats?.healthy.toString().padStart(2, '0') || '00'}</span>
                 <span className="text-emerald-700 font-mono text-[10px] bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded font-bold">Stable</span>
              </div>
           </div>

           <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">DEGRADED</div>
              <div className="flex items-baseline gap-2">
                 <span className="text-3xl font-black text-amber-600 tracking-tighter">{stats?.degraded.toString().padStart(2, '0') || '00'}</span>
                 <span className="text-amber-700 font-mono text-[10px] bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded font-bold">Warning</span>
              </div>
           </div>

           <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">DOWN / OFFLINE</div>
              <div className="flex items-baseline gap-2">
                 <span className="text-3xl font-black text-red-600 tracking-tighter">{stats?.down.toString().padStart(2, '0') || '00'}</span>
                 <span className="text-red-700 font-mono text-[10px] bg-red-50 border border-red-100 px-1.5 py-0.5 rounded font-bold">Critical</span>
              </div>
           </div>
        </div>


        {/* Topology Visualization Map */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col h-[700px] relative shadow-sm">
           <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Synchronized</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Degraded</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Primary Hub</span>
                 </div>
              </div>
              <div className="flex bg-slate-200 p-1 rounded-lg">
                 <button className="px-5 py-1.5 bg-white shadow-sm rounded text-[10px] font-bold uppercase tracking-widest">GRAPH</button>
                 <button className="px-5 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">GEOGRAPHIC</button>
              </div>
           </div>
           
           <div className="flex-1 relative overflow-hidden bg-[#f8fafc] border-[2px] border-transparent" style={{ backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
              
              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                 <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="4" />
                 <line x1="80%" y1="20%" x2="50%" y2="50%" stroke="#2563eb" strokeWidth="1.5" />
                 <line x1="75%" y1="70%" x2="50%" y2="50%" stroke="#dc2626" strokeWidth="2" />
                 <line x1="30%" y1="80%" x2="50%" y2="50%" stroke="#2563eb" strokeWidth="1.5" />
                 <line x1="20%" y1="30%" x2="30%" y2="80%" stroke="#94a3b8" strokeWidth="1" />
                 <line x1="80%" y1="20%" x2="75%" y2="70%" stroke="#94a3b8" strokeWidth="1" />
              </svg>

              {/* Dynamic Nodes Mapping */}
              {nodes.map((node, idx) => {
                // Simplified positioning logic for demo purposes
                const positions = [
                  { left: '50%', top: '50%' }, // Center for Hub
                  { left: '75%', top: '70%' },
                  { left: '20%', top: '30%' },
                  { left: '80%', top: '20%' },
                  { left: '30%', top: '80%' },
                ];
                const pos = positions[idx % positions.length];

                return (
                  <div 
                    key={node.id} 
                    className="absolute group cursor-pointer z-10 transition-all duration-500"
                    style={{ left: pos.left, top: pos.top, transform: 'translate(-50%, -50%)' }}
                    onClick={() => setSelectedNodeId(node.id)}
                  >

                    <div className={`rounded-full border-4 flex items-center justify-center bg-white shadow-lg relative z-10 transition-transform group-hover:scale-110 ${
                      node.status === 'HEALTHY' ? 'border-emerald-500' : 
                      node.status === 'DEGRADED' ? 'border-amber-500 animate-pulse' : 
                      'border-red-600 animate-bounce'
                    } ${node.type === 'API_GATEWAY' ? 'w-24 h-24' : 'w-16 h-16'}`}>
                      {node.type === 'API_GATEWAY' ? <Globe size={36} className="text-blue-600" /> : <Cpu size={24} className="text-slate-500" />}
                    </div>
                    <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
                      <div className="font-mono text-[10px] font-bold text-slate-900 border border-slate-200 bg-white px-2 py-0.5 rounded shadow-sm mb-1">{node.name}</div>
                      <div className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                        node.status === 'HEALTHY' ? 'text-emerald-700 bg-emerald-50' : 
                        node.status === 'DEGRADED' ? 'text-amber-700 bg-amber-50' : 
                        'text-white bg-red-600'
                      }`}>
                        {node.status}
                      </div>
                    </div>
                  </div>
                );
              })}


              {/* Controls */}
              <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-30">
                 <button className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm hover:bg-slate-50 hover:text-blue-600 transition-colors">
                    <Plus size={20} />
                 </button>
                 <button className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm hover:bg-slate-50 hover:text-blue-600 transition-colors">
                    <Minus size={20} />
                 </button>
                 <button className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm hover:bg-slate-50 hover:text-blue-600 transition-colors mt-4">
                    <Locate size={20} />
                 </button>
              </div>

              {/* Inspector Panel */}
              <div className="absolute top-6 right-6 w-80 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl shadow-xl p-6 z-30">
                 <h3 className="text-lg font-bold text-slate-900 mb-6">Node Inspector</h3>
                 {!selectedNode ? (
                   <div className="text-xs text-slate-400 font-bold uppercase py-10 text-center">Select a node to inspect</div>
                 ) : (
                   <div className="space-y-6">
                     <div className="pb-4 border-b border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">SELECTED NODE</div>
                        <div className="font-mono text-sm font-bold text-slate-900 bg-slate-100 inline-block px-2 py-1 rounded">{selectedNode.name}</div>
                     </div>
                     
                     <div className="space-y-4">
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Region</span>
                           <span className="text-[11px] font-mono font-bold text-slate-600">{selectedNode.region}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</span>
                           <span className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${
                             selectedNode.status === 'HEALTHY' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
                           }`}>{selectedNode.status}</span>
                        </div>
                        <div>
                           <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Last Sync</span>
                              <span className="text-[11px] font-mono font-bold text-slate-700">{selectedNode.lastSync ? new Date(selectedNode.lastSync).toLocaleTimeString() : 'Never'}</span>
                           </div>
                        </div>
                     </div>

                     <div className="pt-2 border-t border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">IP ADDRESS</div>
                        <div className="font-mono text-[10px] text-slate-600">{selectedNode.ipAddress || 'Not Assigned'}</div>
                     </div>

                     <button className="w-full py-3 bg-[#091426] text-white text-[10px] font-bold uppercase tracking-widest rounded-lg mt-4 hover:bg-slate-800 transition-colors shadow-lg">
                        REFRESH NODE
                     </button>
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* Audit Trail & Region Dist */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                 <h3 className="text-xl font-bold text-slate-900 tracking-tight">Network Synchronization Logs</h3>
                 <button className="text-slate-400 hover:text-blue-600 transition-colors"><ListFilter size={20} /></button>
              </div>
              <div className="space-y-1">
                 {/* Log 1 */}
                 <div className="flex items-center gap-4 py-3 hover:bg-slate-50 px-3 rounded transition-colors group">
                    <span className="font-mono text-[10px] font-bold text-slate-400 w-24">14:22:01.002</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
                    <span className="flex-1 font-mono text-[11px] text-slate-700 font-medium">Block parity verified across 39 nodes</span>
                    <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">0.00ms Δ</span>
                 </div>
                 {/* Log 2 */}
                 <div className="flex items-center gap-4 py-3 bg-red-50/50 hover:bg-red-50 px-3 rounded transition-colors group border-l-2 border-red-500">
                    <span className="font-mono text-[10px] font-bold text-slate-400 w-24">14:21:58.452</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-sm" />
                    <span className="flex-1 font-mono text-[11px] text-slate-800 font-bold">Connection timeout: HUB-ALPHA-01 {'->'} NODE-FRA-04</span>
                    <span className="font-mono text-[10px] font-bold text-red-700 bg-red-100 border border-red-200 px-2 py-0.5 rounded">RETRIEVING</span>
                 </div>
                 {/* Log 3 */}
                 <div className="flex items-center gap-4 py-3 hover:bg-slate-50 px-3 rounded transition-colors group">
                    <span className="font-mono text-[10px] font-bold text-slate-400 w-24">14:21:44.209</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm" />
                    <span className="flex-1 font-mono text-[11px] text-slate-700 font-medium">New forensic node joined: NODE-TKY-09 (Tokyo Region)</span>
                    <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">AUTHED</span>
                 </div>
                 {/* Log 4 */}
                 <div className="flex items-center gap-4 py-3 hover:bg-slate-50 px-3 rounded transition-colors group">
                    <span className="font-mono text-[10px] font-bold text-slate-400 w-24">14:21:30.881</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
                    <span className="flex-1 font-mono text-[11px] text-slate-700 font-medium">Cryptographic audit complete for epoch #4882</span>
                    <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">SUCCESS</span>
                 </div>
              </div>
           </div>

           <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col justify-between">
              <div>
                 <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-8">Regional Distribution</h3>
                 <div className="space-y-8">
                    <div className="space-y-2">
                       <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-600">
                          <span>North America (AWS-US-EAST)</span>
                          <span className="font-mono text-slate-900">18 Nodes</span>
                       </div>
                       <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full w-[45%]" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-600">
                          <span>Europe (Azure-EU-CENTRAL)</span>
                          <span className="font-mono text-slate-900">12 Nodes</span>
                       </div>
                       <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full w-[30%]" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-600">
                          <span>Asia Pacific (GCP-ASIA-SE)</span>
                          <span className="font-mono text-slate-900">12 Nodes</span>
                       </div>
                       <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full w-[25%]" />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-lg shadow-sm">
                 <div className="flex items-center gap-2 text-slate-900 mb-3">
                    <Info size={16} className="text-blue-600" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Topology Recommendation</span>
                 </div>
                 <p className="text-[11px] font-mono text-slate-600 leading-relaxed font-medium">
                    High latency detected in the Frankfurt cluster. Recommend spinning up 2 additional observer nodes in FRA-2 zone to balance verification load.
                 </p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default NetworkNodeTopology;
