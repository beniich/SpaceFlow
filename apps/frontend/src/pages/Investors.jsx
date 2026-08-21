import React from 'react';
import { motion } from 'framer-motion';

export default function Investors() {
  return (
    <div className="min-h-screen bg-brand-obsidian text-zinc-100 font-sans relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-brand-obsidian/90 backdrop-blur-3xl" />
        
        {/* Lightning / Electric effect */}
        <div className="absolute top-1/3 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-30 shadow-[0_0_15px_rgba(243,128,32,0.8)]" />
        <div className="absolute top-1/3 left-1/4 w-[1px] h-[50px] bg-orange-500 opacity-40 shadow-[0_0_15px_rgba(243,128,32,0.8)] transform -translate-y-full rotate-45" />
        <div className="absolute top-1/3 right-1/4 w-[1px] h-[40px] bg-orange-500 opacity-40 shadow-[0_0_15px_rgba(243,128,32,0.8)] transform -translate-y-full -rotate-45" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 text-brand-primary">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <span className="text-2xl font-bold tracking-tight">BeeCarbonit</span>
        </div>
        <div className="hidden md:flex gap-8 font-medium">
          <a href="/" className="hover:text-brand-primary transition-colors">Home</a>
          <a href="#" className="hover:text-brand-primary transition-colors">About Us</a>
          <a href="/investors" className="text-brand-cyan">Investors</a>
          <a href="#" className="hover:text-brand-primary transition-colors">Sustainability</a>
          <a href="#" className="hover:text-brand-primary transition-colors">Contact</a>
        </div>
        <button className="px-6 py-2 border border-brand-cyan/50 text-brand-cyan rounded-lg hover:bg-brand-cyan/10 transition-colors">
          Client Login
        </button>
      </nav>

      <main className="relative z-10 container mx-auto px-6 py-8 max-w-6xl">
        <h1 className="text-4xl font-bold text-center mb-12">
          BeeCarbonit <span className="text-brand-cyan">Investors</span> - Strategic Growth
        </h1>

        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          {/* Main Chart Area */}
          <div className="flex-[3] bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(0,242,255,0.05)] relative overflow-hidden">
             {/* Glowing border effect */}
             <div className="absolute inset-0 border border-brand-cyan/20 rounded-2xl pointer-events-none" />
             
             <h2 className="text-xl font-semibold mb-8 text-brand-cyan">Financial Performance & Carbon Offset Growth (5-Year Overview)</h2>
             
             <div className="relative h-64 w-full flex items-end mb-4 border-l border-b border-white/20 pb-2 pl-2">
                {/* Mock Chart Grid */}
                <div className="absolute inset-0 grid grid-cols-5 grid-rows-3 pointer-events-none opacity-10">
                  <div className="border-b border-r border-white"></div><div className="border-b border-r border-white"></div><div className="border-b border-r border-white"></div><div className="border-b border-r border-white"></div><div className="border-b border-white"></div>
                  <div className="border-b border-r border-white"></div><div className="border-b border-r border-white"></div><div className="border-b border-r border-white"></div><div className="border-b border-r border-white"></div><div className="border-b border-white"></div>
                  <div className="border-r border-white"></div><div className="border-r border-white"></div><div className="border-r border-white"></div><div className="border-r border-white"></div><div></div>
                </div>

                {/* Y-Axis Labels */}
                <div className="absolute -left-12 top-0 h-full flex flex-col justify-between text-xs text-zinc-500 py-2">
                  <span>$1500M</span>
                  <span>$1000M</span>
                  <span>$500M</span>
                  <span>$0M</span>
                </div>

                {/* X-Axis Labels */}
                <div className="absolute -bottom-8 left-0 w-full flex justify-between text-xs text-zinc-500 px-4">
                  <span>2020</span>
                  <span>2021</span>
                  <span>2022</span>
                  <span>2023</span>
                  <span>2024</span>
                  <span>2025 YTD</span>
                </div>

                {/* Mock Area Chart - Cyan (AUM) */}
                <svg className="absolute inset-0 w-full h-full preserve-3d" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0,90 Q15,85 20,80 T40,60 T60,60 T80,40 T100,20 L100,100 L0,100 Z" fill="rgba(0,242,255,0.1)" />
                  <path d="M0,90 Q15,85 20,80 T40,60 T60,60 T80,40 T100,20" fill="none" stroke="#00f2ff" strokeWidth="2" className="drop-shadow-[0_0_8px_rgba(0,242,255,0.8)]" />
                  {/* Data Points */}
                  <circle cx="20" cy="80" r="1.5" fill="#00f2ff" />
                  <circle cx="40" cy="60" r="1.5" fill="#00f2ff" />
                  <circle cx="60" cy="60" r="1.5" fill="#00f2ff" />
                  <circle cx="80" cy="40" r="1.5" fill="#00f2ff" />
                  <circle cx="100" cy="20" r="2" fill="#fff" stroke="#00f2ff" strokeWidth="1" className="shadow-[0_0_10px_#fff]" />
                </svg>

                {/* Mock Line Chart - Orange (Carbon Credits Offset) */}
                <svg className="absolute inset-0 w-full h-full preserve-3d" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0,80 Q10,50 20,70 T40,40 T60,60 T80,10 T100,30" fill="none" stroke="#f38020" strokeWidth="1.5" strokeDasharray="4 2" className="drop-shadow-[0_0_8px_rgba(243,128,32,0.8)]" />
                  {/* Data Points */}
                  <circle cx="20" cy="70" r="1" fill="#f38020" />
                  <circle cx="40" cy="40" r="1" fill="#f38020" />
                  <circle cx="60" cy="60" r="1" fill="#f38020" />
                  <circle cx="80" cy="10" r="1" fill="#f38020" />
                  <circle cx="100" cy="30" r="1" fill="#f38020" />
                </svg>
             </div>
             
             {/* Legend */}
             <div className="flex justify-center gap-6 mt-10 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-brand-cyan shadow-[0_0_8px_#00f2ff]" />
                  Total AUM
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-brand-primary shadow-[0_0_8px_#f38020]" />
                  Carbon Credits Offset (Mt)
                </div>
             </div>
          </div>

          {/* Right Metrics Panel */}
          <div className="flex-1 flex flex-col gap-4">
             <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-xl hover:border-white/20 transition-colors">
               <div className="text-xs text-zinc-400 mb-1">Total Assets Under Management</div>
               <div className="text-2xl font-bold text-white">$1.65 Billion</div>
             </div>
             <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-xl hover:border-white/20 transition-colors">
               <div className="text-xs text-zinc-400 mb-1">Net Zero Projects</div>
               <div className="text-2xl font-bold text-white">112</div>
             </div>
             <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-xl hover:border-white/20 transition-colors">
               <div className="text-xs text-zinc-400 mb-1">Global Carbon Offset</div>
               <div className="text-2xl font-bold text-white">3.5 Million <br/>Tonnes</div>
             </div>
             <div className="bg-white/5 border border-brand-cyan/30 rounded-xl p-6 backdrop-blur-xl shadow-[0_0_15px_rgba(0,242,255,0.1)]">
               <div className="text-xs text-zinc-400 mb-1">YTD Growth</div>
               <div className="text-3xl font-bold text-brand-cyan">+22%</div>
             </div>
          </div>
        </div>

        {/* Financial Highlights */}
        <h2 className="text-xl font-semibold mb-6">Key Financial Highlights & Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-brand-cyan/50 transition-all flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Annual Report 2024</h3>
                  <p className="text-sm text-zinc-400">A Year of Sustainable Growth</p>
                </div>
                <div className="p-2 bg-brand-primary/20 rounded-lg text-brand-primary">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
              </div>
              <div className="mt-auto pt-6 flex justify-between items-center">
                <button className="text-brand-primary text-sm font-medium hover:underline flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download PDF
                </button>
                <button className="px-4 py-2 bg-brand-cyan text-brand-obsidian font-bold rounded-lg hover:bg-brand-cyan/80 transition-colors text-sm shadow-[0_0_15px_rgba(0,242,255,0.4)]">
                  View Report
                </button>
              </div>
           </div>

           <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-brand-cyan/50 transition-all flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Annual Report 2023</h3>
                  <p className="text-sm text-zinc-400">Accelerating our Climate Impact</p>
                </div>
                <div className="p-2 bg-brand-primary/20 rounded-lg text-brand-primary">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
              </div>
              <div className="mt-auto pt-6 flex justify-between items-center">
                <button className="text-brand-primary text-sm font-medium hover:underline flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download PDF
                </button>
                <button className="px-4 py-2 bg-brand-cyan text-brand-obsidian font-bold rounded-lg hover:bg-brand-cyan/80 transition-colors text-sm shadow-[0_0_15px_rgba(0,242,255,0.4)]">
                  View Report
                </button>
              </div>
           </div>

           <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-brand-cyan/50 transition-all flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Q1 2025 Financial Statement</h3>
                  <p className="text-sm text-zinc-400">Quarterly Performance Review</p>
                </div>
                <div className="p-2 bg-brand-primary/20 rounded-lg text-brand-primary">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
              </div>
              <div className="mt-auto pt-6 flex justify-between items-center">
                <button className="text-brand-primary text-sm font-medium hover:underline flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download PDF
                </button>
                <button className="px-4 py-2 bg-brand-cyan text-brand-obsidian font-bold rounded-lg hover:bg-brand-cyan/80 transition-colors text-sm shadow-[0_0_15px_rgba(0,242,255,0.4)]">
                  View Statement
                </button>
              </div>
           </div>
        </div>
      </main>

      <footer className="relative z-10 py-8 text-xs text-zinc-500 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 border-t border-white/10">
        <div>
          <h4 className="text-white font-semibold mb-2">Investor Resources</h4>
          <p>Investor Resources</p>
          <p>Shareholder Resources</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Legal & Compliance</h4>
          <p>American Doctrine & Certification</p>
          <p>Regulatory Legal & Compliance</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Contact</h4>
          <p>Contact us @BeeCarbonit</p>
          <p>www.investor@beecarbonit.com</p>
        </div>
        <div className="md:col-span-3 text-center mt-4">
          <p>© 2025 BeeCarbonit. All rights reserved. Leading the Future of Carbon-Neutral City Management.</p>
        </div>
      </footer>
    </div>
  );
}
