import { Link } from 'react-router-dom';
import ParticleMap from './ParticleMap';

export default function AuthLayout({
  children,
  signupLink = '/signup',
  showSignup = true,
  legalText,
  marketingTag = 'BEECARBONAT CONNECT 2026',
  marketingHeadline = "Là où les bâtisseurs d'infrastructures se connectent.",
  marketingMeta = 'Disponible partout · Multi-site · Sans frais additionnels',
  marketingCtaText = 'Inscrivez-vous maintenant',
  marketingCtaHref = '/signup'
}) {
  return (
    <div className="auth-page">
      {/* COLONNE GAUCHE — Formulaire */}
      <div className="auth-page-form">
        <div className="auth-form-header">
          <Link to="/" className="auth-logo" aria-label="BEECARBONAT">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="var(--brand-orange, #f38020)" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
            </svg>
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
      <div className="auth-page-marketing">
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
