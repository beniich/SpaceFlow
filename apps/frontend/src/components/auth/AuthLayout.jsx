import { Link } from 'react-router-dom';
import ParticleMap from './ParticleMap';

export default function AuthLayout({
  children,
  signupLink = '/signup',
  showSignup = true,
  legalText,
  marketingTag = 'CAFM PRO by Carbonit',
  marketingHeadline = "Where Facility Managers Connect",
  marketingMeta = 'Unleash the power of CAFM PRO by Carbonit. Manage assets, optimize space, and connect your facilities to the future.',
  marketingCtaText = 'Explore Features',
  marketingCtaHref = '/'
}) {
  return (
    <div className="auth-page">
      {/* COLONNE GAUCHE — Formulaire */}
      <div className="auth-page-form">
        <div className="auth-form-header">
          <Link to="/" className="flex flex-col select-none no-underline group">
            <div className="flex items-center gap-1.5">
              <span className="font-sans font-black text-2xl tracking-tight text-white uppercase">CAFM</span>
              <span className="font-sans font-black text-2xl tracking-tight text-brand-orange uppercase">PRO</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 font-semibold uppercase tracking-wider -mt-1.5 group-hover:text-brand-cyan transition-colors">by Carbonit</span>
          </Link>
        </div>

        <div className="auth-form-body">
          {children}
        </div>

        {legalText && (
          <div className="auth-legal">
            {legalText}
          </div>
        )}
      </div>

      {/* COLONNE DROITE — Marketing (Style Cloudflare) */}
      <div className="auth-page-marketing" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Giant Glowing Skyscraper Schematic Blueprint Backdrop */}
        <div className="absolute inset-0 opacity-15 pointer-events-none z-0 flex items-center justify-center">
          <svg width="100%" height="100%" viewBox="0 0 800 800" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Massive skyscraper circuits */}
            <path d="M400 80 L520 180 L520 450 L400 370 Z" strokeWidth="2" />
            <path d="M400 80 L280 180 L280 450 L400 370 Z" strokeWidth="2" />
            <path d="M400 370 L400 680" strokeWidth="2" />
            
            {/* Side expansions */}
            <path d="M280 220 L180 280 L180 550 L280 490 Z" />
            <path d="M520 220 L620 280 L620 550 L520 490 Z" />
            
            {/* Ground circuitry traces */}
            <path d="M400 680 L400 750 L100 750 L50 800" />
            <path d="M400 680 L400 750 L700 750 L750 800" />
            <path d="M180 550 L120 590 L120 700 L50 700" />
            <path d="M620 550 L680 590 L680 700 L750 700" />
            
            {/* Hexagonal nodes and points */}
            <polygon points="400,60 415,70 415,90 400,100 385,90 385,70" fill="#ffffff" />
            <circle cx="280" cy="180" r="5" fill="#ffffff" />
            <circle cx="520" cy="180" r="5" fill="#ffffff" />
            <circle cx="400" cy="370" r="5" fill="#ffffff" />
            <circle cx="180" cy="280" r="4" fill="#ffffff" />
            <circle cx="620" cy="280" r="4" fill="#ffffff" />
            <circle cx="180" cy="550" r="4" fill="#ffffff" />
            <circle cx="620" cy="550" r="4" fill="#ffffff" />
            
            {/* Extra PCB nodes */}
            <circle cx="120" cy="700" r="3" fill="#ffffff" />
            <circle cx="680" cy="700" r="3" fill="#ffffff" />
            <circle cx="100" cy="750" r="3" fill="#ffffff" />
            <circle cx="700" cy="750" r="3" fill="#ffffff" />
          </svg>
        </div>

        {/* En-tête avec switch langue et bouton d'action */}
        <div className="auth-marketing-header" style={{ position: 'absolute', top: 32, right: 32, display: 'flex', gap: 16, alignItems: 'center', zIndex: 10 }}>
          <button className="auth-lang-switch" type="button" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: '#1a1a1a', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
            <span style={{ fontSize: '15px' }}>🌐</span>
            <span>Français</span>
            <span style={{ fontSize: '10px' }}>▼</span>
          </button>
          {showSignup && (
            <Link 
              to={signupLink} 
              className="auth-signup-link-dark" 
              style={{ 
                background: '#1a1a1a', 
                color: '#fff', 
                padding: '8px 20px', 
                borderRadius: '6px', 
                textDecoration: 'none', 
                fontSize: '14px', 
                fontWeight: 600,
                border: '1px solid #1a1a1a',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#2c2c2c'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#1a1a1a'}
            >
              {signupLink === '/login' ? 'Se connecter' : "S'inscrire"}
            </Link>
          )}
        </div>

        <ParticleMap />

        <div className="auth-marketing-content" style={{ marginTop: 'auto', marginBottom: 'auto', position: 'relative', zIndex: 2 }}>
          <div className="auth-marketing-tag" style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'monospace', color: '#1a1a1a', opacity: 0.8, marginBottom: '16px' }}>
            {marketingTag}
          </div>

          <div className="auth-marketing-headline" style={{ fontSize: '48px', fontWeight: 800, lineHeight: '1.1', color: '#1a1a1a', marginBottom: '24px', letterSpacing: '-1px' }}>
            {marketingHeadline}
          </div>

          {marketingMeta && (
            <div className="auth-marketing-meta" style={{ fontSize: '16px', color: '#1a1a1a', opacity: 0.8, marginBottom: '32px' }}>
              {marketingMeta}
            </div>
          )}

          <Link 
            to={marketingCtaHref} 
            className="auth-marketing-cta"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 28px',
              background: '#1a1a1a',
              color: '#fff',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '14px',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
          >
            <span>{marketingCtaText}</span>
            <span style={{ fontSize: '16px' }}>↗</span>
          </Link>
        </div>

        <div className="auth-marketing-footer" style={{ zIndex: 2 }}>
          <span>© 2026 BEECARBONAT</span>
          <span>Une plateforme ℅ minimal</span>
        </div>
      </div>
    </div>
  );
}
