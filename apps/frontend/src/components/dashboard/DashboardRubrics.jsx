import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lightbulb, Droplets, Recycle,
  Cpu, Wrench, Building2, Activity,
  Globe, Wind, Leaf, Bot,
  Layers, ScanFace,
  FileText, Link, ShieldCheck, Settings
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const PILLARS = [
  {
    id: 'operations',
    titleEn: '1. SMART UTILITIES',
    titleFr: '1. OPÉRATIONS & FLUIDES',
    items: [
      { id: 'lighting', labelEn: 'Energy & Lighting', labelFr: 'Énergie & Éclairage', icon: Lightbulb, to: '/lighting' },
      { id: 'water', labelEn: 'Water HydroSync', labelFr: 'Eau & HydroSync', icon: Droplets, to: '/water' },
      { id: 'waste', labelEn: 'Waste Management', labelFr: 'Gestion des Déchets', icon: Recycle, to: '/waste' },
    ]
  },
  {
    id: 'cmms',
    titleEn: '2. EAM & CMMS',
    titleFr: '2. GMAO & GESTION TECHNIQUE',
    items: [
      { id: 'assets', labelEn: 'Asset Topology', labelFr: 'Équipements & Parc', icon: Cpu, to: '/assets' },
      { id: 'work-orders', labelEn: 'Work Orders', labelFr: 'Ordres de Travail', icon: Wrench, to: '/work-orders' },
      { id: 'spaces', labelEn: 'Spaces & Desks', labelFr: 'Espaces & Occupation', icon: Building2, to: '/spaces' },
      { id: 'predictive', labelEn: 'Predictive Maintenance', labelFr: 'Maintenance Prédictive', icon: Activity, to: '/predictive-maintenance' },
    ]
  },
  {
    id: 'esg',
    titleEn: '3. CLIMATE STRATEGY & ESG',
    titleFr: '3. STRATÉGIE CLIMAT & ESG',
    items: [
      { id: 'impact', labelEn: 'ESG & Carbon CSRD', labelFr: 'Bilan Carbone & CSRD', icon: Leaf, to: '/impact' },
      { id: 'market', labelEn: 'Carbon Market', labelFr: 'Marché des Crédits', icon: Globe, to: '/market' },
      { id: 'air-quality', labelEn: 'Air Quality (AQI)', labelFr: 'Qualité de l\'Air (QAI)', icon: Wind, to: '/air-quality' },
      { id: 'energy', labelEn: 'Energy ESG Copilot', labelFr: 'Copilote IA ESG', icon: Bot, to: '/energy' },
    ]
  },
  {
    id: 'digital-twin',
    titleEn: '4. DIGITAL TWIN & SPATIAL',
    titleFr: '4. JUMEAU NUMÉRIQUE & BIM',
    items: [
      { id: 'bim', labelEn: 'BIM & 3D Viewer', labelFr: 'Visionneuse 3D BIM', icon: Layers, to: '/bim' },
      { id: 'digital-twin', labelEn: 'Interactive Digital Twin', labelFr: 'Jumeau Numérique', icon: ScanFace, to: '/digital-twin' },
    ]
  },
  {
    id: 'governance',
    titleEn: '5. GOVERNANCE & CONNECTIVITY',
    titleFr: '5. CONNECTIVITÉ & GOUVERNANCE',
    items: [
      { id: 'tenants', labelEn: 'Tenants & Leases', labelFr: 'Baux & Locataires', icon: FileText, to: '/tenants' },
      { id: 'erp', labelEn: 'ERP Integration', labelFr: 'Intégrations ERP', icon: Link, to: '/erp' },
      { id: 'security', labelEn: 'Security & Access', labelFr: 'Sécurité & Accès', icon: ShieldCheck, to: '/security' },
      { id: 'settings', labelEn: 'System Configuration', labelFr: 'Configuration Système', icon: Settings, to: '/settings' },
    ]
  }
];

export const DashboardRubrics = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {PILLARS.map((pillar) => (
        <div key={pillar.id} className="space-y-4">
          <h3 className="text-sm font-semibold text-[#f59e0b] tracking-wider uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse"></span>
            {language === 'fr' ? pillar.titleFr : pillar.titleEn}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pillar.items.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.to)}
                className="group relative bg-[#0a0a0a] hover:bg-[#111111] border border-[#333333] hover:border-[#f59e0b] rounded-xl p-5 flex flex-col items-start gap-4 transition-all duration-300 overflow-hidden text-left"
              >
                {/* Effet lumineux de fond au hover */}
                <div className="absolute inset-0 bg-[#f59e0b]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                
                <div className="p-3 bg-[#111111] group-hover:bg-[#f59e0b]/10 rounded-lg border border-[#222222] group-hover:border-[#f59e0b]/50 transition-colors duration-300 relative z-10">
                  <item.icon className="w-6 h-6 text-[#ededed] group-hover:text-[#f59e0b] transition-colors duration-300" />
                </div>
                
                <div className="text-left relative z-10">
                  <h4 className="text-[#ededed] font-medium text-sm group-hover:text-[#fef08a] transition-colors duration-300">
                    {language === 'fr' ? item.labelFr : item.labelEn}
                  </h4>
                </div>

                {/* Petite flèche en bas à droite */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#f59e0b]">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardRubrics;
