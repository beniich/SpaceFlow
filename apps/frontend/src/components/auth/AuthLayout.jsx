import { Link } from 'react-router-dom';
import BeeCarbonitLogo from '../BeeCarbonitLogo';

export default function AuthLayout({
  children,
  legalText,
  marketingHeadline = "Where Facility Managers Connect",
  marketingMeta = 'Unleash the power of CAFM PRO by BeeCarbonat. Manage assets, optimize space, and connect your facilities to the future.',
  marketingCtaText = 'Explore Features',
  marketingCtaHref = '/'
}) {
  return (
    <div className="auth-page min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#121519] font-sans antialiased selection:bg-brand-orange selection:text-white">
      {/* COLONNE GAUCHE — Formulaire CAFM PRO */}
      <div className="auth-page-form bg-[#121519] text-white p-6 sm:p-12 lg:p-16 flex flex-col justify-between min-h-screen relative z-10">
        <div className="auth-form-header">
          <Link to="/" className="inline-flex flex-col select-none no-underline group">
            <BeeCarbonitLogo size={42} showText={true} />
          </Link>
        </div>

        <div className="auth-form-body w-full max-w-[420px] mx-auto py-8">
          {children}
        </div>

        {legalText ? (
          <div className="auth-legal w-full max-w-[420px] mx-auto text-center text-xs text-zinc-500 pb-2">
            {legalText}
          </div>
        ) : (
          <div className="w-full max-w-[420px] mx-auto text-center text-xs text-zinc-500 pb-2">
            By continuing, you agree to our <Link to="/terms" className="text-zinc-300 hover:text-white underline">Terms</Link> and{' '}
            <Link to="/privacy" className="text-zinc-300 hover:text-white underline">Privacy Policy</Link>.
          </div>
        )}
      </div>

      {/* COLONNE DROITE — Visual Hero avec Arrière-Plan Architectural Cyber */}
      <div className="auth-page-marketing hidden lg:flex flex-col justify-center relative overflow-hidden bg-[#ff5500] p-12 xl:p-20 text-white select-none">
        {/* Background Image Layer */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: "url('/images/cafm_hero_bg.jpg')",
            backgroundPosition: 'center 40%',
            filter: 'contrast(1.05) saturate(1.1)'
          }}
        />

        {/* Ambient Vibrant Orange Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#e64a00]/80 via-transparent to-[#ff7700]/60 z-[1] mix-blend-multiply" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#ff5500]/20 to-[#cc3d00]/70 z-[1]" />

        {/* High-Tech Vector Circuit & Grid Accents */}
        <div className="absolute inset-0 pointer-events-none z-[2] opacity-40">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="auth-grid-dots" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="16" cy="16" r="1" fill="#ffffff" fillOpacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#auth-grid-dots)" />
          </svg>
        </div>

        {/* Contenu Marketing Central — Aligné avec le Design Référence */}
        <div className="relative z-10 max-w-xl">
          <h2 className="text-4xl xl:text-5xl 2xl:text-6xl font-black tracking-tight text-white leading-[1.08] mb-6 drop-shadow-md">
            {marketingHeadline}
          </h2>

          {marketingMeta && (
            <p className="text-base xl:text-lg text-white/95 leading-relaxed font-normal mb-8 max-w-lg drop-shadow-sm">
              {marketingMeta}
            </p>
          )}

          <div>
            <Link 
              to={marketingCtaHref}
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              {marketingCtaText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

