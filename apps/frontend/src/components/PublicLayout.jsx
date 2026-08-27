import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BeeCarbonatLogo from './BeeCarbonatLogo';

export default function PublicLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-brand-orange selection:text-white">
      {/* Public Header */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="sticky top-0 z-50 p-4"
      >
        <header className="max-w-6xl mx-auto bg-surface/80 backdrop-blur-xl border border-border/60 rounded-full h-14 px-6 flex items-center justify-between shadow-sm">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <BeeCarbonatLogo size={28} showText={true} />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 font-mono text-[10px] uppercase tracking-[0.15em] font-semibold">
            {[
              { path: '/about', label: 'About & Roots' },
              { path: '/market', label: 'Carbon Market' },
              { path: '/case-studies', label: 'Success Stories' },
              { path: '/impact', label: 'Impact Report' }
            ].map((tab) => {
              const isActive = location.pathname === tab.path;
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`transition-all py-1.5 px-3 rounded-full ${
                    isActive 
                      ? 'bg-foreground text-background font-bold' 
                      : 'text-muted-foreground hover:text-brand-orange'
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>

          {/* Call-to-actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-[11px] font-mono font-bold tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-[11px] font-mono font-bold tracking-wider uppercase bg-foreground text-background px-5 py-2 rounded-full hover:bg-brand-orange hover:text-white transition-all shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </header>
      </motion.div>

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Public Footer */}
      <footer className="w-full bg-[#131313] border-t border-border/60 mt-16 py-12 font-sans text-zinc-300">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <BeeCarbonatLogo size={32} showText={true} />
            <p className="text-sm text-zinc-400 max-w-xs">
              Pioneering sovereign smart facility ecosystems through zero-emission engineering.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-300 mb-6">Platform</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><Link to="/about" className="hover:text-brand-orange transition-colors">About Us</Link></li>
              <li><Link to="/market" className="hover:text-brand-orange transition-colors">Carbon Market</Link></li>
              <li><Link to="/case-studies" className="hover:text-brand-orange transition-colors">Case Studies</Link></li>
              <li><Link to="/impact" className="hover:text-brand-orange transition-colors">Impact Report</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-300 mb-6">Legal</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><Link to="#" className="hover:text-brand-orange transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-brand-orange transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-brand-orange transition-colors">Security</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-300 mb-6">Connect</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><a href="mailto:contact@beecarbonat.com" className="hover:text-brand-orange transition-colors">contact@beecarbonat.com</a></li>
              <li><Link to="/partner-portal" className="hover:text-brand-orange transition-colors">Partner Portal</Link></li>
              <li><Link to="/careers" className="hover:text-brand-orange transition-colors">Careers</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-zinc-800 text-xs text-zinc-600 flex flex-col md:flex-row items-center justify-between">
          <p>© {new Date().getFullYear()} BeeCarbonat PRO. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> All systems nominal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
