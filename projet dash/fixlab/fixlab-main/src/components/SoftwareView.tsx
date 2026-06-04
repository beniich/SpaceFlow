/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, Hammer, ShieldAlert, Cpu, AlertTriangle, CloudDownload, HelpCircle, CheckCircle } from "lucide-react";
import { SoftwarePackage, SystemLog } from "../types";

interface SoftwareProps {
  softwarePackages: SoftwarePackage[];
  onTriggerUpdate: (pkgId: string) => void;
}

export const SoftwareView: React.FC<SoftwareProps> = ({ softwarePackages, onTriggerUpdate }) => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const totalVulnerable = softwarePackages.filter(p => p.status === "vulnerable").length;
  const totalUpToDate = softwarePackages.filter(p => p.status === "up_to_date").length;

  const handleUpdateClick = (pkgId: string, pkgName: string) => {
    setUpdatingId(pkgId);
    setTimeout(() => {
      onTriggerUpdate(pkgId);
      setUpdatingId(null);
    }, 2000);
  };

  return (
    <div id="software-view" className="space-y-6 select-none font-mono text-xs">
      {/* Upper overview summary cards (Image 24) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Vulnerable packages count */}
        <div className="bg-[#0b0f19]/70 border border-rose-500/10 p-4 rounded-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-405 font-bold text-[10px]">CVE VULNERABILITY COUNT</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-450">{totalVulnerable}</span>
            <span className="text-[10px] text-zinc-550">libraries exposed</span>
          </div>
          <div className="absolute top-0 right-0 h-1 w-16 bg-rose-500/20" />
        </div>

        {/* Card 2: Patched packages count */}
        <div className="bg-[#0b0f19]/70 border border-emerald-500/10 p-4 rounded-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-405 font-bold text-[10px]">COMPLIANT LIBRARIES</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400">{totalUpToDate}</span>
            <span className="text-[10px] text-zinc-550">systems secure</span>
          </div>
          <div className="absolute top-0 right-0 h-1 w-16 bg-emerald-500/20" />
        </div>

        {/* Card 3: System patching percentage */}
        <div className="bg-[#0b0f19]/70 border border-zinc-950 p-4 rounded-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-405 font-bold text-[10px]">GLOBAL INTEGRITY PERCENTAGE</span>
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-cyan-400">
              {Math.round((totalUpToDate / softwarePackages.length) * 100)}%
            </span>
            <span className="text-[10px] text-zinc-550">integrity index</span>
          </div>
          <div className="absolute top-0 right-0 h-1 w-16 bg-cyan-400/20" />
        </div>
      </div>

      {/* Main auditing table (Image 24 bottom spec) */}
      <div className="bg-[#0b0f19]/70 border border-zinc-950 rounded-lg overflow-hidden backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <div className="p-4 border-b border-zinc-950 bg-zinc-950/20 flex items-center justify-between">
          <span className="font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
            <Hammer className="w-4 h-4 text-emerald-400" /> SOFTWARE PATCH COMPLIANCE RECORDS
          </span>
          <span className="text-[10px] text-zinc-500 font-bold bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded">KERNEL LAYER CONTROL</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-auto text-xs select-none">
            <thead className="bg-[#0e1422]/60 text-zinc-500 border-b border-zinc-900 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 font-bold">Package Name</th>
                <th className="py-3 px-4 font-bold">Current Version</th>
                <th className="py-3 px-4 font-bold">Target Stable Version</th>
                <th className="py-3 px-4 font-bold">Vulnerability Mappings</th>
                <th className="py-3 px-4 font-bold">Compliance Status</th>
                <th className="py-3 px-4 font-bold text-right">Deployment Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50">
              {softwarePackages.map((pkg) => {
                const statusData = {
                  up_to_date: {
                    label: "OK - Nominal",
                    color: "text-emerald-400 bg-emerald-950/30 border-emerald-500/20"
                  },
                  update_available: {
                    label: "Patch Alert",
                    color: "text-sky-400 bg-sky-950/20 border-sky-500/20"
                  },
                  vulnerable: {
                    label: "CVE EXTREME RISK",
                    color: "text-rose-400 bg-rose-950/30 border-rose-500/20 animate-pulse"
                  },
                  unsupported: {
                    label: "Unsupported Layer",
                    color: "text-amber-400 bg-amber-950/30 border-amber-500/20"
                  }
                };

                const currentStatus = statusData[pkg.status];
                const isVulnerable = pkg.status === "vulnerable" || pkg.status === "unsupported";

                return (
                  <tr key={pkg.id} className="hover:bg-[#121a2d]/45 transition-colors font-mono">
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-extrabold text-zinc-200 block tracking-wide uppercase">{pkg.name}</span>
                        <span className="text-[10px] text-zinc-500 font-semibold">{pkg.id} • Deployed on {pkg.installedOn} host nodes</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-zinc-300">{pkg.version}</td>
                    <td className="py-3.5 px-4 font-medium text-emerald-500/80">{pkg.latestVersion}</td>
                    <td className="py-3.5 px-4">
                      {pkg.cveId ? (
                        <div className="flex items-center gap-1.5 text-rose-450 font-bold bg-rose-955/20 border border-rose-500/10 px-2 py-0.5 rounded w-max">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{pkg.cveId}</span>
                        </div>
                      ) : isVulnerable && pkg.severity ? (
                        <span className="text-zinc-450 uppercase font-bold tracking-widest text-[10px]">
                          VULN CLASS LEVEL: {pkg.severity}
                        </span>
                      ) : (
                        <span className="text-zinc-600 font-bold text-[10px]">NO CVE MAPPINGS</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded text-[10px] font-bold border ${currentStatus.color}`}>
                        {currentStatus.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {pkg.status !== "up_to_date" ? (
                        <button
                          onClick={() => handleUpdateClick(pkg.id, pkg.name)}
                          disabled={updatingId !== null}
                          className="inline-flex items-center gap-1.2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-zinc-950 border border-emerald-500/30 hover:border-emerald-500 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {updatingId === pkg.id ? (
                            <span className="flex items-center gap-1.5">
                              <CloudDownload className="w-3.5 h-3.5 animate-spin" /> DOWNLOADING...
                            </span>
                          ) : (
                            <>
                              <CloudDownload className="w-3.5 h-3.5" /> FLASH KERNEL
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-[10px] text-zinc-600 font-bold tracking-wider uppercase">SECURE DESIRED STATE</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
