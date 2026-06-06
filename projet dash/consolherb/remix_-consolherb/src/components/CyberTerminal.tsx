import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Send, Play, Sparkles } from 'lucide-react';
import { TerminalLog } from '../types';

interface CyberTerminalProps {
  logs: TerminalLog[];
  onAddLog: (level: 'info' | 'success' | 'warn' | 'error', message: string) => void;
  onClearLogs: () => void;
  onTriggerCommand: (command: string) => void;
}

export default function CyberTerminal({ logs, onAddLog, onClearLogs, onTriggerCommand }: CyberTerminalProps) {
  const [inputValue, setInputValue] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal back to bottom when log updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputValue.trim();
    if (!cmd) return;
    onTriggerCommand(cmd);
    setInputValue('');
  };

  const getLogColorClass = (level: string) => {
    switch (level) {
      case 'success':
        return 'text-[#4de082]';
      case 'warn':
        return 'text-[#38BDF8]';
      case 'error':
        return 'text-red-400 font-bold';
      default:
        return 'text-[#d4e4fa]';
    }
  };

  const getLogLevelLabel = (level: string) => {
    switch (level) {
      case 'success':
        return 'SUCCESS';
      case 'warn':
        return 'WARNING';
      case 'error':
        return 'ALERTE';
      default:
        return 'SYSTEM';
    }
  };

  return (
    <div className="bg-[#0b1522] border border-[#334155] rounded-[4px] flex flex-col h-72 md:h-80" id="cyber-terminal-panel">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#334155] bg-[#0d1c2d]">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#4de082] animate-pulse-slow" />
          <span className="text-[11px] font-mono font-bold tracking-wider text-[#b9c7e4] uppercase">
            KERNEL INTERACTIVE SHELL // v4.11-SOC-2
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#4de082]/80"></span>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="text-gray-500 mb-2">
          --- CC_ARCH SECURUM COMMAND CONSOLE [{new Date().toLocaleDateString()}] ---<br />
          Type <span className="text-[#38BDF8]">'help'</span> for a list of target compliance commands.<br />
          Try <span className="text-[#4de082]">'ping'</span> or <span className="text-red-400 font-bold">'lockdown'</span> to override alert status.
        </div>
        
        {logs.map((log) => (
          <div key={log.id} className="leading-5" id={`log-item-${log.id}`}>
            <span className="text-gray-500 select-none">[{log.timestamp}]</span>{' '}
            <span className={`font-semibold bg-[#122131]/60 px-1 py-0.5 rounded-xs border border-slate-700/30 text-[10px] mr-1.5 ${getLogColorClass(log.level)}`}>
              {getLogLevelLabel(log.level)}
            </span>{' '}
            <span className={log.level === 'error' ? 'text-red-400' : 'text-slate-300'}>
              {log.message}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Terminal Input Form */}
      <form onSubmit={handleSubmit} className="border-t border-[#334155] bg-[#07111c] flex items-center px-3 py-2">
        <span className="font-mono text-xs text-[#4de082] mr-2 select-none">root@soc-compliance:~#</span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Entrez une commande (ex: status, help, clear, verify)..."
          className="flex-1 bg-transparent border-none text-xs font-mono text-white outline-none focus:ring-0 placeholder-gray-600"
          autoComplete="off"
          id="terminal-input-command"
        />
        <button
          type="submit"
          className="text-[#4de082] hover:text-white transition p-1 cursor-pointer ml-1"
          title="Send command"
          id="send-command-btn"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
