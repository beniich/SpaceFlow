import { useState, useEffect } from "react";
import { 
  QrCode, MapPin, Smartphone, TrendingUp,
  Clock, Users, Activity, AlertCircle
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["#06b6d4", "#a855f7", "#f59e0b", "#ef4444", "#10b981"];

export function QRAnalytics({ assetId, period = "30d" }) {
  const [timeframe, setTimeframe] = useState(period);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/qr/asset/${assetId || 'all'}/analytics?period=${timeframe}`)
      .then(r => r.json())
      .then(res => {
        if (active) {
          setData(res.data);
          setError(null);
        }
      })
      .catch(err => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [assetId, timeframe]);

  if (loading) {
    return (
      <div className="bg-[#12141D] border border-slate-800 p-8 rounded-2xl text-center font-mono text-xs text-slate-400 animate-pulse">
        Chargement de l'analytics QR Code...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-[#12141D] border border-slate-800 p-6 rounded-2xl text-center font-mono text-xs text-rose-400 space-y-2">
        <AlertCircle className="mx-auto w-6 h-6 text-rose-400" />
        <p>Impossible de charger les métriques de scan ({error || 'Données non disponibles'}).</p>
      </div>
    );
  }

  const { summary, timeline, countries, devices, heatmapByHour, funnel, recentScans } = data;

  return (
    <div className="space-y-6 text-slate-200">
      {/* Time period selector */}
      <div className="flex items-center justify-between bg-[#12141D] border border-slate-800 p-3 rounded-xl font-mono text-xs">
        <span className="font-bold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" /> Dashboard Analytics QR
        </span>

        <div className="flex items-center gap-1.5 bg-[#090A0F] p-1 rounded-lg border border-slate-800">
          {[
            { key: "7d", label: "7 jours" },
            { key: "30d", label: "30 jours" },
            { key: "90d", label: "90 jours" },
            { key: "1y", label: "1 an" },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTimeframe(t.key)}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                timeframe === t.key 
                  ? "bg-cyan-500 text-slate-950 shadow" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <KPICard 
          icon={<QrCode className="w-5 h-5 text-cyan-400" />} 
          label="Scans Totaux"
          value={summary?.totalScans || 0}
          trend={summary?.scansTrend}
          border="border-cyan-500/40"
        />
        <KPICard 
          icon={<Users className="w-5 h-5 text-purple-400" />} 
          label="Scans Uniques"
          value={summary?.uniqueScans || 0}
          border="border-purple-500/40"
        />
        <KPICard 
          icon={<Activity className="w-5 h-5 text-emerald-400" />} 
          label="Taux Conversion"
          value={`${summary?.conversionRate || 0}%`}
          border="border-emerald-500/40"
        />
        <KPICard 
          icon={<Clock className="w-5 h-5 text-amber-400" />} 
          label="Heure de Pic"
          value={`${summary?.peakHour || 12}h00`}
          border="border-amber-500/40"
        />
      </div>

      {/* Timeline Chart */}
      <div className="bg-[#12141D] border border-slate-800 p-5 rounded-2xl space-y-4 shadow-lg">
        <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
          Évolution des Scans sur la Période
        </h3>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeline || []}>
              <XAxis 
                dataKey="date" 
                tickFormatter={d => d ? d.slice(5) : ''}
                stroke="#64748b"
                fontSize={11}
              />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip 
                contentStyle={{ 
                  background: "#090A0F", 
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#f8fafc",
                  fontSize: "12px",
                  fontFamily: "monospace"
                }}
              />
              <Line 
                type="monotone" 
                dataKey="scans" 
                stroke="#06b6d4" 
                strokeWidth={2}
                dot={{ fill: "#06b6d4", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Geographic and Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Geographic distribution */}
        <div className="bg-[#12141D] border border-slate-800 p-5 rounded-2xl space-y-4 shadow-lg">
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" /> Localisation des Scans
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countries || []}>
                <XAxis dataKey="country" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ 
                    background: "#090A0F", 
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#f8fafc",
                    fontSize: "12px"
                  }}
                />
                <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Devices */}
        <div className="bg-[#12141D] border border-slate-800 p-5 rounded-2xl space-y-4 shadow-lg">
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-purple-400" /> Types d'Appareils
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={devices || []}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {(devices || []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: "#090A0F", 
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#f8fafc"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Hourly Heatmap */}
      <div className="bg-[#12141D] border border-slate-800 p-5 rounded-2xl space-y-3 shadow-lg">
        <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
          Répartition des Scans par Heure de la Journée
        </h3>
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 pt-2">
          {Array.from({ length: 24 }).map((_, hour) => {
            const val = heatmapByHour?.[hour] || 0;
            const maxVal = summary?.peakHourCount || 1;
            const intensity = Math.min(val / maxVal, 1);
            return (
              <div 
                key={hour}
                className="p-2 rounded-lg text-center font-mono border border-slate-800 transition-all hover:scale-105"
                style={{
                  background: `rgba(6, 182, 212, ${0.1 + intensity * 0.8})`,
                  borderColor: intensity > 0.5 ? '#06b6d4' : '#1e293b'
                }}
                title={`${hour}h00: ${val} scan(s)`}
              >
                <span className="block text-[10px] text-slate-400">{hour}h</span>
                <span className="block text-xs font-bold text-white">{val}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Funnel */}
      {funnel && funnel.length > 0 && (
        <div className="bg-[#12141D] border border-slate-800 p-5 rounded-2xl space-y-3 shadow-lg">
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Funnel de Conversion (Scan &rarr; Signalement Ticket)
          </h3>
          <div className="space-y-2 pt-1 font-mono text-xs">
            {funnel.map((step, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-slate-300 text-[11px]">
                  <span>{step.label}</span>
                  <span className="font-bold text-cyan-400">{step.count} ({step.percent}%)</span>
                </div>
                <div className="w-full bg-[#090A0F] h-2 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(step.percent, 3)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Scans */}
      {recentScans && recentScans.length > 0 && (
        <div className="bg-[#12141D] border border-slate-800 p-5 rounded-2xl space-y-3 shadow-lg">
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Derniers Scans Enregistrés
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px]">
                  <th className="py-2 px-3">Date / Heure</th>
                  <th className="py-2 px-3">Localisation</th>
                  <th className="py-2 px-3">Appareil</th>
                  <th className="py-2 px-3">Navigateur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentScans.slice(0, 10).map((scan, i) => (
                  <tr key={i} className="hover:bg-slate-800/40">
                    <td className="py-2 px-3 text-slate-400">
                      {scan.createdAt ? new Date(scan.createdAt).toLocaleString("fr-FR") : "Récemment"}
                    </td>
                    <td className="py-2 px-3">
                      {scan.city ? `${scan.city}, ${scan.country}` : scan.country || "—"}
                    </td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-cyan-300">
                        {scan.deviceType || "Mobile"}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-400">{scan.browser || "Safari"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function KPICard({ icon, label, value, trend, border }) {
  return (
    <div className={`bg-[#12141D] border ${border || 'border-slate-800'} p-4 rounded-2xl flex items-center justify-between gap-3 shadow`}>
      <div className="space-y-1">
        <span className="text-[11px] text-slate-400 uppercase tracking-wider">{label}</span>
        <div className="text-xl font-bold text-white">{value}</div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="p-2.5 rounded-xl bg-[#090A0F] border border-slate-800">{icon}</div>
        {trend !== undefined && (
          <span className={`text-[10px] flex items-center gap-0.5 ${trend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            <TrendingUp className="w-3 h-3" /> {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </div>
  );
}
