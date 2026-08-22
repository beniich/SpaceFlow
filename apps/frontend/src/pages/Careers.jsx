import React, { useState } from 'react';
import { Briefcase, MapPin, Sparkles, ArrowRight, CheckCircle2, Building, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const jobListings = [
  {
    id: 'job-1',
    title: 'Facility AI Specialist',
    location: 'New York Future Hub',
    category: 'Sustainable Operations',
    description: 'Facility capture innovation and master technician optimizing IoT networks and autonomous building operations.',
    badge: 'Full Time • Hybrid'
  },
  {
    id: 'job-2',
    title: 'Carbon Capture Engineer',
    location: 'London Eco-Campus',
    category: 'Advanced Materials',
    description: 'Carbon capture solutions and technical engineering driving net-zero industrial emissions.',
    badge: 'Full Time • On-site'
  },
  {
    id: 'job-3',
    title: 'Green Architecture Lead',
    location: 'London Eco-Campus',
    category: 'Smart City Integration',
    description: 'Green architecture leadership designing sustainable urban structures and bioclimatic HVAC integration.',
    badge: 'Senior • Remote/Hybrid'
  },
  {
    id: 'job-4',
    title: 'Smart Grid Integration Lead',
    location: 'Singapore Tech Hub',
    category: 'Energy Systems',
    description: 'Deploying micro-grids and renewable storage protocols across dense metropolitan facilities.',
    badge: 'Full Time'
  }
];

export default function Careers() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');

  const filteredJobs = activeCategory === 'All'
    ? jobListings
    : jobListings.filter(j => j.category === activeCategory);

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail) {
      toast.error("Veuillez renseigner votre nom et adresse email");
      return;
    }
    toast.success(`Candidature soumise pour ${selectedJob.title} !`);
    setSelectedJob(null);
    setApplicantName('');
    setApplicantEmail('');
  };

  return (
    <div className="min-h-screen bg-[#070b10] text-slate-100 p-4 sm:p-6 lg:p-12 font-sans relative">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex items-center justify-between border-b border-slate-800 pb-6 mb-10">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-white">
            <span className="text-[#f38020]">Bee</span><span className="text-[#00dbe7]">Carbonat</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-slate-400">
          <Link to="/dashboard" className="hover:text-white transition">Home</Link>
          <Link to="/about" className="hover:text-white transition">About Us</Link>
          <span className="text-[#00dbe7] font-bold border-b border-[#00dbe7] pb-1">Careers</span>
          <Link to="/impact" className="hover:text-white transition">Impact</Link>
          <Link to="/case-studies" className="hover:text-white transition">Contact</Link>
        </div>
      </div>

      {/* Hero Header */}
      <div className="max-w-4xl mx-auto text-center mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f38020]/10 border border-[#f38020]/30 text-[#f38020] text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" /> FUTURE WORKSPACE
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          BeeCarbonat Careers - <span className="text-[#00dbe7]">Join the Revolution</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Shape the future of green infrastructure, artificial intelligence, and carbon-neutral facility operations.
        </p>
      </div>

      {/* Category Tabs Filter */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-wrap items-center justify-center gap-3">
        {['All', 'Sustainable Operations', 'Smart City Integration', 'Advanced Materials', 'Energy Systems'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition backdrop-blur-md ${
              activeCategory === cat
                ? 'bg-[#00dbe7] text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Job Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-[#00dbe7]/50 transition-all duration-300 backdrop-blur-xl flex flex-col justify-between space-y-4 shadow-xl group"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-700">
                  {job.badge}
                </span>
                <span className="text-[10px] font-mono text-[#00dbe7]">{job.category}</span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-[#f38020] transition-colors">
                {job.title}
              </h3>

              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-[#f38020]" />
                <span>{job.location}</span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {job.description}
              </p>
            </div>

            <button
              onClick={() => setSelectedJob(job)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#f38020] to-orange-600 hover:opacity-90 text-xs font-bold text-white transition tracking-wider uppercase font-mono shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#00dbe7] uppercase">CANDIDATURE POSTE</span>
                <h3 className="text-lg font-bold text-white">{selectedJob.title}</h3>
              </div>
              <button onClick={() => setSelectedJob(null)} className="text-slate-400 hover:text-white text-sm">✕</button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Nom complet</label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="Jean Dupont"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#f38020]"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Adresse Email</label>
                <input
                  type="email"
                  required
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  placeholder="jean.dupont@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#f38020]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#00dbe7] text-slate-950 font-bold text-xs uppercase font-mono hover:bg-cyan-400 transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Envoyer la Candidature
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
