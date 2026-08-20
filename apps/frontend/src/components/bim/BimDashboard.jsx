import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Database, Link, CheckSquare, Layers } from 'lucide-react';

export default function BimDashboard({ elements = [] }) {
  const total = elements.length;
  const linked = elements.filter(e => e.assetId || e.asset).length;
  const linkedPercent = total > 0 ? Math.round((linked / total) * 100) : 0;

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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-300 font-mono">
        <p className="text-[10px] text-slate-500 uppercase">Éléments dans le modèle</p>
        <p className="text-2xl font-bold text-white mt-1 flex items-center gap-1.5">
          <Layers className="w-5 h-5 text-indigo-400" /> {total}
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-300 font-mono">
        <p className="text-[10px] text-slate-500 uppercase">Éléments associés au BEECARBONAT</p>
        <p className="text-2xl font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
          <Link className="w-5 h-5" /> {linked} ({linkedPercent}%)
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-300 font-mono col-span-2 flex items-center justify-between">
        <div className="flex-1 h-20">
          <p className="text-[10px] text-slate-500 uppercase mb-2">Distribution des Types IFC</p>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 8 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
              <Bar dataKey="count" fill="#6366f1" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
