/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, Grid, List, Cpu, Database, Server, Compass, Shield, MonitorPlay, CheckCircle2 } from "lucide-react";
import { Device } from "../types";

interface DevicesProps {
  devices: Device[];
  selectedDevice: Device | null;
  onSelectDevice: (device: Device) => void;
}

export const DevicesView: React.FC<DevicesProps> = ({ devices, selectedDevice, onSelectDevice }) => {
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [osFilter, setOsFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.ip.includes(searchTerm) ||
      device.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOs = osFilter === "all" || device.os === osFilter;
    const matchesStatus = statusFilter === "all" || device.status === statusFilter;
    return matchesSearch && matchesOs && matchesStatus;
  });

  return (
    <div id="devices-view" className="space-y-4 select-none">
      {/* Search & Filters Control Panel */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-[#0b0f19]/70 border border-zinc-950 p-4 rounded-lg">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
          <input
            id="device-search-input"
            type="text"
            placeholder="Search host, IP or serial..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-emerald-500/50 rounded-md py-2 pl-9 pr-4 font-mono text-xs text-zinc-200 placeholder-zinc-500 outline-none transition-colors"
          />
        </div>

        {/* Filters Selectors */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* OS Filter */}
          <select
            value={osFilter}
            onChange={(e) => setOsFilter(e.target.value)}
            className="bg-zinc-950/80 border border-zinc-800 text-zinc-300 font-mono text-xs rounded-md py-2 px-3 outline-none focus:border-emerald-500/50"
          >
            <option value="all">ALL PLATFORMS</option>
            <option value="SovereignOS">SovereignOS</option>
            <option value="Linux">Linux</option>
            <option value="Windows">Windows</option>
            <option value="macOS">macOS</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-950/80 border border-zinc-800 text-zinc-300 font-mono text-xs rounded-md py-2 px-3 outline-none focus:border-emerald-500/50"
          >
            <option value="all">ALL HEARTBEATS</option>
            <option value="online">ONLINE</option>
            <option value="warning">WARNING</option>
            <option value="offline">OFFLINE</option>
          </select>

          {/* View Toggle */}
          <div className="flex bg-zinc-950 border border-zinc-900 rounded p-0.5 ml-auto md:ml-0">
            <button
              onClick={() => setViewType("grid")}
              className={`p-1.5 rounded transition-all cursor-pointer ${viewType === "grid" ? "bg-emerald-500/10 text-emerald-400" : "text-zinc-500 hover:text-zinc-300"}`}
              title="Matrix Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewType("list")}
              className={`p-1.5 rounded transition-all cursor-pointer ${viewType === "list" ? "bg-emerald-500/10 text-emerald-400" : "text-zinc-500 hover:text-zinc-300"}`}
              title="Table Tabular List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {filteredDevices.length === 0 ? (
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-lg p-12 text-center text-zinc-500 font-mono">
          <Compass className="w-12 h-12 text-zinc-700 mx-auto mb-3 animate-spin duration-1000" />
          <span className="text-sm font-semibold text-zinc-400">No host terminals match query specs</span>
          <p className="text-xs text-zinc-650 mt-1 max-w-[320px] mx-auto">Double check operating system constraints, status registers, or search strings.</p>
        </div>
      ) : viewType === "grid" ? (
        /* GRID VIEW (Image 4 Alignment) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDevices.map((device) => {
            const isSel = selectedDevice?.id === device.id;
            return (
              <div
                key={device.id}
                onClick={() => onSelectDevice(device)}
                className={`group bg-[#0b0f19]/75 border rounded-lg p-4 transition-all duration-300 relative overflow-hidden backdrop-blur-sm cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.5)] ${isSel ? "border-emerald-500 bg-emerald-500/[0.02]" : "border-zinc-900/80 hover:border-zinc-800 hover:bg-[#0e1422]/80"}`}
              >
                {/* Upper line: Status dot, ID, OS */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${device.status === "online" ? "bg-emerald-500 shadow-[0_0_6px_#10b981]" : device.status === "warning" ? "bg-amber-500 shadow-[0_0_6px_#f59e0b]" : "bg-neutral-600"}`} />
                    <span className="font-mono text-[10px] text-zinc-400 font-semibold uppercase">{device.os}</span>
                  </div>
                  <span className="text-[10px] bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 text-zinc-500 font-mono font-medium group-hover:border-emerald-500/25 transition-all">{device.id}</span>
                </div>

                {/* Device Primary Name */}
                <h4 className="font-mono text-xs font-bold text-zinc-200 mb-1.5 tracking-wide truncate group-hover:text-emerald-400/90 transition-colors">{device.name}</h4>
                <p className="font-mono text-[11px] text-zinc-500 mb-4">{device.ip}</p>

                {/* Performance Mini Indicators */}
                {device.status !== "offline" ? (
                  <div className="space-y-2 text-xs font-mono">
                    {/* CPU Mini bar */}
                    <div>
                      <div className="flex justify-between text-[10px] text-zinc-500 mb-0.5">
                        <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> CPU</span>
                        <span className="font-semibold text-zinc-400">{device.cpu}%</span>
                      </div>
                      <div className="h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${device.cpu > 80 ? "bg-rose-500" : device.cpu > 60 ? "bg-amber-500" : "bg-emerald-500"}`}
                          style={{ width: `${device.cpu}%` }}
                        />
                      </div>
                    </div>

                    {/* RAM Mini bar */}
                    <div>
                      <div className="flex justify-between text-[10px] text-zinc-500 mb-0.5">
                        <span className="flex items-center gap-1"><Database className="w-3 h-3" /> RAM</span>
                        <span className="font-semibold text-zinc-400">{device.ram}%</span>
                      </div>
                      <div className="h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${device.ram > 85 ? "bg-rose-500" : device.ram > 65 ? "bg-amber-500" : "bg-cyan-400"}`}
                          style={{ width: `${device.ram}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-[46px] border border-dashed border-zinc-800/60 rounded flex items-center justify-center text-center font-mono text-[10px] text-zinc-650 uppercase">
                    Host Node Unreachable
                  </div>
                )}

                {/* Sub-card hover details decoration */}
                <div className="mt-3.5 pt-3.5 border-t border-zinc-900/60 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span className="truncate max-w-[130px]" title={device.location}>{device.location}</span>
                  <span className="text-zinc-600">Uptime: {device.uptime}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW (Image 3 Alignment) */
        <div className="bg-[#0b0f19]/70 border border-zinc-950 rounded-lg overflow-hidden backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-auto text-xs font-mono select-none">
              <thead className="bg-[#0e1422]/60 text-zinc-500 border-b border-zinc-900 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-bold">Host / OS</th>
                  <th className="py-3 px-4 font-bold">IP Coordinates</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Uptime Ledger</th>
                  <th className="py-3 px-4 font-bold">CPU load</th>
                  <th className="py-3 px-4 font-bold">RAM load</th>
                  <th className="py-3 px-4 font-bold">Compliance rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/50">
                {filteredDevices.map((device) => {
                  const isSel = selectedDevice?.id === device.id;
                  return (
                    <tr
                      key={device.id}
                      onClick={() => onSelectDevice(device)}
                      className={`hover:bg-[#121a2d]/45 cursor-pointer transition-colors ${isSel ? "bg-[#10b981]/5 text-zinc-100" : "text-zinc-300"}`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <Server className={`w-4 h-4 ${device.status === "online" ? "text-emerald-400" : device.status === "warning" ? "text-amber-400" : "text-zinc-600"}`} />
                          <div>
                            <span className="font-bold text-zinc-200 block text-xs tracking-wide">{device.name}</span>
                            <span className="text-[10px] text-zinc-500">{device.os} • {device.serialNumber}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-emerald-500/80">{device.ip}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${device.status === "online" ? "bg-emerald-950/30 text-emerald-400 border-emerald-500/20" : device.status === "warning" ? "bg-amber-950/30 text-amber-400 border-amber-500/20" : "bg-zinc-800/50 text-zinc-500 border-zinc-700/20"}`}>
                          {device.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-400">{device.status !== "offline" ? device.uptime : "--"}</td>
                      <td className="py-3 px-4">
                        {device.status !== "offline" ? (
                          <div className="flex items-center gap-2">
                            <span className="w-8 font-semibold text-zinc-450">{device.cpu}%</span>
                            <div className="w-16 h-1 bg-zinc-900 rounded overflow-hidden">
                              <div className={`h-full rounded ${device.cpu > 80 ? "bg-rose-500" : "bg-emerald-500"}`} style={{ width: `${device.cpu}%` }} />
                            </div>
                          </div>
                        ) : "--"}
                      </td>
                      <td className="py-3 px-4">
                        {device.status !== "offline" ? (
                          <div className="flex items-center gap-2">
                            <span className="w-8 font-semibold text-zinc-450">{device.ram}%</span>
                            <div className="w-16 h-1 bg-zinc-900 rounded overflow-hidden">
                              <div className={`h-full rounded ${device.ram > 85 ? "bg-rose-500" : "bg-cyan-400"}`} style={{ width: `${device.ram}%` }} />
                            </div>
                          </div>
                        ) : "--"}
                      </td>
                      <td className="py-3 px-4 font-bold text-zinc-400">
                        <span className={device.policyCompliance === 100 ? "text-emerald-400 font-semibold" : device.policyCompliance >= 75 ? "text-amber-400" : "text-rose-400"}>
                          {device.policyCompliance}% compliant
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
