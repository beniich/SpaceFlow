/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ShieldCheck, ToggleLeft, ToggleRight, Lock, Eye, AlertTriangle, Play, CheckCircle2 } from "lucide-react";
import { SecurityPolicy } from "../types";

interface PoliciesProps {
  policies: SecurityPolicy[];
  onTogglePolicy: (policyId: string) => void;
  onDeployPolicies: () => void;
}

export const PoliciesView: React.FC<PoliciesProps> = ({ policies, onTogglePolicy, onDeployPolicies }) => {
  const [successAnimation, setSuccessAnimation] = useState<boolean>(false);

  const triggerDeploy = () => {
    onDeployPolicies();
    setSuccessAnimation(true);
    setTimeout(() => {
      setSuccessAnimation(false);
    }, 3000);
  };

  return (
    <div id="policies-view" className="space-y-6 select-none font-mono">
      {/* Intro info banner */}
      <div className="bg-[#0b0f19]/70 border border-emerald-500/10 p-4 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <h3 className="font-bold text-sm text-zinc-100 uppercase tracking-wide flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> SECURE DESIRED SOVEREIGN DESIGN STATE
          </h3>
          <p className="text-xs text-zinc-405 leading-relaxed">
            Specify mandatory host rules (USB blockages, password entropy, idle lock counters). Global agent continuously verifies all registered client configurations against parameters declared below.
          </p>
        </div>
        <button
          onClick={triggerDeploy}
          className="relative inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 hover:shadow-[0_0_12px_rgba(16,185,129,0.3)] text-zinc-950 font-bold text-xs uppercase px-5 py-2.5 rounded-md tracking-wider transition-all cursor-pointer shrink-0"
        >
          {successAnimation ? (
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 animate-bounce" /> APPLIED OVER AIRGAP
            </span>
          ) : (
            "ENFORCE GLOBAL DESIRED STATE"
          )}
        </button>
      </div>

      {/* Main Settings List */}
      <div className="space-y-4">
        {policies.map((p) => {
          const severities = {
            low: "text-zinc-400 border-zinc-800 bg-zinc-950/20",
            medium: "text-amber-400 border-amber-500/20 bg-amber-950/10",
            high: "text-orange-400 border-orange-500/20 bg-orange-950/10",
            critical: "text-rose-450 border-rose-500/20 bg-rose-950/10"
          };

          return (
            <div
              key={p.id}
              className={`p-4 rounded-lg border bg-[#0b0f19]/75 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${p.enabled ? "border-emerald-500/25 shadow-[0_4px_12px_rgba(16,185,129,0.02)]" : "border-zinc-900/80 grayscale-[30%] opacity-80"}`}
            >
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">{p.category}</span>
                  <div className="h-2 w-2 rounded-full bg-zinc-805" />
                  <span className="font-extrabold text-sm text-zinc-200 uppercase tracking-wide truncate">{p.name}</span>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase shrink-0 ${severities[p.severity]}`}>{p.severity} IMPACT</span>
                </div>
                <p className="text-xs text-zinc-400 leading-normal max-w-3xl font-mono">{p.description}</p>
                <div className="flex items-center gap-4 text-[10px] text-zinc-500">
                  <span>Policy ID: <strong className="text-zinc-400">{p.id}</strong></span>
                  <span>Registered Verification: <strong className="text-zinc-400">{p.lastEnforced}</strong></span>
                </div>
              </div>

              {/* Toggle controls */}
              <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                <span className={`text-[10px] font-bold tracking-wider ${p.enabled ? "text-emerald-400" : "text-zinc-650"}`}>
                  {p.enabled ? "ACTIVE" : "DISABLED"}
                </span>
                <button
                  onClick={() => onTogglePolicy(p.id)}
                  className="p-1 hover:bg-zinc-800/20 rounded transition-colors text-zinc-300 focus:outline-none cursor-pointer"
                  title="Toggle desired state active status"
                >
                  {p.enabled ? (
                    <ToggleRight className="w-10 h-6 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="w-10 h-6 text-zinc-700" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Industrial override key configuration drawer placeholder */}
      <div className="bg-[#06080e]/60 border border-zinc-950 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800 shrink-0">
            <Lock className="w-5 h-5 text-zinc-550" />
          </div>
          <div>
            <span className="block font-bold text-zinc-300 text-sm">SECURITY ENROLMENT KEYS</span>
            <span className="text-zinc-500 font-medium">Sovereign cryptographically bound local signature certificates.</span>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto sm:justify-end">
          <button className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 px-3.5 py-2 rounded text-zinc-350 hover:text-zinc-150 transition-colors cursor-pointer uppercase font-bold text-[10px] tracking-wider">
            <Eye className="w-3.5 h-3.5" /> Inspect Master certificate
          </button>
          <button className="bg-emerald-950/20 text-emerald-400 border border-emerald-500/20 px-3.5 py-2 rounded transition-colors uppercase font-bold text-[10px] tracking-wider flex items-center gap-1 cursor-pointer hover:bg-emerald-950/40">
            <AlertTriangle className="w-3.5 h-3.5 text-emerald-400" /> ROTATE SECURITY PASSKEY
          </button>
        </div>
      </div>
    </div>
  );
};
