import React, { useState, useEffect } from 'react';
import { PageId } from '../../types';
import { 
  Building2, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, 
  Users, CreditCard, Calendar, Zap, Star, Send, PlayCircle, BarChart3,
  Download, Image, ExternalLink, Globe
} from 'lucide-react';

import heroAdImg from '../../assets/images/spaceflow_hero_ad_1785866603406.jpg';
import roiAdImg from '../../assets/images/spaceflow_roi_ad_1785866615839.jpg';
import securityAdImg from '../../assets/images/spaceflow_security_ad_1785866626648.jpg';

interface PublicHomePageProps {
  isDarkMode: boolean;
  setCurrentPage: (page: PageId) => void;
}

export const PublicHomePage: React.FC<PublicHomePageProps> = ({ isDarkMode, setCurrentPage }) => {
  const [stats, setStats] = useState({
    activeSpaces: 18,
    coworkersActive: 142,
    occupancyPercent: 87,
    satisfactionRating: 4.9,
  });

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSent, setContactSent] = useState(false);
  const [activeBannerTab, setActiveBannerTab] = useState<'hero' | 'roi' | 'security'>('hero');
  const [selectedImageModal, setSelectedImageModal] = useState<string | null>(null);

  const cardBg = isDarkMode
    ? 'glass-card-purple text-slate-100 border-white/10 shadow-xl'
    : 'bg-white text-slate-900 border-slate-200/80 shadow-md';
  const subText = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const mainTitleText = isDarkMode ? 'text-slate-100' : 'text-slate-900';

  useEffect(() => {
    fetch('/api/public/stats')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setStats(data);
      })
      .catch(() => {});
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail) return;
    setContactSent(true);
    setContactName('');
    setContactEmail('');
    setContactMsg('');
    setTimeout(() => setContactSent(false), 5000);
  };

  const marketingBanners = [
    {
      id: 'hero' as const,
      titleEn: 'Anticipate Demand. Optimize Your Workspaces.',
      subtitleEn: 'Next-Generation AI-Powered Coworking Platform',
      descEn: 'Digital twins and Gemini AI for maximum occupancy, real-time booking, and reduced operating costs.',
      brand: 'SpaceFlow Pro',
      ctaEn: 'Book a Demo',
      img: heroAdImg,
      badge: 'MARKETING CAMPAIGN #1'
    },
    {
      id: 'roi' as const,
      titleEn: 'Reduce Workspace Operating Costs by 30%.',
      subtitleEn: 'Maximized ROI & Automated Billing',
      descEn: 'Transform cost centers into growth opportunities with automated Stripe billing, dynamic pricing, and occupancy analytics.',
      brand: 'SpaceFlow Pro',
      ctaEn: 'Calculate Your ROI',
      img: roiAdImg,
      badge: 'FINANCIAL CAMPAIGN #2'
    },
    {
      id: 'security' as const,
      titleEn: 'Secure Your Smart Office Infrastructure.',
      subtitleEn: 'Sovereign & Encrypted Access Control',
      descEn: 'Immutable security logs, global IoT fleet management, and end-to-end encrypted QR kiosk verification.',
      brand: 'SpaceFlow Pro',
      ctaEn: 'Explore Security Features',
      img: securityAdImg,
      badge: 'ENTERPRISE SECURITY #3'
    }
  ];

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <div className="relative py-12 lg:py-20 text-center space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>#1 AI-POWERED COWORKING MANAGEMENT SAAS</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-slate-100 leading-tight">
          MANAGE YOUR COWORKING SPACE IN{' '}
          <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
            1 CLICK
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
          Real-Time Bookings • Stripe Connect Automated Billing • AI Occupancy Analytics & Predictions
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="px-6 py-3.5 rounded-2xl btn-gradient-orange text-white font-extrabold text-sm flex items-center gap-2.5 shadow-xl shadow-orange-500/25 hover:scale-105 transition-all cursor-pointer"
          >
            <span>INTERACTIVE DEMO</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentPage('pricing')}
            className="px-6 py-3.5 rounded-2xl bg-white/10 text-slate-200 border border-white/10 hover:bg-white/20 font-extrabold text-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <PlayCircle className="w-4 h-4 text-amber-400" />
            <span>VIEW PRICING</span>
          </button>
        </div>

        {/* Live Metrics Counter Bar */}
        <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto font-mono text-center">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-2xl font-black text-orange-400">{stats.coworkersActive}</div>
            <div className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">ACTIVE MEMBERS</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-2xl font-black text-amber-400">{stats.occupancyPercent}%</div>
            <div className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">AVG OCCUPANCY</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-2xl font-black text-emerald-400">{stats.activeSpaces}</div>
            <div className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">MANAGED SPACES</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-2xl font-black text-purple-400 flex items-center justify-center gap-1">
              <span>{stats.satisfactionRating}</span>
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">CUSTOMER RATING</div>
          </div>
        </div>
      </div>

      {/* Official Marketing Ad Campaign Section (English Translated & Adapted Banners) */}
      <div className={`${cardBg} p-6 sm:p-8 rounded-3xl border space-y-6 shadow-2xl`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-[10px] font-bold uppercase tracking-wider mb-2">
              <Globe className="w-3.5 h-3.5" />
              <span>OFFICIAL ENGLISH MARKETING AD CAMPAIGNS</span>
            </div>
            <h2 className={`text-xl font-black uppercase tracking-tight flex items-center gap-2.5 ${mainTitleText}`}>
              <Image className="w-5 h-5 text-orange-500" />
              <span>SPACEFLOW BRANDING & AD BANNERS</span>
            </h2>
            <p className={`text-xs ${subText}`}>High-resolution adapted promotional banners for global marketing & campaign ads</p>
          </div>

          <div className="flex items-center gap-2">
            {marketingBanners.map((b) => (
              <button
                key={b.id}
                onClick={() => setActiveBannerTab(b.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  activeBannerTab === b.id
                    ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                    : isDarkMode
                    ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {b.id === 'hero' ? 'DEMAND & TWIN' : b.id === 'roi' ? '30% ROI SAVINGS' : 'ENTERPRISE ACCESS'}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Banner Showcase */}
        {(() => {
          const banner = marketingBanners.find(b => b.id === activeBannerTab) || marketingBanners[0];
          return (
            <div className="space-y-4">
              <div className="relative group overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-black/40">
                <img 
                  src={banner.img} 
                  alt={banner.titleEn}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex items-end justify-between">
                  <div className="text-white">
                    <span className="text-[10px] font-mono text-orange-400 font-bold uppercase tracking-widest">{banner.badge}</span>
                    <h4 className="font-bold text-sm sm:text-base">{banner.titleEn}</h4>
                  </div>
                  <button
                    onClick={() => setSelectedImageModal(banner.img)}
                    className="px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg hover:bg-orange-600 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>ENLARGE BANNER</span>
                  </button>
                </div>
              </div>

              {/* Banner Details & English Copy Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <span className={`text-[10px] font-bold ${subText}`}>BRAND IDENTIFIER</span>
                  <div className="font-black text-orange-500 text-sm mt-1">{banner.brand}</div>
                  <div className={`text-[10px] mt-0.5 ${subText}`}>Verified English Brand Name</div>
                </div>

                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <span className={`text-[10px] font-bold ${subText}`}>HEADLINE COPY (ENGLISH)</span>
                  <div className={`font-bold mt-1 text-slate-100 line-clamp-2`}>{banner.titleEn}</div>
                </div>

                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <span className={`text-[10px] font-bold ${subText}`}>CALL TO ACTION</span>
                  <div className="font-bold text-emerald-400 text-sm mt-1">{banner.ctaEn}</div>
                  <div className={`text-[10px] mt-0.5 ${subText}`}>Optimized Conversion Rate</div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* 3 Banners Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {marketingBanners.map((b) => (
            <div 
              key={b.id}
              onClick={() => setActiveBannerTab(b.id)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                activeBannerTab === b.id 
                  ? 'border-orange-500 bg-orange-500/10 shadow-lg' 
                  : isDarkMode ? 'border-white/10 bg-white/5 hover:border-white/20' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
              }`}
            >
              <img src={b.img} alt={b.titleEn} className="w-full h-28 object-cover rounded-xl mb-2" />
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-orange-400 font-mono">{b.badge}</span>
                <span className={`text-[10px] font-bold ${subText}`}>{b.brand}</span>
              </div>
              <h4 className={`text-xs font-bold mt-1 truncate ${mainTitleText}`}>{b.titleEn}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* Client Logos Row */}
      <div className="border-y border-white/10 py-6 text-center space-y-3">
        <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
          TRUSTED BY LEADING COWORKING & WORKSPACE OPERATORS GLOBALLY
        </span>
        <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400 font-black text-sm uppercase opacity-70">
          <span>• STATION F PARIS</span>
          <span>• TECHHUB LONDON</span>
          <span>• WEWORK PARTNER</span>
          <span>• MANTRA COWORKING</span>
          <span>• SILICON LOFT NY</span>
        </div>
      </div>

      {/* Main Features Grid */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-black uppercase text-slate-100">
            ALL-IN-ONE PLATFORM DESIGNED FOR OPERATORS
          </h2>
          <p className={`text-xs ${subText}`}>No more scattered Excel sheets or manual accounting tasks</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`${cardBg} p-6 rounded-2xl border space-y-3`}>
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-100">Real-Time Bookings</h3>
            <p className={`text-xs ${subText} leading-relaxed`}>
              Interactive schedule for meeting rooms and flex desks. Instant sync and QR code kiosk check-in validation.
            </p>
          </div>

          <div className={`${cardBg} p-6 rounded-2xl border space-y-3`}>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-100">Automated Stripe Billing</h3>
            <p className={`text-xs ${subText} leading-relaxed`}>
              Automated monthly subscriptions, tax invoice generation, Google Sheets sync, and dunning workflows.
            </p>
          </div>

          <div className={`${cardBg} p-6 rounded-2xl border space-y-3`}>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-100">AI Occupancy Optimization</h3>
            <p className={`text-xs ${subText} leading-relaxed`}>
              Gemini 2.5 Flash algorithm predicting traffic peaks and recommending optimal dynamic pricing.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className={`${cardBg} p-8 rounded-3xl border max-w-2xl mx-auto space-y-6 shadow-2xl`}>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-black uppercase text-slate-100 flex items-center justify-center gap-2">
            <Building2 className="w-5 h-5 text-orange-400" />
            <span>REQUEST A PERSONALIZED DEMO</span>
          </h3>
          <p className={`text-xs ${subText}`}>A SpaceFlow specialist will get back to you within 24 hours</p>
        </div>

        {contactSent ? (
          <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-300 text-center font-bold text-xs border border-emerald-500/30">
            ✅ Thank you! Your request has been registered. Our team will contact you shortly.
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1 text-slate-300">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Jane Smith"
                  className={`w-full p-3 rounded-xl border ${isDarkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'} focus:outline-none focus:border-orange-500`}
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-300">Work Email</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="jane@coworking-loft.com"
                  className={`w-full p-3 rounded-xl border ${isDarkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'} focus:outline-none focus:border-orange-500`}
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1 text-slate-300">Description of Your Workspace</label>
              <textarea
                rows={3}
                value={contactMsg}
                onChange={(e) => setContactMsg(e.target.value)}
                placeholder="Number of desks, meeting rooms, city location..."
                className={`w-full p-3 rounded-xl border ${isDarkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'} focus:outline-none focus:border-orange-500`}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl btn-gradient-orange text-white font-extrabold text-xs shadow-lg hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>GET MY FREE DEMO</span>
            </button>
          </form>
        )}
      </div>

      {/* Modal image viewer */}
      {selectedImageModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative max-w-5xl w-full">
            <button 
              onClick={() => setSelectedImageModal(null)}
              className="absolute -top-10 right-0 text-white font-black hover:text-orange-400 text-lg cursor-pointer"
            >
              ✕ CLOSE
            </button>
            <img src={selectedImageModal} alt="Enlarged Ad Banner" className="w-full h-auto rounded-2xl border border-white/20 shadow-2xl" />
          </div>
        </div>
      )}

    </div>
  );
};

