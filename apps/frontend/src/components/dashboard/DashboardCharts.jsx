import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { useLanguage } from '../../context/LanguageContext';

const TIME_SERIES = {
  '24h': [
    { time: '00:00', load: 380, emissions: 120 },
    { time: '04:00', load: 340, emissions: 110 },
    { time: '08:00', load: 620, emissions: 195 },
    { time: '12:00', load: 840, emissions: 240 },
    { time: '16:00', load: 790, emissions: 220 },
    { time: '20:00', load: 550, emissions: 150 },
    { time: '24:00', load: 410, emissions: 125 },
  ],
  '7d': [
    { time: 'Mon', load: 710, emissions: 200 },
    { time: 'Tue', load: 750, emissions: 215 },
    { time: 'Wed', load: 820, emissions: 235 },
    { time: 'Thu', load: 790, emissions: 220 },
    { time: 'Fri', load: 740, emissions: 210 },
    { time: 'Sat', load: 450, emissions: 130 },
    { time: 'Sun', load: 410, emissions: 120 },
  ],
  '30d': [
    { time: 'Week 1', load: 4800, emissions: 1400 },
    { time: 'Week 2', load: 5100, emissions: 1500 },
    { time: 'Week 3', load: 4950, emissions: 1450 },
    { time: 'Week 4', load: 4700, emissions: 1380 },
  ]
};

const TICKETS_DATA = [
  { name: 'HVAC', count: 12 },
  { name: 'Electrical', count: 8 },
  { name: 'Plumbing', count: 5 },
  { name: 'Lighting', count: 9 },
  { name: 'Safety', count: 2 },
];

export const DashboardCharts = ({ timeRange = '24h' }) => {
  const { language } = useLanguage();
  const data = TIME_SERIES[timeRange] || TIME_SERIES['24h'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* Energy Load & Carbon Emissions Chart */}
      <div className="lg:col-span-2 bg-[#0a0a0a] rounded-xl border border-[#333333] p-6 electric-gold-card relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f59e0b]/5 to-transparent pointer-events-none" />
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <h3 className="text-[#ededed] font-medium text-lg">
              {language === 'fr' ? 'Charge Énergétique & Émissions' : 'Energy Load & Carbon Emissions'}
            </h3>
            <p className="text-[#888888] text-sm mt-1">
              {language === 'fr' ? 'Analyse temporelle de la consommation (kW)' : 'Time series analysis (kW)'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#f59e0b]"></span>
              <span className="text-xs text-[#888888]">Load (kW)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#888888]"></span>
              <span className="text-xs text-[#888888]">CO2 (kg)</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#888888" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#888888" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#222222" vertical={false} />
              <XAxis dataKey="time" stroke="#666666" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#666666" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0a0a0a', 
                  borderColor: '#f59e0b',
                  borderRadius: '8px',
                  color: '#ededed'
                }}
                itemStyle={{ color: '#ededed' }}
              />
              <Area 
                type="monotone" 
                dataKey="emissions" 
                stroke="#888888" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorEmissions)" 
              />
              <Area 
                type="monotone" 
                dataKey="load" 
                stroke="#f59e0b" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorLoad)" 
                activeDot={{ r: 6, fill: '#f59e0b', stroke: '#000000', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Work Orders by Category */}
      <div className="lg:col-span-1 bg-[#0a0a0a] rounded-xl border border-[#333333] p-6 electric-gold-card relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#f59e0b]/5 to-transparent pointer-events-none" />
        
        <div className="mb-6 relative z-10">
          <h3 className="text-[#ededed] font-medium text-lg">
            {language === 'fr' ? 'Tickets par Catégorie' : 'Tickets by Category'}
          </h3>
          <p className="text-[#888888] text-sm mt-1">
            {language === 'fr' ? 'Interventions actives' : 'Active interventions'}
          </p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={TICKETS_DATA} layout="vertical" margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222222" horizontal={true} vertical={false} />
              <XAxis type="number" stroke="#666666" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: '#111111' }}
                contentStyle={{ 
                  backgroundColor: '#0a0a0a', 
                  borderColor: '#f59e0b',
                  borderRadius: '8px',
                  color: '#ededed'
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {TICKETS_DATA.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === 0 ? '#f59e0b' : '#333333'} 
                    className="hover:fill-[#fef08a] transition-colors duration-300"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
