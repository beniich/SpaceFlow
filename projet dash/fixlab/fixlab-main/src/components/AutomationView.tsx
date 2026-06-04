/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Workflow, Plus, Play, Trash2, CheckCircle2, RefreshCw, Layers } from "lucide-react";
import { AutoNode, AutoEdge } from "../types";
import { initialNodes, initialEdges } from "../mockData";

export const AutomationView: React.FC = () => {
  const [nodes, setNodes] = useState<AutoNode[]>(initialNodes);
  const [edges, setEdges] = useState<AutoEdge[]>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState<string>("");
  const [editConfig, setEditConfig] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const handleNodeClick = (node: AutoNode) => {
    setSelectedNodeId(node.id);
    setEditLabel(node.label);
    setEditConfig(node.config);
  };

  const saveSelectedNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNodeId) return;

    setNodes(prev => prev.map(n => {
      if (n.id === selectedNodeId) {
        return { ...n, label: editLabel, config: editConfig };
      }
      return n;
    }));

    setSuccessMsg("Automation compilation parameters logged.");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const createNewNode = (type: "trigger" | "condition" | "action") => {
    const id = `node-gen-${Date.now()}`;
    const labels = {
      trigger: "Custom Inbound Event Trigger",
      condition: "Value Boolean Constraint Map",
      action: "Relay Override Pipeline Dispatched"
    };
    const configs = {
      trigger: "Signal match === 1",
      condition: "Sensor value >= 95",
      action: "Lock kernel modules"
    };

    const countOfSameType = nodes.filter(n => n.type === type).length;
    const xPositions = { trigger: 80, condition: 330, action: 580 };

    const newNode: AutoNode = {
      id,
      type,
      label: labels[type],
      config: configs[type],
      x: xPositions[type],
      y: 120 + countOfSameType * 110
    };

    setNodes(prev => [...prev, newNode]);

    // Automatically build a sequential link if possible
    // Connect previous trigger to condition, or condition to action
    if (type === "condition") {
      const parentTrigger = nodes.find(n => n.type === "trigger" && !edges.some(e => e.sourceId === n.id));
      if (parentTrigger) {
        setEdges(prev => [...prev, { id: `edge-gen-${Date.now()}-1`, sourceId: parentTrigger.id, targetId: id }]);
      }
    } else if (type === "action") {
      const parentCondition = nodes.find(n => n.type === "condition" && !edges.some(e => e.sourceId === n.id));
      if (parentCondition) {
        setEdges(prev => [...prev, { id: `edge-gen-${Date.now()}-2`, sourceId: parentCondition.id, targetId: id }]);
      }
    }
  };

  const purgeAutomation = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
  };

  return (
    <div id="automation-view" className="space-y-6 select-none font-mono text-xs">
      {/* Visual Workspace Intro banner */}
      <div className="bg-[#0b0f19]/70 border border-zinc-950 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-sm text-zinc-100 uppercase tracking-wide flex items-center gap-1.5 mb-1">
            <Workflow className="w-4 h-4 text-emerald-400" /> SECURE DEVIATION AUTOMATIONS (IMAGE 21 SPEC)
          </h3>
          <p className="text-zinc-405 text-xs max-w-2xl leading-normal font-mono">
            Define programmatic security controls mapping host telemetry breaches to targeted system action relays instantly over airgap networks without human intervention required.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setNodes(initialNodes).then(() => setEdges(initialEdges))}
            className="bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-100 border border-zinc-800 hover:border-zinc-700 px-3 py-2 rounded text-[10px] items-center gap-1 uppercase font-extrabold tracking-wider transition-colors cursor-pointer hidden md:flex"
            title="Reload initial canvas nodes preset"
          >
            <RefreshCw className="w-3.5 h-3.5" /> REVERT TO DEFAULT
          </button>
          <button
            onClick={purgeAutomation}
            className="bg-zinc-950 hover:bg-rose-955 text-zinc-550 hover:text-rose-400 border border-zinc-850 hover:border-rose-950 px-3.5 py-2 rounded text-[10px] flex items-center gap-1.5 uppercase font-extrabold tracking-wider transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> CLEAR CANVAS
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-950/20 border border-emerald-500/20 p-3 rounded text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main split dashboard: Left (interactive node graphics grid) - Right (Interactive config inspector form) */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

        {/* Left Side: SVG Connected Nodes Stage */}
        <div className="xl:col-span-3 bg-[#03060a] border border-zinc-950 rounded-lg p-5 min-h-[460px] relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-zinc-950 pb-3 mb-4 text-zinc-400">
            <div className="flex gap-4">
              <span className="flex items-center gap-1 text-[10px]"><span className="w-2 h-2 rounded-full bg-rose-500" /> TRIGGERS</span>
              <span className="flex items-center gap-1 text-[10px]"><span className="w-2 h-2 rounded-full bg-amber-500" /> CONDITIONS</span>
              <span className="flex items-center gap-1 text-[10px]"><span className="w-2 h-2 rounded-full bg-emerald-500" /> ACTIONS</span>
            </div>
            <span className="text-[10px] text-zinc-550 hidden sm:block uppercase">CLICK NODE TO HIGHLIGHT PROPERTIES</span>
          </div>

          {/* Graphical Nodes Canvas Container */}
          <div className="flex-1 relative min-h-[340px] border border-dashed border-zinc-950 rounded bg-zinc-950/20 py-2">
            {/* SVG Linking Lines overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 2 L 10 5 L 0 8 z" fill="#10b981" opacity="0.6" />
                </marker>
              </defs>
              {edges.map((edge) => {
                const srcNode = nodes.find(n => n.id === edge.sourceId);
                const tgtNode = nodes.find(n => n.id === edge.targetId);
                if (!srcNode || !tgtNode) return null;

                // Simple routing box link
                const startX = srcNode.x + 95;
                const startY = srcNode.y + 40;
                const endX = tgtNode.x - 10;
                const endY = tgtNode.y + 40;

                return (
                  <g key={edge.id}>
                    {/* Glowing drop path */}
                    <path
                      d={`M ${startX} ${startY} C ${(startX + endX) / 2} ${startY}, ${(startX + endX) / 2} ${endY}, ${endX} ${endY}`}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3.5"
                      strokeOpacity="0.08"
                    />
                    <path
                      d={`M ${startX} ${startY} C ${(startX + endX) / 2} ${startY}, ${(startX + endX) / 2} ${endY}, ${endX} ${endY}`}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="1.2"
                      strokeOpacity="0.6"
                      markerEnd="url(#arrow)"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Render Nodes layout cards absolutely */}
            {nodes.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-zinc-650 font-bold">
                <Workflow className="w-10 h-10 text-zinc-800 mb-2" />
                <span>WORKSPACE COMPILER EMPTY</span>
                <p className="text-zinc-650 font-medium text-xs mt-1 max-w-[280px]">Utilize trigger, restriction condition or action parameters lower buttons to seed.</p>
              </div>
            ) : (
              nodes.map((node) => {
                const borderColors = {
                  trigger: "border-rose-500/20 hover:border-rose-500/50 text-rose-400 bg-rose-955/5",
                  condition: "border-amber-500/20 hover:border-amber-500/50 text-amber-400 bg-amber-955/5",
                  action: "border-emerald-500/25 hover:border-emerald-500/50 text-emerald-400 bg-emerald-955/5"
                };

                const isSelected = selectedNodeId === node.id;

                return (
                  <div
                    key={node.id}
                    onClick={() => handleNodeClick(node)}
                    style={{ left: `${node.x}px`, top: `${node.y}px` }}
                    className={`absolute w-[200px] p-3 rounded border font-mono text-xs select-none cursor-pointer transition-all ${borderColors[node.type]} ${isSelected ? "border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.12)] bg-[#10b981]/5" : "shadow-[0_4px_12px_rgba(0,0,0,0.6)]"}`}
                  >
                    <div className="flex items-center justify-between mb-1.5 border-b border-zinc-900 pb-1">
                      <span className="text-[9px] uppercase font-extrabold font-bold tracking-widest opacity-80">{node.type}</span>
                    </div>
                    <span className="font-extrabold text-[11px] block text-zinc-100 truncate mb-1" title={node.label}>{node.label}</span>
                    <span className="text-[10px] text-zinc-500 block truncate" title={node.config}>{node.config}</span>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Node Seeder buttons */}
          <div className="mt-4 pt-3 border-t border-zinc-950 flex flex-wrap items-center gap-2">
            <button
              onClick={() => createNewNode("trigger")}
              className="bg-zinc-950 border border-zinc-900 text-rose-400 hover:bg-[#121c2e]/40 px-3 py-2 rounded text-[10px] flex items-center gap-1 uppercase font-bold tracking-wider cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> ADD TRIGGER +
            </button>
            <button
              onClick={() => createNewNode("condition")}
              className="bg-zinc-950 border border-zinc-900 text-amber-400 hover:bg-[#121c2e]/40 px-3 py-2 rounded text-[10px] flex items-center gap-1 uppercase font-bold tracking-wider cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> ADD CONDITION +
            </button>
            <button
              onClick={() => createNewNode("action")}
              className="bg-zinc-950 border border-zinc-900 text-emerald-400 hover:bg-[#121c2e]/40 px-3 py-2 rounded text-[10px] flex items-center gap-1 uppercase font-bold tracking-wider cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> ADD ACTION +
            </button>
          </div>
        </div>

        {/* Right Side: properties inspector configuration form */}
        <div className="bg-[#0b0f19]/70 border border-zinc-950 p-4 rounded-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-zinc-900 pb-2 mb-4">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span className="font-extrabold text-[10px] text-zinc-200 tracking-wider uppercase">PARAMETER INSPECTOR</span>
            </div>

            {selectedNodeId ? (
              <form onSubmit={saveSelectedNode} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-550 text-[10px] block font-bold uppercase">Node Label Text</label>
                  <input
                    type="text"
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 hover:border-zinc-800 rounded px-2.5 py-1.8 text-zinc-100 font-mono text-xs outline-none focus:border-emerald-500/50"
                    placeholder="E.g., Host warning triggers"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-550 text-[10px] block font-bold uppercase">Trigger/Relay Argument</label>
                  <input
                    type="text"
                    value={editConfig}
                    onChange={(e) => setEditConfig(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 hover:border-zinc-800 rounded px-2.5 py-1.8 text-zinc-100 font-mono text-xs outline-none focus:border-emerald-500/50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full text-center bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-extrabold text-xs py-2 rounded uppercase tracking-widest transition-all cursor-pointer"
                >
                  SAVE NODE CONFIG
                </button>
              </form>
            ) : (
              <div className="py-20 text-center text-zinc-600 font-mono font-medium">
                No active node highlighted.<br />Click a block on the left canvas container to configure.
              </div>
            )}
          </div>

          <div className="bg-[#030508] p-3 rounded border border-zinc-950 mt-4 text-[10px] text-zinc-550 leading-relaxed">
            ⚠️ Node definitions are bundled dynamically and deployed securely onto local device registry interfaces. Ensure arguments align with strict schema specifications.
          </div>
        </div>

      </div>
    </div>
  );
};
