/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ShieldCheck, HardDrive, Cpu, AlertOctagon, RefreshCw, Layers, Server, Activity, ArrowRight, ShieldAlert } from "lucide-react";
import { Device, SystemLog } from "../types";
import { useTranslation } from "../hooks/useTranslation";

interface DashboardProps {
  devices: Device[];
  logs: SystemLog[];
  onSelectDevice: (device: Device) => void;
  onClearAlert: (logId: string) => void;
}

export const DashboardView: React.FC<DashboardProps> = ({ devices, logs, onSelectDevice, onClearAlert }) => {
  const { t } = useTranslation();
  const onlineCount = devices.filter(d => d.status === "online").length;
  const warningCount = devices.filter(d => d.status === "warning").length;
  const offlineCount = devices.filter(d => d.status === "offline").length;

  const totalCompliantPercent = Math.round(
    devices.reduce((acc, d) => acc + d.policyCompliance, 0) / devices.length
  );

  const meanCpu = Math.round(
    devices.filter(d => d.status !== "offline").reduce((acc, d) => acc + d.cpu, 0) /
    (devices.filter(d => d.status !== "offline").length || 1)
  );

  const meanRam = Math.round(
    devices.filter(d => d.status !== "offline").reduce((acc, d) => acc + d.ram, 0) /
    (devices.filter(d => d.status !== "offline").length || 1)
  );

  return (
    <div id="dashboard-view" className="space-y-6 select-none">
      {/* Metrics Row: 4 sleek cyber boxes (Image 5 Spec) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#0b0f19]/70 border border-emerald-500/15 p-4 rounded-lg relative overflow-hidden backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-zinc-400 text-xs tracking-wider">{t("dashboard.metrics.total_hosts")}</span>
            <Server className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-extrabold text-zinc-100">{devices.length}</span>
            <span className="font-mono text-[10px] text-zinc-500">{t("dashboard.metrics.catalogued")}</span>
          </div>
          <div className="absolute top-0 right-0 h-1 md:h-1.5 w-16 bg-emerald-500/20" />
        </div>

        {/* Metric 2 */}
        <div className="bg-[#0b0f19]/70 border border-emerald-500/15 p-4 rounded-lg relative overflow-hidden backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-zinc-400 text-xs tracking-wider">{t("dashboard.metrics.online_channels")}</span>
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-extrabold text-emerald-400">{onlineCount}</span>
            <span className="font-mono text-[10px] text-zinc-500">{t("dashboard.metrics.active_telemetry")}</span>
          </div>
          <div className="absolute top-0 right-0 h-1 md:h-1.5 w-16 bg-emerald-400/20" />
        </div>

        {/* Metric 3 */}
        <div className="bg-[#0b0f19]/70 border border-amber-500/15 p-4 rounded-lg relative overflow-hidden backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-zinc-400 text-xs tracking-wider">{t("dashboard.metrics.warning_drifts")}</span>
            <AlertOctagon className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-extrabold text-amber-400">{warningCount}</span>
            <span className="font-mono text-[10px] text-zinc-500">{t("dashboard.metrics.requires_check")}</span>
          </div>
          <div className="absolute top-0 right-0 h-1 md:h-1.5 w-16 bg-amber-500/20" />
        </div>

        {/* Metric 4 */}
        <div className="bg-[#0b0f19]/70 border border-zinc-800 p-4 rounded-lg relative overflow-hidden backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-zinc-400 text-xs tracking-wider">{t("dashboard.metrics.offline_stalls")}</span>
            <RefreshCw className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-extrabold text-zinc-500">{offlineCount}</span>
            <span className="font-mono text-[10px] text-zinc-650">{t("dashboard.metrics.zero_heartbeat")}</span>
          </div>
          <div className="absolute top-0 right-0 h-1 md:h-1.5 w-16 bg-zinc-700/25" />
        </div>
      </div>

      {/* Gauges Row : SVG progress gauges (Image 5 spec) */}
      <div className="bg-[#0b0f19]/40 border border-zinc-900 rounded-lg p-5">
        <h3 className="font-mono text-[11px] text-zinc-500 tracking-wider mb-4 uppercase font-bold border-b border-zinc-900 pb-2">{t("dashboard.controls_title")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Circle Gauge 1: Policy compliance */}
          <div className="flex flex-col items-center p-3 text-center bg-zinc-950/20 border border-zinc-950 rounded-lg">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="46" stroke="rgba(255,255,255,0.03)" strokeWidth="6" fill="none" />
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  stroke="#10b981"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray="289"
                  strokeDashoffset={289 - (289 * totalCompliantPercent) / 100}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center mt-1">
                <span className="font-mono text-2xl font-black text-zinc-100">{totalCompliantPercent}%</span>
                <span className="text-[9px] text-zinc-500 font-bold tracking-wider">{t("dashboard.gauges.compliance")}</span>
              </div>
            </div>
            <p className="font-mono text-xs text-zinc-300 mt-3 font-semibold">{t("dashboard.gauges.policies_rating")}</p>
            <span className="font-mono text-[10px] text-zinc-500 leading-normal mt-1 max-w-[190px]">{t("dashboard.gauges.policies_desc")}</span>
          </div>

          {/* Circle Gauge 2: Mean CPU */}
          <div className="flex flex-col items-center p-3 text-center bg-zinc-950/20 border border-zinc-950 rounded-lg">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="46" stroke="rgba(255,255,255,0.03)" strokeWidth="6" fill="none" />
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  stroke="#22d3ee"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray="289"
                  strokeDashoffset={289 - (289 * meanCpu) / 100}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center mt-1">
                <span className="font-mono text-2xl font-black text-cyan-400">{meanCpu}%</span>
                <span className="text-[9px] text-zinc-500 font-bold tracking-wider">{t("dashboard.gauges.load_mean")}</span>
              </div>
            </div>
            <p className="font-mono text-xs text-zinc-300 mt-3 font-semibold">{t("dashboard.gauges.cpu_capacity")}</p>
            <span className="font-mono text-[10px] text-zinc-500 leading-normal mt-1 max-w-[190px]">{t("dashboard.gauges.cpu_desc")}</span>
          </div>

          {/* Circle Gauge 3: Mean RAM */}
          <div className="flex flex-col items-center p-3 text-center bg-zinc-950/20 border border-zinc-950 rounded-lg">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="46" stroke="rgba(255,255,255,0.03)" strokeWidth="6" fill="none" />
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  stroke="#a78bfa"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray="289"
                  strokeDashoffset={289 - (289 * meanRam) / 100}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center mt-1">
                <span className="font-mono text-2xl font-black text-violet-400">{meanRam}%</span>
                <span className="text-[9px] text-zinc-500 font-bold tracking-wider">{t("dashboard.gauges.memory_mem")}</span>
              </div>
            </div>
            <p className="font-mono text-xs text-zinc-300 mt-3 font-semibold">{t("dashboard.gauges.memory_load")}</p>
            <span className="font-mono text-[10px] text-zinc-500 leading-normal mt-1 max-w-[190px]">{t("dashboard.gauges.memory_desc")}</span>
          </div>

        </div>
      </div>

      {/* Main Bottom Splitting: Left (Critical active alerts) - Right (Recent telemetry ledger) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left Card: Active Sec Alerts Stack */}
        <div className="bg-[#0b0f19]/70 border border-zinc-950 rounded-lg p-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-950 pb-3 mb-3">
            <span className="font-mono text-xs text-zinc-100 font-bold tracking-wider flex items-center gap-1.5 uppercase">
              <ShieldAlert className="w-4 h-4 text-rose-500" /> {t("dashboard.alerts.title")}
            </span>
            <span className="font-mono text-[10px] text-zinc-500 font-bold bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">{t("dashboard.alerts.realtime_label")}</span>
          </div>

          <div className="flex-1 space-y-2.5">
            {logs.filter(log => log.level === "critical" || log.level === "warning").length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-zinc-500 font-mono">
                <ShieldCheck className="w-10 h-10 text-emerald-500 mb-2 animate-bounce" />
                <span className="text-sm font-semibold text-emerald-400">{t("dashboard.alerts.zero_alerts")}</span>
                <p className="text-xs text-zinc-600 mt-1">{t("dashboard.alerts.protected_desc")}</p>
              </div>
            ) : (
              logs.filter(log => log.level === "critical" || log.level === "warning").map((log) => {
                const assocDevice = devices.find(d => d.id === log.deviceId);
                return (
                  <div key={log.id} className={`p-3 rounded border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${log.level === "critical" ? "bg-rose-950/15 border-rose-500/20" : "bg-amber-950/15 border-amber-500/20"}`}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${log.level === "critical" ? "bg-rose-500" : "bg-amber-500"}`} />
                        <span className="font-mono text-[11px] font-bold text-zinc-200 uppercase">{log.source}</span>
                        <span className="font-mono text-[10px] text-zinc-500">{log.timestamp}</span>
                      </div>
                      <p className="font-mono text-xs text-zinc-300 leading-normal">{log.message}</p>
                      {assocDevice && (
                        <button
                          onClick={() => onSelectDevice(assocDevice)}
                          className="mt-1.5 font-mono text-[10px] text-emerald-400 hover:underline flex items-center gap-1 text-left"
                        >
                          {t("dashboard.alerts.trace_target")} ({assocDevice.name}) <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => onClearAlert(log.id)}
                      className="text-[10px] font-mono tracking-wider bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-zinc-800 hover:border-zinc-700 px-2.5 py-1.5 rounded transition-all cursor-pointer self-start sm:self-center uppercase shrink-0"
                    >
                      {t("dashboard.alerts.acknowledge")}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Card: Dynamic Activity Stream */}
        <div className="bg-[#0b0f19]/70 border border-zinc-950 rounded-lg p-4">
          <div className="flex items-center justify-between border-b border-zinc-950 pb-3 mb-3">
            <span className="font-mono text-xs text-zinc-100 font-bold tracking-wider flex items-center gap-1.5 uppercase">
              <Layers className="w-4 h-4 text-[#10b981]" /> {t("dashboard.ledger.title")}
            </span>
            <span className="font-mono text-[9px] text-zinc-500 font-semibold uppercase">{t("dashboard.ledger.continuous_label")}</span>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {logs.map((log) => {
              const badgeColors = {
                success: "text-emerald-400 bg-emerald-950/30 border-emerald-500/20",
                info: "text-sky-400 bg-sky-950/20 border-sky-500/20",
                warning: "text-amber-400 bg-amber-950/30 border-amber-500/20",
                critical: "text-rose-400 bg-rose-950/30 border-rose-500/20"
              };
              return (
                <div key={log.id} className="flex gap-3 text-xs font-mono p-2 rounded hover:bg-zinc-950/40 border border-transparent hover:border-zinc-900 transition-colors">
                  <span className="text-zinc-600 shrink-0 text-[11px] font-medium pt-0.5">{log.timestamp}</span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[9px] font-bold px-1 py-0.5 border rounded uppercase ${badgeColors[log.status || log.level]}`}>{log.level}</span>
                      <span className="text-zinc-400 font-semibold">{log.source}</span>
                    </div>
                    <p className="text-zinc-300 leading-normal">{log.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
