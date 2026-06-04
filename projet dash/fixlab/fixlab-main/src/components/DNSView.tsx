import React, { useState, useEffect, useMemo } from "react";
import { 
  Database, ShieldAlert, Globe, Server, Plus, Trash2, 
  ToggleLeft, ToggleRight, Radio, Search, CheckCircle2, 
  ArrowLeftRight, HelpCircle, Activity, Play
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";
import { DNSRecord, DNSQueryLog, Device } from "../types";

interface DNSViewProps {
  devices: Device[];
  dnsRecords: DNSRecord[];
  dnsQueryLogs: DNSQueryLog[];
  onAddRecord: (domain: string, type: DNSRecord["type"], value: string, ttl: number) => Promise<void>;
  onToggleRecord: (recordId: string) => Promise<void>;
  onDeleteRecord: (recordId: string) => Promise<void>;
  onTriggerTestQuery: (domain: string, deviceId: string) => Promise<void>;
}

export const DNSView: React.FC<DNSViewProps> = ({
  devices,
  dnsRecords,
  dnsQueryLogs,
  onAddRecord,
  onToggleRecord,
  onDeleteRecord,
  onTriggerTestQuery,
}) => {
  // Input form state
  const [newDomain, setNewDomain] = useState("");
  const [newType, setNewType] = useState<DNSRecord["type"]>("A");
  const [newValue, setNewValue] = useState("");
  const [newTtl, setNewTtl] = useState(3600);
  const [formError, setFormError] = useState("");

  // Search filter zones
  const [searchQuery, setSearchQuery] = useState("");
  const [logFilter, setLogFilter] = useState<"all" | "resolved" | "blocked" | "forwarded">("all");

  // Interactive diagnostic query form
  const [diagDomain, setDiagDomain] = useState("gateway.sovereign.local");
  const [diagDevice, setDiagDevice] = useState(devices[0]?.id || "");
  const [diagRunning, setDiagRunning] = useState(false);
  const [diagResult, setDiagResult] = useState<{status: string, resolvedValue: string} | null>(null);

  // Form handler
  const handleAddNewRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!newDomain) {
      setFormError("Domain name is strictly required.");
      return;
    }
    if (!newValue) {
      setFormError("Mapping target value is required (IP, target domain, etc.).");
      return;
    }

    try {
      await onAddRecord(newDomain.trim().toLowerCase(), newType, newValue.trim(), newTtl);
      setNewDomain("");
      setNewValue("");
      setNewTtl(3600);
    } catch (err) {
      setFormError("Failed to registers record parameters. Verify network airgap link.");
    }
  };

  // Run test diagnostic lookup
  const handleDiagnosticQuery = async () => {
    if (!diagDomain) return;
    setDiagRunning(true);
    setDiagResult(null);

    try {
      await onTriggerTestQuery(diagDomain, diagDevice);
      // Retrieve the latest logged outcome after tiny latency delay
      setTimeout(() => {
        const matchingLog = dnsQueryLogs[0];
        if (matchingLog) {
          setDiagResult({
            status: matchingLog.status,
            resolvedValue: matchingLog.resolvedValue
          });
        }
        setDiagRunning(false);
      }, 600);
    } catch (err) {
      setDiagRunning(false);
    }
  };

  // Filtered lists
  const filteredRecords = useMemo(() => {
    return dnsRecords.filter(rec => 
      rec.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [dnsRecords, searchQuery]);

  const filteredLogs = useMemo(() => {
    if (logFilter === "all") return dnsQueryLogs;
    return dnsQueryLogs.filter(l => l.status === logFilter);
  }, [dnsQueryLogs, logFilter]);

  // Aggregate stats using useMemo
  const stats = useMemo(() => {
    const total = dnsQueryLogs.length || 1;
    const resolved = dnsQueryLogs.filter(l => l.status === "resolved").length;
    const blocked = dnsQueryLogs.filter(l => l.status === "blocked").length;
    const forwarded = dnsQueryLogs.filter(l => l.status === "forwarded").length;

    return {
      totalLogs: dnsQueryLogs.length,
      resolved,
      blocked,
      forwarded,
      percentBlocked: Math.round((blocked / total) * 100)
    };
  }, [dnsQueryLogs]);

  // Recharts representation structure
  const pieData = [
    { name: "Resolved Locally", value: stats.resolved, color: "#10b981" },
    { name: "Sovereign Blocked", value: stats.blocked, color: "#ef4444" },
    { name: "Proxy Forwarded", value: stats.forwarded, color: "#3b82f6" },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      
      {/* 1. DNS SYSTEM METRIC STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#080c14] border border-zinc-900 rounded p-4 flex items-center justify-between shadow-md">
          <div className="space-y-1 font-mono">
            <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">ZONE ENTRIES</span>
            <div className="text-xl font-extrabold text-zinc-100">{dnsRecords.length} records</div>
            <span className="text-[9px] text-emerald-400 font-semibold block">Authoritative Private Zones</span>
          </div>
          <Database className="w-8 h-8 text-emerald-500/25 shrink-0" />
        </div>

        <div className="bg-[#080c14] border border-zinc-900 rounded p-4 flex items-center justify-between shadow-md">
          <div className="space-y-1 font-mono">
            <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">SINKHOLED OUTCOMES</span>
            <div className="text-xl font-extrabold text-[#ef4444]">{stats.blocked} queries</div>
            <span className="text-[9px] text-[#ef4444]/70 font-semibold block">{stats.percentBlocked}% tracking blocks enforced</span>
          </div>
          <ShieldAlert className="w-8 h-8 text-red-500/20 shrink-0" />
        </div>

        <div className="bg-[#080c14] border border-zinc-900 rounded p-4 flex items-center justify-between shadow-md">
          <div className="space-y-1 font-mono">
            <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">UPSTREAM LINK</span>
            <div className="text-xl font-extrabold text-[#3b82f6]">192.168.1.1</div>
            <span className="text-[9px] text-[#3b82f6]/70 font-semibold block">Encrypted DNS over TLS tunnel</span>
          </div>
          <Globe className="w-8 h-8 text-blue-500/20 shrink-0" />
        </div>

        <div className="bg-[#080c14] border border-zinc-900 rounded p-4 flex items-center justify-between shadow-md">
          <div className="space-y-1 font-mono">
            <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">DNS PROXIES LATENCY</span>
            <div className="text-xl font-extrabold text-zinc-100">14 ms</div>
            <div className="flex items-center gap-1.5 text-[9px] text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>NOMINAL HIGH-RES RESOLVING</span>
            </div>
          </div>
          <Activity className="w-8 h-8 text-zinc-500/15 shrink-0" />
        </div>

      </div>

      {/* 2. MAIN LAYOUT GRID (LEFT: ZONE CONFIG AND TESTING | RIGHT: STATS AND REAL-TIME LUT TELEMETRY) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: 8 COLS */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* A. PRIVATE AUTHORITY DOMAIN REGISTRY */}
          <div className="bg-[#080c14] border border-zinc-900 rounded shadow-md pb-1">
            
            {/* CARD HEADER */}
            <div className="p-4 border-b border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
              <div className="space-y-1">
                <h3 className="text-xs font-black text-zinc-200 tracking-wider uppercase flex items-center gap-2">
                  <Server className="w-3.5 h-3.5 text-emerald-400" />
                  Sovereign DNS Records Registry
                </h3>
                <p className="text-[9px] text-zinc-500 font-bold tracking-tight">
                  Airgap domain lookup tables mapping hostnames to internal private networks
                </p>
              </div>

              {/* SEARCH FIELD */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Filter records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-zinc-950 font-mono text-[10px] border border-zinc-900 text-zinc-200 rounded pl-7 py-1 w-full sm:w-44 outline-none focus:border-emerald-500/40"
                />
              </div>
            </div>

            {/* RECORD TABLE ROW */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[10px]">
                <thead className="bg-[#05070c] text-zinc-500 uppercase tracking-wider font-semibold border-b border-zinc-950">
                  <tr>
                    <th className="p-3">Domain Name / Host Address</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Resolved IP / Value</th>
                    <th className="p-3">TTL</th>
                    <th className="p-3">Enforcement State</th>
                    <th className="p-3 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/50">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-zinc-550 font-semibold italic text-[11px]">
                        No matching sovereign local domain records registered in lookup database.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((rec) => (
                      <tr 
                        key={rec.id} 
                        className={`transition-colors hover:bg-zinc-950/40 ${rec.status === "intercepted" ? "bg-red-950/5 text-red-200/90" : "text-zinc-300"}`}
                      >
                        <td className="p-3 font-bold truncate max-w-[180px]">
                          <span className="text-zinc-150">{rec.domain}</span>
                          {rec.systemManaged && (
                            <span className="ml-1.5 inline-block text-[8px] bg-emerald-950/50 border border-emerald-500/20 text-emerald-400 font-black px-1.5 py-0.5 rounded tracking-widest uppercase">
                              HOST_IP
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-zinc-400">
                          <span className="bg-zinc-900 border border-zinc-800 text-zinc-350 px-1 py-0.5 rounded font-extrabold text-[9px]">
                            {rec.type}
                          </span>
                        </td>
                        <td className="p-3 font-mono truncate max-w-[140px]">
                          {rec.status === "intercepted" ? (
                            <span className="text-red-400 font-black">0.0.0.0 (Sinkhole Redirect)</span>
                          ) : (
                            <span className="text-emerald-400 font-extrabold">{rec.value}</span>
                          )}
                        </td>
                        <td className="p-3 text-zinc-500">{rec.ttl}s</td>
                        <td className="p-3">
                          <button
                            onClick={() => onToggleRecord(rec.id)}
                            className="flex items-center gap-1.5 shrink-0 text-left outline-none cursor-pointer focus:ring-1 focus:ring-emerald-500/30 rounded"
                            title={rec.status === "intercepted" ? "Released Intercept" : "Lock / Direct to Sinkhole"}
                          >
                            {rec.status === "intercepted" ? (
                              <>
                                <ToggleRight className="w-5 h-5 text-red-500 shrink-0" />
                                <span className="text-[9px] text-red-400 uppercase font-black tracking-widest">SINKHOLED</span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span className="text-[9px] text-emerald-400 uppercase font-gold tracking-widest">RESOLVING</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            disabled={rec.systemManaged}
                            onClick={() => onDeleteRecord(rec.id)}
                            className={`p-1 rounded border outline-none transition-all ${rec.systemManaged ? "text-zinc-700 border-zinc-900/40 cursor-not-allowed" : "text-zinc-500 border-zinc-900 hover:text-red-400 hover:bg-red-950/20 hover:border-red-500/20 cursor-pointer"}`}
                            title={rec.systemManaged ? "System records are locked to hosts" : "Purge records mapping"}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>

          {/* B. REGISTER NEW SOVEREIGN RECORD FORM */}
          <div className="bg-[#080c14] border border-zinc-900 rounded p-4 font-mono shadow-md">
            <h4 className="text-xs font-black text-zinc-200 tracking-wider uppercase mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              Enroll Private Domain Mapping Rule
            </h4>
            
            {formError && (
              <div className="mb-3 p-2.5 rounded bg-red-950/40 border border-red-500/20 text-red-400 text-[10px] leading-relaxed">
                🚨 {formError}
              </div>
            )}

            <form onSubmit={handleAddNewRecord} className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-4 space-y-1">
                <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">DOMAIN CODES (e.g. mail.private)</label>
                <input
                  type="text"
                  placeholder="api.sovereign.local"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 text-zinc-100 rounded text-[10px] px-2.5 py-1.5 focus:border-emerald-500/40 outline-none"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">RECORD TYPE</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as DNSRecord["type"])}
                  className="w-full bg-zinc-950 border border-zinc-900 text-zinc-100 rounded text-[10px] px-1.5 py-1.5 focus:border-emerald-500/40 outline-none"
                >
                  <option value="A">A (IPv4)</option>
                  <option value="AAAA">AAAA (IPv6)</option>
                  <option value="CNAME">CNAME (Alias)</option>
                  <option value="TXT">TXT (Text)</option>
                  <option value="MX">MX (Mail)</option>
                </select>
              </div>

              <div className="md:col-span-3 space-y-1">
                <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">TARGET IP / CONTENT</label>
                <input
                  type="text"
                  placeholder="10.240.11.25"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 text-zinc-100 rounded text-[10px] px-2.5 py-1.5 focus:border-emerald-500/40 outline-none"
                />
              </div>

              <div className="md:col-span-1.5 space-y-1">
                <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">TTL (SEC)</label>
                <input
                  type="number"
                  value={newTtl}
                  onChange={(e) => setNewTtl(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-900 text-zinc-100 rounded text-[10px] px-2 py-1.5 focus:border-emerald-500/40 outline-none"
                />
              </div>

              <div className="md:col-span-1.5 flex items-end">
                <button
                  type="submit"
                  className="w-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded py-1.5 font-bold uppercase text-[10px] tracking-wide cursor-pointer hover:bg-emerald-500/20 hover:text-emerald-300 transition-all"
                >
                  Apply
                </button>
              </div>
            </form>
          </div>

          {/* C. MANUAL DNS DIAGNOSIS CHECKER */}
          <div className="bg-[#080c14] border border-zinc-900 rounded p-4 font-mono shadow-md">
            <h4 className="text-xs font-black text-zinc-200 tracking-wider uppercase mb-1.5 flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              Sovereign DNS Lookup Diagnostic Simulator
            </h4>
            <p className="text-[9px] text-zinc-500 font-bold block mb-4 uppercase tracking-tight">
              Test authoritative DNS resolving and intercept state directly from chosen network hosts
            </p>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-4 space-y-1">
                <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">CLIENT SOURCE HOST</label>
                <select
                  value={diagDevice}
                  onChange={(e) => setDiagDevice(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 text-zinc-100 rounded text-[10px] px-2 py-2 outline-none"
                >
                  {devices.filter(d => d.status !== "offline").map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.ip})
                    </option>
                  ))}
                  {devices.length === 0 && <option value="">No Active Nodes</option>}
                </select>
              </div>

              <div className="md:col-span-5 space-y-1">
                <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">LOOKUP DESTINATION ADDRESS</label>
                <select
                  value={diagDomain}
                  onChange={(e) => setDiagDomain(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 text-zinc-100 rounded text-[10px] px-2 py-2 outline-none"
                >
                  <option value="gateway.sovereign.local">gateway.sovereign.local</option>
                  <option value="centrifuge.sovereign.local">centrifuge.sovereign.local</option>
                  <option value="clandestine-tracker.net">clandestine-tracker.net (Blocked Tracker)</option>
                  <option value="reverse-shell.telemetry-node.ru">reverse-shell.telemetry-node.ru (Blocked Malware Domain)</option>
                  <option value="time.cloudflare.com">time.cloudflare.com (External Forwarded Domain)</option>
                </select>
              </div>

              <div className="md:col-span-3 flex items-end">
                <button
                  type="button"
                  disabled={diagRunning}
                  onClick={handleDiagnosticQuery}
                  className="w-full flex items-center justify-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded py-2 font-bold uppercase text-[10px] tracking-widest cursor-pointer hover:bg-emerald-500/20 hover:text-emerald-300 transition-all"
                >
                  <Play className={`w-3 h-3 ${diagRunning ? "animate-spin" : ""}`} />
                  {diagRunning ? "Resolving..." : "FORCE QUERY"}
                </button>
              </div>
            </div>

            {diagResult && (
              <div className="mt-4 p-3 bg-zinc-950 border border-zinc-900 rounded flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest block">DIAGNOSTIC RESOLUTION SUMMARY</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-zinc-200">Result value:</span>
                    <code className="text-[11px] font-black text-emerald-400 bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-500/10 font-mono">
                      {diagResult.resolvedValue}
                    </code>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 font-bold uppercase text-[9px]">
                  {diagResult.status === "resolved" && (
                    <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/20 p-1 px-2 border border-emerald-500/10 rounded tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      SECURE RESOLVED
                    </span>
                  )}
                  {diagResult.status === "blocked" && (
                    <span className="flex items-center gap-1 text-red-400 bg-red-950/20 p-1 px-2 border border-red-500/10 rounded tracking-wider">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                      SINKHOLE INTERCEPTED
                    </span>
                  )}
                  {diagResult.status === "forwarded" && (
                    <span className="flex items-center gap-1 text-blue-400 bg-blue-950/20 p-1 px-2 border border-blue-500/10 rounded tracking-wider">
                      <ArrowLeftRight className="w-3.5 h-3.5 text-blue-400" />
                      UPSTREAM FORWARDED
                    </span>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* RIGHT COLUMN: 5 COLS */}
        <div className="lg:col-span-5 space-y-6">

          {/* D. REAL-TIME RESOLUTION CHART */}
          <div className="bg-[#080c14] border border-zinc-900 rounded p-4 font-mono shadow-md">
            <h4 className="text-xs font-black text-zinc-200 tracking-wider uppercase mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Sovereign DNS Intercept Ratio
            </h4>
            
            <div className="h-44 flex items-center justify-center relative">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="55%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#080c14", border: "1px solid #27272a" }}
                      itemStyle={{ color: "#d4d4d8", fontSize: "10px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <span className="text-zinc-500 text-xs italic">Awaiting DNS traffic logs ...</span>
              )}

              {/* Pie center details */}
              <div className="absolute left-[54%] top-[50%] transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none font-mono">
                <span className="text-[14px] font-black block text-zinc-150 leading-none">{stats.totalLogs}</span>
                <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest shrink-0 block">QUERIES</span>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="space-y-1.5 pt-3 border-t border-zinc-900">
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-zinc-300">Resolved locally:</span>
                </div>
                <span className="text-zinc-100 font-extrabold">{stats.resolved} ({Math.round((stats.resolved / (stats.totalLogs || 1)) * 100)}%)</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
                  <span className="text-zinc-300">Blocked Sinkhole intercepts:</span>
                </div>
                <span className="text-zinc-100 font-extrabold">{stats.blocked} ({Math.round((stats.blocked / (stats.totalLogs || 1)) * 100)}%)</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
                  <span className="text-zinc-300">Secured external forwarders:</span>
                </div>
                <span className="text-zinc-100 font-extrabold">{stats.forwarded} ({Math.round((stats.forwarded / (stats.totalLogs || 1)) * 100)}%)</span>
              </div>
            </div>

          </div>

          {/* E. LIVE LOOKUP STREAMING LOGS */}
          <div className="bg-[#080c14] border border-zinc-900 rounded shadow-md font-mono pb-2">
            
            <div className="p-4 border-b border-zinc-900 space-y-3">
              <div>
                <h4 className="text-xs font-black text-zinc-200 tracking-wider uppercase flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  Live Resolver DNS Traffic Logs
                </h4>
                <p className="text-[9px] text-zinc-500 font-bold block uppercase tracking-tight">
                  Real-time lookup queries processed by local private authoritative proxy instance
                </p>
              </div>

              {/* Status filtering row tabs */}
              <div className="flex items-center gap-1 border-b border-zinc-900 pb-2">
                <button
                  onClick={() => setLogFilter("all")}
                  className={`px-2 py-1 rounded text-[8px] font-bold uppercase transition-all tracking-wider border cursor-pointer ${logFilter === "all" ? "bg-emerald-500/10 border-emerald-500/35 text-emerald-400 font-extrabold" : "bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-350"}`}
                >
                  ALL LOGS
                </button>
                <button
                  onClick={() => setLogFilter("resolved")}
                  className={`px-2 py-1 rounded text-[8px] font-bold uppercase transition-all tracking-wider border cursor-pointer ${logFilter === "resolved" ? "bg-emerald-500/10 border-emerald-500/35 text-emerald-400 font-extrabold" : "bg-zinc-950 border-zinc-900 text-zinc-550 hover:text-zinc-350"}`}
                >
                  RESOLVED
                </button>
                <button
                  onClick={() => setLogFilter("blocked")}
                  className={`px-2 py-1 rounded text-[8px] font-bold uppercase transition-all tracking-wider border cursor-pointer ${logFilter === "blocked" ? "bg-[#ef4444]/15 border-[#ef4444]/35 text-[#ef4444] font-extrabold" : "bg-zinc-950 border-zinc-900 text-zinc-550 hover:text-zinc-350"}`}
                >
                  BLOCKED
                </button>
                <button
                  onClick={() => setLogFilter("forwarded")}
                  className={`px-2 py-1 rounded text-[8px] font-bold uppercase transition-all tracking-wider border cursor-pointer ${logFilter === "forwarded" ? "bg-[#3b82f6]/15 border-[#3b82f6]/35 text-[#3b82f6] font-extrabold" : "bg-zinc-950 border-zinc-900 text-zinc-550 hover:text-zinc-350"}`}
                >
                  FORWARDED
                </button>
              </div>
            </div>

            {/* Query Logs Scrollable Stream list */}
            <div className="max-h-80 overflow-y-auto divide-y divide-zinc-950 px-1 pt-1.5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
              {filteredLogs.length === 0 ? (
                <div className="p-8 text-center text-zinc-650 italic text-[10px]">
                  No live matching DNS resolving queries registered.
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className="p-2 px-3 text-[10px] space-y-1 leading-normal transition-colors hover:bg-zinc-950/50 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400 font-bold max-w-[170px] truncate block" title={log.domain}>
                        {log.domain}
                      </span>
                      <span className="text-[8px] text-zinc-500 font-bold">{log.timestamp}</span>
                    </div>

                    <div className="flex items-center justify-between text-[9px]">
                      <div className="flex items-center gap-1.5">
                        <span className="text-zinc-550 uppercase font-bold tracking-tight">from:</span>
                        <span className="text-zinc-350 bg-zinc-950 border border-zinc-900 px-1 rounded block truncate max-w-[120px]" title={`${log.clientName} (${log.clientIp})`}>
                          {log.clientName}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {log.status === "resolved" && (
                          <span className="text-emerald-400 font-semibold px-1 rounded bg-emerald-950/20 border border-emerald-500/10 flex items-center gap-0.5">
                            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>
                            RESOLVED ({log.resolvedValue})
                          </span>
                        )}
                        {log.status === "blocked" && (
                          <span className="text-red-400 font-bold px-1 rounded bg-red-950/20 border border-red-500/10 flex items-center gap-0.5">
                            <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse"></span>
                            SINKHOLE
                          </span>
                        )}
                        {log.status === "forwarded" && (
                          <span className="text-blue-400 font-bold px-1 rounded bg-blue-950/20 border border-blue-500/10 flex items-center gap-0.5" title={log.resolvedValue}>
                            <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse"></span>
                            FORWARD
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
