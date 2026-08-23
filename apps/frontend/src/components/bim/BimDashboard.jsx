import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Database, Link, Layers, MapPin, AlertTriangle } from 'lucide-react';

export default function BimDashboard({ elements = [], annotations = [] }) {
  const total = elements.length;
  const linked = elements.filter(e => e.assetId || e.asset).length;
  const linkedPercent = total > 0 ? Math.round((linked / total) * 100) : 0;

  const totalAnnotations = annotations.length;
  const openIncidents = annotations.filter(a => a.category === 'incident' && a.status !== 'resolved').length;
  const resolvedAnnotations = annotations.filter(a => a.status === 'resolved').length;

  // Répartition par type d'élément IFC
  const typesMap = {};
  elements.forEach(e => {
    const simpleType = e.type.replace('Ifc', '');
    typesMap[simpleType] = (typesMap[simpleType] || 0) + 1;
  });

  const chartData = Object.entries(typesMap).map(([type, count]) => ({
    name: type,
    count
  }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-zinc-300 font-mono">
        <p className="text-[10px] text-zinc-500 uppercase">Éléments dans le modèle</p>
        <p className="text-2xl font-bold text-white mt-1 flex items-center gap-1.5">
          <Layers className="w-5 h-5 text-cyan-400" /> {total}
        </p>
        <p className="text-[10px] text-zinc-500 mt-1">Structure BIM ISO 16739</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-zinc-300 font-mono">
        <p className="text-[10px] text-zinc-500 uppercase">Actifs Liés BEECARBONAT</p>
        <p className="text-2xl font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
          <Link className="w-5 h-5" /> {linked} ({linkedPercent}%)
        </p>
        <p className="text-[10px] text-zinc-500 mt-1">GMAO &amp; Jumeau Numérique</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-zinc-300 font-mono">
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-zinc-500 uppercase">Annotations 3D</p>
          {openIncidents > 0 && (
            <span className="text-[9px] bg-red-950/80 text-red-300 border border-red-800/60 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
              <AlertTriangle className="w-2.5 h-2.5" /> {openIncidents} incident{openIncidents > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <p className="text-2xl font-bold text-cyan-400 mt-1 flex items-center gap-1.5">
          <MapPin className="w-5 h-5" /> {totalAnnotations}
        </p>
        <p className="text-[10px] text-zinc-400 mt-1">
          {resolvedAnnotations}/{totalAnnotations} résolue{resolvedAnnotations > 1 ? 's' : ''}
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-zinc-300 font-mono flex items-center justify-between">
        <div className="w-full h-20">
          <p className="text-[10px] text-zinc-500 uppercase mb-1">Distribution Types IFC</p>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 8 }} />
              <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#27272a', fontSize: '11px' }} />
              <Bar dataKey="count" fill="#06b6d4" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
