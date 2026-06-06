import { useState } from 'react';
import { Shield, Database, AlertOctagon, Key, RefreshCw, Lock, Unlock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AuditNode, NodeStatus } from '../types';

interface NodeCardProps {
  key?: string;
  node: AuditNode;
  onActionClick: (nodeId: string) => void;
  isProcessing: boolean;
}

export default function NodeCard({ node, onActionClick, isProcessing }: NodeCardProps) {
  // Safe math calculations for the circular gauge ring logic
  // Circumference: 2 * PI * r = 2 * 3.14159 * 54 ≈ 339.29 (using r=54 for high spacing inside 128x128 container, i.e. cx=64, r=54)
  const radius = 54;
  const circumference = 2 * Math.PI * radius; // 339.29
  const strokeDashoffset = circumference - (node.percentage / 100) * circumference;

  // Let's obtain the corresponding colors based on current state
  const getStatusClasses = (status: NodeStatus) => {
    switch (status) {
      case 'optimal':
        return {
          borderHover: 'hover:border-[#4de082]',
          borderNorm: 'border-[#334155]',
          glow: 'hover:shadow-[0_0_12px_rgba(77,224,130,0.15)]',
          textClass: 'text-[#4de082]',
          badgeText: 'Optimal',
          strokeColor: '#4de082'
        };
      case 'updating':
        return {
          borderHover: 'hover:border-[#38BDF8]',
          borderNorm: 'border-[#334155]',
          glow: 'hover:shadow-[0_0_12px_rgba(56,189,248,0.15)]',
          textClass: 'text-[#38BDF8]',
          badgeText: 'Updating',
          strokeColor: '#38BDF8'
        };
      case 'critical':
        return {
          borderHover: 'border-red-500/80',
          borderNorm: 'border-red-900/60 shadow-[0_0_15px_rgba(255,179,176,0.15)]',
          glow: 'glow-red',
          textClass: 'text-red-400 font-bold',
          badgeText: 'CRITICAL',
          strokeColor: '#ffb3b0'
        };
      case 'secure':
        return {
          borderHover: 'hover:border-[#4de082]',
          borderNorm: 'border-[#334155]',
          glow: 'hover:shadow-[0_0_12px_rgba(77,224,130,0.15)]',
          textClass: 'text-[#4de082]',
          badgeText: 'Secure',
          strokeColor: '#4de082'
        };
      case 'locked':
        return {
          borderHover: 'hover:border-emerald-500',
          borderNorm: 'border-emerald-900/80 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
          glow: 'hover:shadow-[0_0_15px_rgba(16,185,129,0.25)]',
          textClass: 'text-emerald-400 font-bold',
          badgeText: 'SAFE-LOCK',
          strokeColor: '#10b981'
        };
    }
  };

  const colors = getStatusClasses(node.status);

  // Render proper icon based on icon identifier
  const renderIcon = () => {
    switch (node.icon) {
      case 'shield':
        return <Shield className="w-4 h-4 text-[#4de082]" />;
      case 'database':
        return <Database className="w-4 h-4 text-[#38BDF8]" />;
      case 'alert':
        return <AlertOctagon className="w-4 h-4 text-red-500 animate-pulse" />;
      case 'key':
        return <Key className="w-4 h-4 text-emerald-400" />;
      default:
        return <Shield className="w-4 h-4 text-[#4de082]" />;
    }
  };

  // Determine action button label and style
  const getActionBtnDetails = () => {
    switch (node.status) {
      case 'optimal':
        return {
          label: 'Sync Now',
          classes: 'bg-[#38BDF8] text-[#051424] hover:bg-white hover:text-black',
        };
      case 'updating':
        return {
          label: 'Initiate',
          classes: 'border border-[#38BDF8] text-[#38BDF8] hover:bg-[#38BDF8] hover:text-white',
        };
      case 'critical':
        return {
          label: 'Lockdown',
          classes: 'bg-red-600 text-white hover:bg-red-500 animate-pulse',
        };
      case 'locked':
        return {
          label: 'Unlock',
          classes: 'border border-emerald-400 text-emerald-400 hover:bg-emerald-500 hover:text-white',
        };
      case 'secure':
        return {
          label: 'Verify',
          classes: 'border border-[#4de082] text-[#4de082] hover:bg-[#4de082] hover:text-[#003919]',
        };
    }
  };

  const actionBtn = getActionBtnDetails();

  return (
    <motion.div
      layout
      whileHover={{ y: -3, boxShadow: `0 8px 30px rgba(0,0,0,0.4)` }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`bg-[#122131] rounded-[4px] p-4 flex flex-col justify-between border transition-colors duration-300 ${colors.borderNorm} ${colors.borderHover} ${colors.glow}`}
      id={`node-card-${node.id}`}
    >
      <div>
        {/* Node Index Metadata Block */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <h3 className="font-mono text-[12px] font-bold text-[#b9c7e4] uppercase tracking-wide">
              {node.id}: {node.name}
            </h3>
            <p className="text-[11px] font-mono mt-0.5 text-[#c5c6cd]">
              M_STATUS: <span className={colors.textClass}>{colors.badgeText}</span>
            </p>
          </div>
          <div className="p-1.5 bg-[#0a192f] border border-[#273647] rounded-sm">
            {renderIcon()}
          </div>
        </div>

        {/* Circular Gauge */}
        <div className="relative w-32 h-32 mx-auto mb-5 flex items-center justify-center" id={`gauge-${node.id}`}>
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Track Circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="#0d1c2d"
              strokeWidth="7"
              fill="transparent"
            />
            {/* Action Gauge Indicator Circle */}
            <motion.circle
              cx="64"
              cy="64"
              r={radius}
              stroke={colors.strokeColor}
              strokeWidth="7"
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute text-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={node.percentage}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="text-2xl font-mono font-bold block text-white tracking-tighter"
              >
                {node.percentage}%
              </motion.span>
            </AnimatePresence>
            <span className="text-[9px] uppercase font-mono tracking-wider text-[#c5c6cd]">
              {node.percentageLabel}
            </span>
          </div>
        </div>

        {/* Audit Progress Tracking bar */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-[10px] font-mono uppercase text-[#c5c6cd]">
            <span>{node.progressLabel}</span>
            <span className={colors.textClass}>{node.progress}%</span>
          </div>
          <div className="w-full bg-[#0d1c2d] h-1.5 rounded-full overflow-hidden border border-slate-900/30">
            <motion.div 
              className={`h-full ${node.status === 'critical' ? 'bg-red-500' : node.status === 'updating' ? 'bg-[#38BDF8]' : 'bg-[#4de082]'}`}
              initial={{ width: 0 }}
              animate={{ width: `${node.progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Manual switch details & Trigger action */}
      <div className="mt-2 pt-3 border-t border-[#334155]/60 flex items-center justify-between">
        
        {/* Toggle Indicator representing ports/state */}
        <div className="flex items-center gap-2">
          {node.status === 'critical' ? (
            <div className="flex items-center gap-1 text-[10px] font-mono text-red-400 uppercase animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>ALERT</span>
            </div>
          ) : node.status === 'locked' ? (
            <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 uppercase">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>ISOLATED</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              {/* Fake Toggle Button mimicking original agro toggle switch */}
              <button 
                type="button" 
                className={`w-7 h-4 rounded-full relative p-0.5 cursor-pointer transition-colors ${node.active ? 'bg-[#4de082]' : 'bg-slate-700'}`}
                title={node.active ? "Port Active" : "Port Offline"}
              >
                <span className={`block w-3 h-3 rounded-full bg-white transition-transform ${node.active ? 'translate-x-[11px]' : 'translate-x-0'}`} />
              </button>
              <span className="text-[9px] font-mono uppercase text-gray-400">
                {node.active ? 'Active' : 'Idle'}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <motion.button
          whileTap={{ scale: 0.93 }}
          whileHover={{ scale: 1.04 }}
          onClick={() => onActionClick(node.id)}
          disabled={isProcessing}
          className={`text-[10px] font-bold px-3 py-1.5 rounded-sm uppercase tracking-wide duration-200 transition-colors cursor-pointer ${actionBtn.classes} flex items-center gap-1 disabled:opacity-50`}
        >
          {isProcessing ? (
            <RefreshCw className="w-3 h-3 animate-spin" />
          ) : (
            node.status === 'locked' ? <Unlock className="w-3 h-3" /> : (node.status === 'critical' ? <Lock className="w-3 h-3" /> : null)
          )}
          <span>{actionBtn.label}</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
