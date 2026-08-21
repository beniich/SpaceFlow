import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

const jobListings = [
  {
    id: 1,
    title: 'Facility AI Specialist',
    location: 'New York Future Hub',
    description: 'Facility capture innovation and determinist and advanced robust for learning and business-required collation.',
  },
  {
    id: 2,
    title: 'Carbon Capture Engineer',
    location: 'London Eco-Campus',
    description: 'Carbon capture is positioned and known technical sovereign to learning business macroeconomic restructuring.',
  },
  {
    id: 3,
    title: 'Green Architecture Lead',
    location: 'London Eco-Campus',
    description: 'Green architecture lead to green architecture lead engineering meetings and environmental-at future position.',
  }
];

const categories = [
  'Sustainable Operations',
  'Smart City Integration',
  'Advanced Materials',
  'Energy Systems'
];

export default function Careers() {
  return (
    <div className="min-h-screen bg-brand-obsidian text-zinc-100 font-sans relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-brand-obsidian/80 backdrop-blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-cyan/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      {/* Navigation - Simple version for mockup */}
      <nav className="relative z-10 flex items-center justify-center gap-8 pt-8 pb-4">
        <a href="/" className="hover:text-brand-cyan transition-colors">Home</a>
        <a href="#" className="hover:text-brand-cyan transition-colors">About Us</a>
        <a href="/careers" className="text-brand-cyan font-medium">Careers</a>
        <a href="/impact" className="hover:text-brand-cyan transition-colors">Impact</a>
        <a href="#" className="hover:text-brand-cyan transition-colors">Contact</a>
      </nav>

      <main className="relative z-10 container mx-auto px-6 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">
            BeeCarbonit <span className="text-brand-cyan">Careers</span> - Future Workspace
          </h1>

          {/* Hero Image Area (Glass Container) */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 p-2 backdrop-blur-md aspect-video max-h-[400px] flex items-center justify-center mb-12 group">
             {/* Fallback pattern if no image */}
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 mix-blend-luminosity group-hover:opacity-60 transition-opacity duration-700" />
             <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian via-brand-obsidian/50 to-transparent" />
             <h2 className="relative text-5xl md:text-7xl font-bold text-white tracking-tight drop-shadow-2xl">
               Join the Revolution
             </h2>
          </div>

          {/* Categories Carousel */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <button className="p-2 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-brand-cyan transition-colors">
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-4 overflow-hidden">
              {categories.map((cat, i) => (
                <button 
                  key={cat}
                  className={`px-6 py-3 rounded-lg border backdrop-blur-md transition-all duration-300 ${
                    i === 0 
                      ? 'border-brand-cyan/50 bg-brand-cyan/10 text-brand-cyan shadow-[0_0_15px_rgba(0,242,255,0.2)]' 
                      : 'border-white/10 bg-white/5 text-zinc-400 hover:text-zinc-200 hover:border-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button className="p-2 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-brand-cyan transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Job Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {jobListings.map(job => (
              <motion.div 
                key={job.id}
                whileHover={{ y: -5 }}
                className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 flex flex-col hover:border-brand-primary/50 hover:shadow-[0_0_30px_rgba(243,128,32,0.15)] transition-all duration-300"
              >
                <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-4 font-mono">
                  <MapPin size={14} className="text-brand-cyan" />
                  {job.location}
                </div>
                <p className="text-zinc-500 text-sm flex-grow mb-6">
                  {job.description}
                </p>
                <button className="w-full py-3 rounded-lg bg-gradient-to-r from-brand-primary to-orange-400 text-brand-obsidian font-semibold hover:shadow-[0_0_20px_rgba(243,128,32,0.4)] transition-all duration-300">
                  Apply Now
                </button>
              </motion.div>
            ))}
            {jobListings.map(job => (
              <motion.div 
                key={`${job.id}-2`}
                whileHover={{ y: -5 }}
                className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 flex flex-col hover:border-brand-primary/50 hover:shadow-[0_0_30px_rgba(243,128,32,0.15)] transition-all duration-300"
              >
                <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-4 font-mono">
                  <MapPin size={14} className="text-brand-cyan" />
                  {job.location}
                </div>
                <p className="text-zinc-500 text-sm flex-grow mb-6">
                  {job.description}
                </p>
                <button className="w-full py-3 rounded-lg border border-brand-primary/50 text-brand-primary font-semibold hover:bg-brand-primary/10 transition-all duration-300">
                  Apply Now
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
