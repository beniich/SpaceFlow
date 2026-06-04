/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Terminal as TermIcon, Trash2, ArrowLeftRight, CornerDownLeft, Play } from "lucide-react";
import { Device, SecurityPolicy, SystemLog } from "../types";

interface ConsoleProps {
  devices: Device[];
  policies: SecurityPolicy[];
  onAddLog: (log: SystemLog) => void;
  onModifyDeviceStatus: (deviceId: string, status: "online" | "warning" | "offline") => void;
}

interface TerminalLine {
  text: string;
  type: "input" | "output" | "error" | "success" | "warning";
}

export const ConsoleView: React.FC<ConsoleProps> = ({ devices, policies, onAddLog, onModifyDeviceStatus }) => {
  const [terminalInput, setTerminalInput] = useState<string>("");
  const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>([
    { text: "=== SOVEREIGN TERMINAL TETHER ESTABLISHED ===", type: "success" },
    { text: "Dynamic auditing engine online. Type 'help' to review shell instruction sets.", type: "output" }
  ]);
  const [commandLogList, setCommandLogList] = useState<string[]>([
    "help", "devices", "policies", "scan", "predict"
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalHistory]);

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmdTrimmed = terminalInput.trim();
    if (!cmdTrimmed) return;

    // Output query line locally first
    const updatedHistory = [...terminalHistory, { text: `sov-shell:~# ${cmdTrimmed}`, type: "input" as const }];
    setTerminalHistory(updatedHistory);
    setTerminalInput("");

    if (cmdTrimmed.toLowerCase().trim() === "clear") {
      setTerminalHistory([]);
      return;
    }

    try {
      // Connect terminal command stream directly to robust in-memory server terminal shell
      const response = await fetch("/api/shell/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commandInput: cmdTrimmed })
      });
      const data = await response.json();
      
      setTerminalHistory(prev => [
        ...prev,
        { text: data.text || "", type: data.type || "output" }
      ]);
    } catch (err) {
      setTerminalHistory(prev => [
        ...prev,
        { text: "Error: Failed to connect to secure server-side console socket tunnel relay.", type: "error" }
      ]);
    }

    if (!commandLogList.includes(cmdTrimmed)) {
      setCommandLogList(prev => [cmdTrimmed, ...prev].slice(0, 15));
    }
  };

  return (
    <div id="console-view" className="grid grid-cols-1 lg:grid-cols-4 gap-4 select-none font-mono text-xs">
      {/* Left Sidebar: Host Commands quick list */}
      <div className="bg-[#0b0f19]/70 border border-zinc-950 p-4 rounded-lg flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
            <TermIcon className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-zinc-200 uppercase tracking-widest text-[10px]">CMD QUICK DRAWER</span>
          </div>
          <p className="text-[11px] text-zinc-500 leading-normal">
            Quickly load reference scripts or review the local history queue. Click a command line to copy it directly into input buff.
          </p>
          <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
            {commandLogList.map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => setTerminalInput(cmd)}
                className="w-full text-left py-1.5 px-2 bg-zinc-950/50 hover:bg-zinc-950 border border-zinc-900 hover:border-emerald-500/25 rounded text-zinc-400 hover:text-emerald-400 tracking-wide truncate transition-all cursor-pointer flex items-center justify-between"
              >
                <span>{cmd}</span>
                <CornerDownLeft className="w-3 h-3 text-zinc-600 opacity-0 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            setTerminalHistory([
              { text: "=== SOVEREIGN TERMINAL TETHER ESTABLISHED ===", type: "success" },
              { text: "Dynamic auditing engine online. Type 'help' to review shell instruction sets.", type: "output" }
            ]);
          }}
          className="w-full mt-4 flex items-center justify-center gap-1.5 py-2 bg-zinc-950 border border-zinc-900 hover:border-rose-500/20 hover:text-rose-450 transition-all rounded text-[11px] font-bold text-zinc-500 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear History Stream
        </button>
      </div>

      {/* Right Area: Large Screen Console Terminal Interface */}
      <div className="lg:col-span-3 bg-[#030508] border border-emerald-500/15 rounded-lg flex flex-col min-h-[420px] overflow-hidden relative shadow-[0_4px_24px_rgba(0,0,0,0.8)] pb-1 pt-1.5">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 pb-2 border-b border-zinc-950 bg-zinc-950/20">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/30" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/30" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/30" />
            <span className="ml-2 font-semibold">SOVOS INTERACTIVE DIAGNOSTIC SHELL (SH)</span>
          </div>
          <span className="text-[10px] bg-emerald-950/30 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">SEC_CHANNEL_01</span>
        </div>

        {/* Scrollable history window */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[360px]">
          {terminalHistory.map((line, idx) => {
            const colors = {
              input: "text-zinc-150 font-semibold",
              output: "text-emerald-400 font-medium whitespace-pre-wrap leading-relaxed",
              error: "text-rose-400 bg-rose-950/15 border border-rose-500/10 px-2 py-1.5 rounded leading-relaxed whitespace-pre-wrap",
              success: "text-emerald-500 bg-emerald-950/15 border border-emerald-500/10 px-2 py-1 rounded leading-relaxed whitespace-pre-wrap font-semibold",
              warning: "text-amber-400 bg-amber-950/15 border border-amber-500/10 px-2 py-1.5 rounded leading-relaxed whitespace-pre-wrap font-medium"
            };
            return (
              <div key={idx} className={colors[line.type]}>
                {line.text}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Console Interactive Input prompt form */}
        <form onSubmit={handleCommandSubmit} className="flex border-t border-zinc-950 p-2.5 bg-zinc-950/40">
          <span className="text-emerald-500 font-bold mr-2 mt-2 select-none">sov-shell:~#</span>
          <input
            id="terminal-input"
            type="text"
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            placeholder="Type 'help' for instructions, press Enter to execute..."
            autoFocus
            autoComplete="off"
            className="flex-1 bg-transparent text-emerald-400 border-none outline-none font-mono text-xs caret-emerald-500 h-9 p-0 bg-transparent placeholder-emerald-900/60"
          />
          <button
            type="submit"
            className="ml-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded cursor-pointer transition-colors flex items-center justify-center gap-1 uppercase font-bold text-[10px]"
          >
            EXEC <Play className="w-3 h-3 fill-emerald-500/10" />
          </button>
        </form>
      </div>
    </div>
  );
};
