import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { TrendingUp, FileDown, Plus, Globe, ShieldCheck, AlertTriangle, Layers } from 'lucide-react';
import { KPI, Audit, AuditTemplate } from '../types';
import { computeComplianceScore } from '../lib/scoreEngine';
import { computeGlobalKPIs, getScoreTrend } from '../lib/kpiEngine';
import { RiskHeatmap } from './RiskHeatmap';
import { exportDashboardToPDF } from '../lib/pdfExport';
import { InfrastructureService, NodeStats } from '../services/InfrastructureService';

const StatCard = ({ title, value, detail, icon: Icon, color }: any) => (
  // ... StatCard implementation ...
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
        <Icon size={20} className={color} />
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</span>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{value}</h3>
      </div>
    </div>
    <div className="flex items-center gap-1 mt-2">
      <TrendingUp size={12} className="text-emerald-500" />
      <span className="text-[10px] font-medium text-emerald-600">{detail} vs Q3</span>
    </div>
  </motion.div>
);

export const Dashboard = ({ audits, templates }: { audits: Audit[], templates: AuditTemplate[] }) => {
  const [isExporting, setIsExporting] = useState(false);

  const { data: nodeStats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => InfrastructureService.getStats(),
  });

  
  const complianceKpi = computeGlobalKPIs(audits, templates).find(k => k.title.includes('Conformité'))?.value || '0%';
  const riskKpi = computeGlobalKPIs(audits, templates).find(k => k.title.includes('Risques'))?.value || '0';

  return (
    <div className="flex flex-col gap-10" id="dashboard-content">
      {/* ... Header Executive omitted for brevity ... */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-bold uppercase">Enterprise Suite v4.5</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-tighter">Site: Global Jurisdiction Monitoring</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Executive Risk Overview</h2>
          <p className="text-slate-500 text-sm mt-1">Real-time predictive integrity and compliance trajectory across global assets.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={async () => {
              setIsExporting(true);
              await exportDashboardToPDF('dashboard-content');
              setIsExporting(false);
            }}
            disabled={isExporting}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-50 uppercase tracking-widest transition-all shadow-sm"
          >
            <FileDown size={16} /> {isExporting ? 'Generating...' : 'Export Intelligence'}
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg text-[10px] font-bold hover:bg-blue-700 uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20">
            <Plus size={16} /> New Asset Scan
          </button>
        </div>
      </div>

      {/* Strategic KPIs - Inspired by audit_remediation_workflow */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Compliance Factor" 
          value={complianceKpi} 
          detail="+2.4%" 
          icon={ShieldCheck} 
          color="text-blue-600" 
        />
        <StatCard 
          title="Threat Score" 
          value={riskKpi} 
          detail="-0.8%" 
          icon={AlertTriangle} 
          color="text-red-500" 
        />
        <StatCard 
          title="Verification Vault" 
          value={`${audits.length} Audits`} 
          detail="+12" 
          icon={Layers} 
          color="text-emerald-500" 
        />
        <StatCard 
          title="Network Nodes" 
          value={`${nodeStats?.total || 0} Nodes`} 
          detail={`${nodeStats?.healthy || 0} Healthy`} 
          icon={Globe} 
          color="text-slate-400" 
        />
      </div>


      {/* Main Grid Content */}
      <div className="grid grid-cols-12 gap-8">
        {/* Heatmap Section */}
        <div className="col-span-12 lg:col-span-8">
          <RiskHeatmap />
        </div>

        {/* Audit Queue - Simplified List */}
        <div className="col-span-12 lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Active Mission Log</h3>
             <span className="text-[10px] text-blue-600 font-bold cursor-pointer hover:underline uppercase">View Board</span>
          </div>
          
          <div className="flex-1 space-y-4">
            {audits.map((audit) => {
              const template = templates.find(t => t.id === audit.templateId);
              const score = template ? computeComplianceScore(audit, template) : 0;
              return (
                <div key={audit.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg group hover:border-blue-300 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-[9px] text-blue-600 font-bold">#{audit.id.split('-').pop()?.toUpperCase()}</span>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${
                      audit.status === 'DRAFT' ? 'bg-slate-200 text-slate-600' :
                      audit.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {audit.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">{audit.entityId}</h4>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-1 rounded-full overflow-hidden mr-4">
                       <div className={`h-full ${score > 80 ? 'bg-emerald-500' : score > 50 ? 'bg-blue-500' : 'bg-red-500'}`} style={{ width: `${score}%` }}></div>
                    </div>
                    <span className="text-[10px] font-black text-slate-800 dark:text-slate-300">{score}%</span>
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
