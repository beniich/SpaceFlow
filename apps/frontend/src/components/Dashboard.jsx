import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Building2, Activity, Zap, CheckCircle2, 
  AlertTriangle, Filter, ChevronDown
} from 'lucide-react';
import DashboardRubrics from './dashboard/DashboardRubrics';
import DashboardCharts from './dashboard/DashboardCharts';

// Mock KPI Data
const KPI_METRICS = {
  health: { value: '98%', trend: '+2.4%', status: 'optimal', title: 'System Health' },
  workOrders: { value: '142', trend: '-12', status: 'warning', title: 'Active Tickets' },
  energy: { value: '412 kW', trend: '-8.5%', status: 'optimal', title: 'Energy Load' },
  alerts: { value: '3', trend: '0', status: 'critical', title: 'Critical Alerts' }
};

export const Dashboard = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('rubrics');
  const [selectedBuilding, setSelectedBuilding] = useState('hq-paris');
  const [timeRange, setTimeRange] = useState('24h');

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8 animate-fade-in text-[#ededed]">
      
      {/* 1. Header & Context Selectors */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#ededed]">
            {language === 'fr' ? 'Cockpit Exécutif' : 'Executive Cockpit'}
          </h1>
          <p className="text-[#888888] mt-1">
            {language === 'fr' ? 'Supervision globale de l\'infrastructure' : 'Global infrastructure supervision'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Building Selector */}
          <div className="relative">
            <select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              className="appearance-none bg-[#0a0a0a] border border-[#333333] hover:border-[#f59e0b] text-[#ededed] text-sm rounded-lg pl-10 pr-10 py-2.5 outline-none transition-colors duration-300 cursor-pointer"
            >
              <option value="hq-paris">Paris HQ - Alpha Tower</option>
              <option value="lyon-hub">Lyon Hub - Beta Center</option>
              <option value="all">Global Portfolio (All)</option>
            </select>
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888] pointer-events-none" />
          </div>

          {/* Time Range Selector */}
          <div className="bg-[#0a0a0a] border border-[#333333] rounded-lg p-1 flex items-center">
            {['24h', '7d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-300 ${
                  timeRange === range 
                    ? 'bg-[#1a1a1a] text-[#f59e0b] shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                    : 'text-[#888888] hover:text-[#ededed]'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. KPI Hero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* System Health */}
        <div className="bg-[#0a0a0a] border border-[#333333] hover:border-[#f59e0b] p-6 rounded-xl flex flex-col justify-between electric-gold-card group transition-all duration-300">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-[#111111] rounded-lg border border-[#222222] group-hover:border-[#f59e0b]/30">
              <Activity className="w-5 h-5 text-[#f59e0b]" />
            </div>
            <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              {KPI_METRICS.health.trend}
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-[#888888] text-sm">{KPI_METRICS.health.title}</h3>
            <div className="text-3xl font-bold mt-1 text-[#ededed]">{KPI_METRICS.health.value}</div>
          </div>
        </div>

        {/* Work Orders */}
        <div className="bg-[#0a0a0a] border border-[#333333] hover:border-[#f59e0b] p-6 rounded-xl flex flex-col justify-between electric-gold-card group transition-all duration-300">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-[#111111] rounded-lg border border-[#222222] group-hover:border-[#f59e0b]/30">
              <CheckCircle2 className="w-5 h-5 text-[#f59e0b]" />
            </div>
            <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              {KPI_METRICS.workOrders.trend}
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-[#888888] text-sm">{KPI_METRICS.workOrders.title}</h3>
            <div className="text-3xl font-bold mt-1 text-[#ededed]">{KPI_METRICS.workOrders.value}</div>
          </div>
        </div>

        {/* Energy Load */}
        <div className="bg-[#0a0a0a] border border-[#333333] hover:border-[#f59e0b] p-6 rounded-xl flex flex-col justify-between electric-gold-card group transition-all duration-300">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-[#111111] rounded-lg border border-[#222222] group-hover:border-[#f59e0b]/30">
              <Zap className="w-5 h-5 text-[#f59e0b]" />
            </div>
            <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              {KPI_METRICS.energy.trend}
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-[#888888] text-sm">{KPI_METRICS.energy.title}</h3>
            <div className="text-3xl font-bold mt-1 text-[#ededed]">{KPI_METRICS.energy.value}</div>
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="bg-[#0a0a0a] border border-[#f59e0b]/30 hover:border-[#f59e0b] p-6 rounded-xl flex flex-col justify-between electric-gold-card group transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#f59e0b]"></div>
          <div className="absolute inset-0 bg-[#f59e0b]/5"></div>
          <div className="flex items-start justify-between relative z-10">
            <div className="p-3 bg-[#f59e0b]/10 rounded-lg border border-[#f59e0b]/30">
              <AlertTriangle className="w-5 h-5 text-[#f59e0b]" />
            </div>
            <span className="text-xs font-medium text-[#f59e0b] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse"></span>
              LIVE
            </span>
          </div>
          <div className="mt-4 relative z-10">
            <h3 className="text-[#888888] text-sm">{KPI_METRICS.alerts.title}</h3>
            <div className="text-3xl font-bold mt-1 text-[#f59e0b]">{KPI_METRICS.alerts.value}</div>
          </div>
        </div>

      </div>

      {/* 3. Main Content Switcher (Tabs) */}
      <div className="bg-[#0a0a0a] border-b border-[#333333] sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('rubrics')}
            className={`pb-4 text-sm font-medium transition-all relative ${
              activeTab === 'rubrics' 
                ? 'text-[#f59e0b]' 
                : 'text-[#888888] hover:text-[#ededed]'
            }`}
          >
            {language === 'fr' ? 'Rubriques & Piliers' : 'Operational Rubrics'}
            {activeTab === 'rubrics' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f59e0b] shadow-[0_-2px_10px_rgba(245,158,11,0.5)]"></div>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-4 text-sm font-medium transition-all relative ${
              activeTab === 'analytics' 
                ? 'text-[#f59e0b]' 
                : 'text-[#888888] hover:text-[#ededed]'
            }`}
          >
            {language === 'fr' ? 'Analytique & Télémétrie' : 'Analytics & Telemetry'}
            {activeTab === 'analytics' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f59e0b] shadow-[0_-2px_10px_rgba(245,158,11,0.5)]"></div>
            )}
          </button>
        </div>
      </div>

      {/* 4. Tab Content */}
      <div className="pt-2">
        {activeTab === 'rubrics' ? (
          <DashboardRubrics />
        ) : (
          <DashboardCharts timeRange={timeRange} />
        )}
      </div>

    </div>
  );
};

export default Dashboard;
