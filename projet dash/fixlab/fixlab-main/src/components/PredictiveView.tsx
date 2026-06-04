/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BrainCircuit, Play, BatteryCharging, Power, ThermometerSnowflake, Settings2, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { PredictiveFailure, SystemLog } from "../types";

interface PredictiveProps {
  failures: PredictiveFailure[];
  onTriggerMitigation: (failureId: string) => void;
}

export const PredictiveView: React.FC<PredictiveProps> = ({ failures, onTriggerMitigation }) => {
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>("");

  const runMlSweep = () => {
    setAnalyzing(true);
    setSuccessMsg("");
    setTimeout(() => {
      setAnalyzing(false);
      setSuccessMsg("ML diagnostic check traces complete. Core bearing telemetry is stabilized.");
    }, 2500);
  };

  return (
    <div id="predictive-view" className="space-y-6 select-none font-mono text-xs">
      {/* ML Analyzer Panel Intro */}
      <div className="bg-[#0b0f19]/70 border border-emerald-500/10 p-5 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <h3 className="font-extrabold text-sm text-zinc-100 uppercase tracking-wide flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-emerald-400" /> ML PREDICTIVE DEGRADATION AUDITOR (IMAGE 8 SPEC)
          </h3>
          <p className="text-zinc-405 leading-relaxed">
            Real-time neural network analyzing acoustic resistance, thermal friction logs, and voltage drift indexes to calculate remaining useful life (RUL) limits before mechanical fail nodes occur.
          </p>
        </div>
        <button
          onClick={runMlSweep}
          disabled={analyzing}
          className="bg-emerald-500 hover:bg-emerald-600 hover:shadow-[0_0_12px_rgba(16,185,129,0.3)] text-zinc-950 font-extrabold text-xs uppercase px-5 py-3 rounded-md tracking-wider transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 self-start md:self-center shrink-0"
        >
          {analyzing ? (
            <>
              <BrainCircuit className="w-4 h-4 animate-spin text-zinc-950" /> SWEEPING TELEMETRY WEAR...
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" /> RUN ML DEGRADATION SWEEP
            </>
          )}
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-950/20 border border-emerald-500/20 p-3 rounded-md text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Failures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {failures.map((f) => {
          const urgencies = {
            low: "border-zinc-800 text-zinc-400 bg-zinc-950/20",
            medium: "border-amber-500/30 text-amber-400 bg-amber-950/10",
            high: "border-orange-500/30 text-orange-400 bg-orange-950/10",
            critical: "border-rose-500/40 text-danger bg-rose-955/20 hover:border-rose-500/60 animate-pulse"
          };

          return (
            <div
              key={f.id}
              className="bg-[#0b0f19]/75 border border-zinc-900 rounded-lg p-5 flex flex-col justify-between hover:border-zinc-800 transition-all duration-300 relative overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase ${urgencies[f.urgency]}`}>{f.urgency} FAULT RISK</span>
                  <span className="text-zinc-550 font-bold text-[10px] uppercase">RUL DETECTED</span>
                </div>

                <h4 className="font-extrabold text-sm text-zinc-100 uppercase tracking-wide truncate mb-1">{f.deviceName}</h4>
                <p className="text-[11px] text-zinc-500 mb-4 uppercase font-semibold">Component: <span className="text-zinc-300">{f.component}</span></p>

                {/* Remaining Useful Life Slider gauge */}
                <div className="space-y-2 bg-zinc-950/50 p-3 rounded border border-zinc-950 mb-4">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-500">REMAINING USEFUL LIFE (RUL)</span>
                    <span className="text-emerald-400 font-extrabold">{f.timeToFailure}</span>
                  </div>
                  <div className="h-3 bg-zinc-900 rounded-lg overflow-hidden relative border border-zinc-900">
                    <div
                      className={`h-full rounded-lg transition-all duration-1000 ${f.probability > 75 ? "bg-rose-500" : f.probability > 50 ? "bg-amber-500" : "bg-emerald-500"}`}
                      style={{ width: `${100 - f.probability}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-zinc-650 font-semibold uppercase">
                    <span>Imminent fault</span>
                    <span>100% nominal health</span>
                  </div>
                </div>

                {/* Technical diagnostics */}
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between text-[10px] text-zinc-550 border-b border-zinc-950 pb-1">
                    <span>DIAGNOSIS THERMAL JUNCTION</span>
                    <span>{f.currentTemp}°C</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-550 border-b border-zinc-950 pb-1">
                    <span>FAILURE PROBABILITY ACCURACY</span>
                    <span className="font-bold text-zinc-350">{f.probability}% confident</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-normal leading-relaxed text-zinc-400/90 italic pt-1">
                    "{f.riskDescription}"
                  </p>
                </div>
              </div>

              {/* Action trigger button */}
              <button
                onClick={() => onTriggerMitigation(f.id)}
                className="w-full text-center py-2.5 bg-zinc-950/60 hover:bg-zinc-950 border border-zinc-900 hover:border-emerald-500/20 rounded transition-all text-[10px] font-bold text-zinc-500 hover:text-emerald-400 uppercase tracking-widest cursor-pointer"
              >
                Incorporate Mitigating Coolant cycle / Backup
              </button>
            </div>
          );
        })}
      </div>

      {/* Extra ML Insights Deck */}
      <div className="bg-[#0b0f19]/40 border border-zinc-900 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-950/60 border border-zinc-850 rounded text-cyan-400">
            <Settings2 className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <span className="block font-bold text-zinc-300">AUTO-COOLANT DEVIATION INJECTIONS</span>
            <span className="text-zinc-500 text-[11px]">Neural system automatically routes supplementary coolant loads over host relays.</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 px-2 py-1 rounded font-bold uppercase">
            AUTONOMOUS CORRECTION: PASSING
          </span>
        </div>
      </div>
    </div>
  );
};
