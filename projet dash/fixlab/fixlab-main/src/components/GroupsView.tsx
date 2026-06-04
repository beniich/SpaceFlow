/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { FolderHeart, ShieldAlert, Cpu, ArrowRight, Layers } from "lucide-react";
import { GroupFolder } from "../types";

interface GroupsProps {
  groups: GroupFolder[];
  onSelectGroupFilter: (groupName: string) => void;
}

export const GroupsView: React.FC<GroupsProps> = ({ groups, onSelectGroupFilter }) => {
  return (
    <div id="groups-view" className="space-y-4 select-none font-mono text-xs">
      {/* Overview Intro */}
      <div className="bg-[#0b0f19]/70 border border-zinc-950 p-4 rounded-lg">
        <h3 className="font-extrabold text-sm text-zinc-100 uppercase tracking-wide flex items-center gap-1.5 mb-1">
          <FolderHeart className="w-4 h-4 text-emerald-400" /> SOVEREIGN DIRECTORY ORG GROUPS
        </h3>
        <p className="text-zinc-405 text-xs max-w-4xl leading-normal font-mono">
          Host nodes are grouped logically under strict workspace domains. View health status scores, analyze targeted security threats on clustered nodes, or sort devices dynamically.
        </p>
      </div>

      {/* Grid of folders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((group) => {
          // Color based on health score
          const isHealthy = group.healthScore >= 90;
          const isWarning = group.healthScore < 90 && group.healthScore >= 70;
          const healthColor = isHealthy ? "text-emerald-400 border-emerald-500/25 bg-emerald-950/15" : isWarning ? "text-amber-400 border-amber-500/25 bg-amber-955/15" : "text-rose-450 border-rose-500/25 bg-rose-955/15";

          return (
            <div
              key={group.id}
              className="bg-[#0b0f19]/75 border border-zinc-900 rounded-lg p-5 flex flex-col justify-between hover:border-zinc-805 hover:bg-[#0d1323]/80 transition-all duration-300 relative overflow-hidden group shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-zinc-950/60 border border-zinc-850 rounded text-yellow-500 relative">
                      <Layers className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-550 block font-bold uppercase tracking-wider">{group.category}</span>
                      <h4 className="font-extrabold text-sm text-zinc-100 group-hover:text-emerald-400/90 transition-colors uppercase tracking-wide">{group.name}</h4>
                    </div>
                  </div>
                  <span className="text-[10px] bg-zinc-950/80 px-2 py-0.5 rounded border border-zinc-850 text-zinc-500 font-bold">{group.id}</span>
                </div>

                {/* Info counters */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-zinc-950/40 p-2 border border-zinc-950 rounded">
                    <span className="text-[10px] text-zinc-500 block">ENROLLED DEVICES</span>
                    <span className="text-sm font-bold text-zinc-200">{group.deviceCount} nodes</span>
                  </div>
                  <div className="bg-zinc-950/40 p-2 border border-zinc-950 rounded">
                    <span className="text-[10px] text-zinc-500 block">THREAT INCIDENTS</span>
                    <span className={`text-sm font-bold flex items-center gap-1 ${group.activeThreats > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                      {group.activeThreats > 0 && <ShieldAlert className="w-3.5 h-3.5" />}
                      {group.activeThreats} active
                    </span>
                  </div>
                </div>

                {/* Health score segment tracking bar (Spec Image 1) */}
                <div className="space-y-1.5 mb-5">
                  <div className="flex justify-between items-center text-[10px] text-zinc-500">
                    <span>DOM GROUP HEALTH SCORE</span>
                    <span className={`font-extrabold ${healthColor.split(" ")[0]}`}>{group.healthScore}% OK</span>
                  </div>
                  <div className="flex gap-[3px] h-2">
                    {Array.from({ length: 10 }).map((_, idx) => {
                      // Determine individual segment state
                      const segVal = (idx + 1) * 10;
                      const isSegFilled = group.healthScore >= segVal;
                      let segBg = "bg-zinc-950 border border-zinc-900/60";
                      if (isSegFilled) {
                        segBg = group.healthScore >= 90 ? "bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.3)]" : group.healthScore >= 70 ? "bg-amber-500" : "bg-rose-500";
                      }
                      return (
                        <div
                          key={idx}
                          className={`flex-1 rounded-sm transition-all duration-500 ${segBg}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Dynamic Filter Redirection */}
              <button
                onClick={() => onSelectGroupFilter(group.name)}
                className="mt-2 w-full text-center py-2 bg-zinc-950/60 hover:bg-zinc-950 border border-zinc-900 hover:border-emerald-500/25 rounded transition-all text-[11px] font-bold text-zinc-350 hover:text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-1 cursor-pointer"
              >
                Inspect Group Cluster <ArrowRight className="w-3 h-3 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
