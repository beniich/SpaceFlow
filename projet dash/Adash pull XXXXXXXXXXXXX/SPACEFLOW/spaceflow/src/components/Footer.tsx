import React from 'react';
import { PageId, Language, BrandVariant } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { ShieldCheck, Activity } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId) => void;
  language: Language;
  brand: BrandVariant;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, language: propLang, brand }) => {
  const { t, language } = useTranslation(propLang);
  const descriptions: Record<Language, string> = {
    FR: "Gestion des Installations Assistée par Ordinateur & Infrastructure Cyber-Souveraine. Protection d'actifs intelligents et analyse IA prédictive.",
    EN: 'Computer-Aided Facility Management & Sovereign Cyber Infrastructure. Next-generation smart asset protection & AI predictive analytics.',
    DE: 'Computergestütztes Gebäudemanagement & Souveräne Cyber-Infrastruktur. Schutz intelligenter Anlagen & KI-Analysen.',
    ES: 'Gestión de Instalaciones Asistida por Ordenador e Infraestructura Ciber-Soberana. Protección de activos e inteligencia IA.',
  };

  const navLinks: Record<Language, { label: string; page: PageId }[]> = {
    FR: [
      { label: 'Solutions & Vue d’ensemble', page: 'home' },
      { label: 'Architecture Système', page: 'architecture' },
      { label: 'Tarifs & Forfaits SaaS', page: 'pricing' },
      { label: 'Sécurité & ISO 27001', page: 'security' },
    ],
    EN: [
      { label: 'Solutions & Overview', page: 'home' },
      { label: 'System Architecture', page: 'architecture' },
      { label: 'Pricing & SaaS Plans', page: 'pricing' },
      { label: 'Security & ISO 27001', page: 'security' },
    ],
    DE: [
      { label: 'Lösungen & Übersicht', page: 'home' },
      { label: 'Systemarchitektur', page: 'architecture' },
      { label: 'Preise & SaaS-Pläne', page: 'pricing' },
      { label: 'Sicherheit & ISO 27001', page: 'security' },
    ],
    ES: [
      { label: 'Soluciones y Visión General', page: 'home' },
      { label: 'Arquitectura del Sistema', page: 'architecture' },
      { label: 'Precios y Planes SaaS', page: 'pricing' },
      { label: 'Seguridad e ISO 27001', page: 'security' },
    ],
  };

  const resourceLinks: Record<Language, { label: string; page: PageId }[]> = {
    FR: [
      { label: 'Centre d’Aide & Support', page: 'support' },
      { label: 'Réserver une Démo', page: 'demo' },
      { label: 'Actualités & Sécurité', page: 'blog' },
      { label: 'Changelog Produit v2.0', page: 'changelog' },
    ],
    EN: [
      { label: 'Support & Help Center', page: 'support' },
      { label: 'Book a Product Demo', page: 'demo' },
      { label: 'Security Insights & News', page: 'blog' },
      { label: 'Product Changelog v2.0', page: 'changelog' },
    ],
    DE: [
      { label: 'Support & Hilfe-Center', page: 'support' },
      { label: 'Produkt-Demo Buchen', page: 'demo' },
      { label: 'Sicherheitseinblicke & News', page: 'blog' },
      { label: 'Produkt-Changelog v2.0', page: 'changelog' },
    ],
    ES: [
      { label: 'Centro de Soporte y Ayuda', page: 'support' },
      { label: 'Reservar una Demostración', page: 'demo' },
      { label: 'Noticias y Seguridad', page: 'blog' },
      { label: 'Historial de Cambios v2.0', page: 'changelog' },
    ],
  };

  return (
    <footer className="relative z-10 w-full mt-20 border-t border-white/10 bg-[#0a0318]/90 backdrop-blur-md py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-sm">
        
        {/* Brand Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 btn-gradient-orange rounded-lg flex items-center justify-center text-white glow-orange-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-white tracking-wider">{brand}</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed font-light">
            {descriptions[language]}
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full w-fit">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>{t('footerOperational', language)}</span>
          </div>
        </div>

        {/* Navigation Quick Links */}
        <div>
          <h4 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest mb-3">
            {t('footerNav', language)}
          </h4>
          <ul className="space-y-2 text-xs text-gray-300">
            {navLinks[language].map((item, idx) => (
              <li key={idx}>
                <button onClick={() => onNavigate(item.page)} className="hover:text-orange-400 transition-colors cursor-pointer">
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources & Support */}
        <div>
          <h4 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest mb-3">
            {t('footerResources', language)}
          </h4>
          <ul className="space-y-2 text-xs text-gray-300">
            {resourceLinks[language].map((item, idx) => (
              <li key={idx}>
                <button onClick={() => onNavigate(item.page)} className="hover:text-orange-400 transition-colors cursor-pointer">
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h4 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest mb-3">
            {t('footerContact', language)}
          </h4>
          <p className="text-xs text-gray-400 mb-2">123 Sovereign Blvd, Tech City, TC 54321</p>
          <p className="text-xs text-gray-300 mb-2 font-mono">support@sovereigndevice.com</p>
          <p className="text-xs text-gray-300 font-mono">+1 (555) 123-4567</p>
          <button
            onClick={() => onNavigate('contact')}
            className="mt-4 text-xs font-bold text-orange-400 hover:text-orange-300 underline underline-offset-4 cursor-pointer"
          >
            {t('contactExpert', language)} →
          </button>
        </div>
      </div>

      {/* Sub Footer Bottom Bar */}
      <div className="max-w-7xl mx-auto border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <div>© 2026 {brand}. {t('footerRights', language)}</div>
        <div className="flex gap-6">
          <button onClick={() => onNavigate('security')} className="hover:text-gray-300 cursor-pointer">
            Privacy Policy
          </button>
          <button onClick={() => onNavigate('security')} className="hover:text-gray-300 cursor-pointer">
            Terms of Service
          </button>
          <button onClick={() => onNavigate('contact')} className="hover:text-gray-300 cursor-pointer">
            GDPR Compliance
          </button>
        </div>
      </div>
    </footer>
  );
};
