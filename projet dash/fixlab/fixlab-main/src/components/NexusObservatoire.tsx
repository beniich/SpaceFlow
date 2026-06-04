import React, { useState } from "react";
import { Search, Eye, Filter, Sparkles, BookOpen, Clock, Notebook, HelpCircle, FileClock, X, Plus, PlusCircle, Trash2 } from "lucide-react";

interface JournalNode {
  id: string;
  title: string;
  category: string;
  author: string;
  timestamp: string;
  content: string;
}

interface ObservatoireProps {
  isLightMode: boolean;
  onNavigate: (tabId: string) => void;
  showToast: (msg: string) => void;
  // State from parent
  observatoryJournals: JournalNode[];
  newJournalTitle: string;
  setNewJournalTitle: (val: string) => void;
  newJournalContent: string;
  setNewJournalContent: (val: string) => void;
  journalCategory: string;
  setJournalCategory: (val: string) => void;
  handleAddJournalNode: (e: React.FormEvent) => void;
  setObservatoryJournals: (journals: JournalNode[]) => void;
}

export function NexusObservatoire({
  isLightMode,
  onNavigate,
  showToast,
  observatoryJournals,
  newJournalTitle,
  setNewJournalTitle,
  newJournalContent,
  setNewJournalContent,
  journalCategory,
  setJournalCategory,
  handleAddJournalNode,
  setObservatoryJournals
}: ObservatoireProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilterCategory, setSelectedFilterCategory] = useState("ALL");
  const [selectedArticleDetail, setSelectedArticleDetail] = useState<any | null>(null);
  const [showAddLogForm, setShowAddLogForm] = useState(false);

  // Static reports from Image 1
  const staticArticles = [
    {
      id: "SA-1",
      title: "Best Practices for Device Onboarding",
      category: "BEST_PRACTICES",
      author: "CyberSec Team",
      timestamp: "2026-10-28 09:15",
      isStaticVisualOnly: false,
      content: "Secure device onboarding is critical for protecting physical ecosystems. When a node bootstraps onto the FixLab, it requires unique hardware-based signatures (PUF - Physical Unclonable Functions).\n\nKey Recommendations:\n1. Never use default pre-shared keys.\n2. Leverage out-of-band certificate generation.\n3. Validate the hash key before committing transmission authority.",
      imageUrl: "lock"
    },
    {
      id: "SA-2",
      title: "AI-Driven Threat Detection in 2024",
      category: "THREAT_DETECTION",
      author: "Intelligence Team",
      timestamp: "2026-10-28 08:32",
      isStaticVisualOnly: false,
      content: "Passive anomaly detection using neural-network mapping provides early warnings against structural compromises.\n\nOur models analyze connection timings and payload sizes, flags deviations above 15% and issues containment rules to adjacent nodes before unauthorized lateral traversal occurs.",
      imageUrl: "ai"
    },
    {
      id: "SA-3",
      title: "FixLab Platform Update: Enhanced Encryption",
      category: "PLATFORM",
      author: "Core Eng",
      timestamp: "2026-10-26 14:00",
      isStaticVisualOnly: false,
      content: "Version 4.5 of the FixLab is officially deployed! This update introduces advanced ring-cryptography signatures and decreases key renegotiation latencies by 35%.\n\nChanges have been implemented passively and won't affect active satellite routes in production.",
      imageUrl: "encryption"
    },
    {
      id: "SA-4",
      title: "Managing Compliance for Remote Fleets",
      category: "COMPLIANCE",
      author: "Governance Dept",
      timestamp: "2026-10-26 11:22",
      isStaticVisualOnly: false,
      content: "Maintaining alignment with global policy rules (e.g., GDPR, NIS2) requires top-down isolation. Remote fleet containers must leverage localized routing logs and support selective clearance pruning to satisfy state compliance auditors.",
      imageUrl: "compliance"
    },
    {
      id: "SA-5",
      title: "Global Cybersecurity Outlook: Q4 Report",
      category: "THREAT_DETECTION",
      author: "Nexus Analyst",
      timestamp: "2026-10-26 10:05",
      isStaticVisualOnly: false,
      content: "Q4 security threat vectors indicate rising brute force attempts on edge power stations. Restricting gateway visibility to pre-approved IPs and forcing QKD key rotations are the most effective counter-strategies.",
      imageUrl: "global"
    },
    {
      id: "SA-6",
      title: "Mitigating Supply Chain Attacks",
      category: "BEST_PRACTICES",
      author: "Hardware Team",
      timestamp: "2026-10-28 17:40",
      isStaticVisualOnly: false,
      content: "Physical compromises occur before devices hit deployment. Establishing cryptographic chain of custody certificates at delivery centers completely neutralizes malicious hardware overlays.",
      imageUrl: "supply"
    },
    {
      id: "SA-7",
      title: "The Rise of Quantum-Resistant Security",
      category: "PLATFORM",
      author: "Quantum Lab",
      timestamp: "2026-10-26 09:30",
      isStaticVisualOnly: false,
      content: "As quantum decryptors evolve, traditional RSA algorithms will fall. Transitioning server ports to post-quantum cryptography (Kyber-1024) is vital for ensuring long-term sovereign infrastructure defense.",
      imageUrl: "quantum"
    },
    {
      id: "SA-8",
      title: "Top 5 Device Management Tools for Enterprises",
      category: "BEST_PRACTICES",
      author: "DevOps Team",
      timestamp: "2026-10-26 08:00",
      isStaticVisualOnly: false,
      content: "Managing 10k+ physical routers requires strong automation. Integrations, remote configurations, secure firmware pushes, live maps, and centralized audit reports are essential tools for scaling fleets secure.",
      imageUrl: "tools"
    }
  ];

  // Combine static articles with dynamic user journal reports
  const userArticles = observatoryJournals.map(journal => ({
    id: journal.id,
    title: journal.title,
    category: journal.category.toUpperCase(),
    author: journal.author || "Operative Agent",
    timestamp: journal.timestamp,
    isStaticVisualOnly: false,
    content: journal.content,
    imageUrl: "user-note"
  }));

  const allArticles = [...userArticles, ...staticArticles];

  // Derived filter and search logic
  const filteredArticles = allArticles.filter(art => {
    const matchesCategory = selectedFilterCategory === "ALL" || art.category === selectedFilterCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Action for deleting user-generated post
  const handleDeletePost = (id: string, e: any) => {
    e.stopPropagation();
    const updated = observatoryJournals.filter(j => j.id !== id);
    setObservatoryJournals(updated);
    localStorage.setItem("vision_architecte_journals", JSON.stringify(updated));
    showToast("Observation log deleted from the network.");
  };

  return (
    <div className="space-y-8 relative z-10 animate-fade-in text-left">
      
      {/* Page Header (Matching Image 1) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="font-mono text-[9px] text-[#ff5a00] uppercase font-black tracking-widest">[ REPORTS & SECURITY NEWS ]</span>
          <h2 className="text-3xl font-black text-white font-sans uppercase tracking-tight mt-1">
            Security Insights and News
          </h2>
          <p className="text-stone-500 text-xs">
            Latest updates on device security, management, and industry trends.
          </p>
        </div>

        {/* Dynamic Add Observation log Toggle */}
        <button
          onClick={() => {
            setShowAddLogForm(!showAddLogForm);
            showToast(showAddLogForm ? "Closing logging module." : "Ready to log incident.");
          }}
          className="bg-[#ff5a00]/10 hover:bg-[#ff5a00]/25 text-[#ff5a00] border border-[#ff5a00]/20 px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all shrink-0"
        >
          <Notebook className="w-4 h-4" />
          {showAddLogForm ? "Back to Reports" : "Log an Incident"}
        </button>
      </div>

      {/* Dynamic Observation Submission Box Form */}
      {showAddLogForm && (
        <form onSubmit={(e) => {
          handleAddJournalNode(e);
          setShowAddLogForm(false);
        }} className="p-6 rounded-3xl border border-[#ff5a00]/30 bg-[#0d091a]/80 space-y-4 animate-fade-in max-w-xl">
          <div className="flex justify-between items-center border-b border-rose-950/20 pb-2 mb-2">
            <span className="text-[9px] font-mono text-[#ff5a00] uppercase font-bold">[ NEW INCIDENT / OBSERVATION ]</span>
            <span className="text-[10px] text-zinc-500 font-mono tracking-wider">DIRECT SYSTEM LINK</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[9px] font-mono text-stone-400 block uppercase mb-1">OBSERVATION TITLE</label>
              <input
                type="text"
                required
                placeholder="e.g. Memory pressure anomaly detected on channel 01..."
                value={newJournalTitle}
                onChange={(e) => setNewJournalTitle(e.target.value)}
                className="w-full bg-black/40 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-[#ff5a00]/50"
              />
            </div>
            <div>
              <label className="text-[9px] font-mono text-stone-400 block uppercase mb-1">PROTOCOL CATEGORY</label>
              <select
                value={journalCategory}
                onChange={(e) => setJournalCategory(e.target.value)}
                className="w-full bg-[#08090b] border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#ff5a00]/50"
              >
                <option value="threat_detection">THREAT_DETECTION</option>
                <option value="best_practices">BEST_PRACTICES</option>
                <option value="platform">PLATFORM</option>
                <option value="compliance">COMPLIANCE</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[9px] font-mono text-stone-400 block uppercase mb-1">CRITICAL REPORT DETAIL</label>
            <textarea
              required
              rows={4}
              placeholder="Describe the incident or anomaly..."
              value={newJournalContent}
              onChange={(e) => setNewJournalContent(e.target.value)}
              className="w-full bg-black/40 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-[#ff5a00]/50"
            />
          </div>

          <button
            type="submit"
            className="w-full font-mono text-[9px] font-black uppercase tracking-widest bg-gradient-to-r from-[#ff7e00] to-[#ff5a00] text-white py-3.5 rounded-xl hover:shadow-[0_4px_15px_rgba(255,90,0,0.3)] transition-all cursor-pointer"
          >
            TRANSMIT AND PREPEND TO NEWS FEED
          </button>
        </form>
      )}

      {/* Filters & Search section inside Image 1 */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-[#0a0815]/90 border border-neutral-900 p-4 rounded-2xl">
        {/* Categories togglers */}
        <div className="flex flex-wrap gap-1.5 items-center">
          {["ALL", "BEST_PRACTICES", "THREAT_DETECTION", "PLATFORM", "COMPLIANCE"].map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedFilterCategory(cat);
                showToast(`Active filter: ${cat}`);
              }}
              className={`font-mono text-[9px] uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                selectedFilterCategory === cat 
                  ? "bg-[#ff5a00]/10 text-[#ff5a00] border border-[#ff5a00]/40 font-bold" 
                  : "text-zinc-500 hover:text-white border border-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input field */}
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-neutral-800/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white font-sans placeholder-zinc-650 focus:outline-none focus:border-[#ff5a00]/50"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
        </div>
      </div>

      {/* Grid of Articles matching Image 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
        
        {filteredArticles.map((art, index) => {
          // Dynamic badge style
          const isUserLogged = art.id.startsWith("J-");
          
          return (
            <div
              key={art.id}
              onClick={() => {
                setSelectedArticleDetail(art);
                showToast(`Displaying report: ${art.title}`);
              }}
              className="group flex flex-col justify-between bg-neutral-950/70 border border-neutral-900/80 hover:border-[#ff5a00]/30 hover:bg-[#0d0a1b]/80 p-5 rounded-3xl cursor-pointer transition-all duration-300 relative overflow-hidden"
            >
              
              {/* Specialized dynamic tags */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20">
                {isUserLogged ? (
                  <span className="bg-[#cc0055]/20 text-[#ff2277] font-mono text-[7px] font-black uppercase px-2 py-0.5 rounded border border-[#ff2277]/30 animate-pulse">
                    RECENT AGENT
                  </span>
                ) : (
                  <span className="bg-neutral-900 text-neutral-500 font-mono text-[7px] font-bold uppercase px-2 py-0.5 rounded border border-neutral-800">
                    {art.category}
                  </span>
                )}

                {/* Trash button if user logged */}
                {isUserLogged && (
                  <button
                    onClick={(e) => handleDeletePost(art.id, e)}
                    className="p-1 rounded bg-black border border-neutral-800 hover:border-red-500 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>

              {/* Artwork Container containing custom high fidelity SVG icons representing the article topic */}
              <div className="relative rounded-2xl bg-[#090614] h-28 flex items-center justify-center p-4 mb-4 border border-neutral-900/80 overflow-hidden pointer-events-none">
                
                {art.imageUrl === "lock" && (
                  <svg className="w-16 h-16 text-[#ff5a00] opacity-80" viewBox="0 0 100 100">
                    <rect x="30" y="45" width="40" height="35" rx="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
                    <path d="M 40 45 L 40 28 A 10 10 0 0 1 60 28 L 60 45" fill="none" stroke="currentColor" strokeWidth="2.5" />
                    <circle cx="50" cy="62" r="3" fill="currentColor" />
                    <path d="M 10 80 Q 50 100 90 80" stroke="rgba(255, 90, 0, 0.15)" strokeWidth="1" fill="none" />
                  </svg>
                )}

                {art.imageUrl === "ai" && (
                  <svg className="w-16 h-16 text-cyan-400 opacity-80 animate-pulse" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="18" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M 50 15 L 50 32 M 50 68 L 50 85 M 15 50 L 32 50 M 68 50 L 85 50" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="50" cy="50" r="6" fill="currentColor" />
                    <path d="M 32 32 L 68 68 M 32 68 L 68 32" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
                  </svg>
                )}

                {art.imageUrl === "encryption" && (
                  <svg className="w-16 h-16 text-purple-400 opacity-80" viewBox="0 0 100 100">
                    <polygon points="50,15 80,30 80,68 50,85 20,68 20,30" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M 50 38 L 50 62 M 38 50 L 62 50" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                )}

                {art.imageUrl === "user-note" && (
                  <svg className="w-16 h-16 text-[#ff5a00] animate-pulse" viewBox="0 0 100 100">
                    <rect x="25" y="25" width="50" height="50" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M 35 40 H 65 M 35 50 H 65 M 35 60 H 55" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                )}

                {/* Default artwork for remaining standard topics */}
                {!["lock", "ai", "encryption", "user-note"].includes(art.imageUrl) && (
                  <svg className="w-16 h-16 text-neutral-700 hover:text-white transition-colors" viewBox="0 0 100 100">
                    <line x1="20" y1="20" x2="80" y2="20" stroke="currentColor" strokeWidth="2" />
                    <line x1="20" y1="40" x2="80" y2="40" stroke="currentColor" strokeWidth="2" />
                    <line x1="20" y1="60" x2="50" y2="60" stroke="currentColor" strokeWidth="2" />
                    <circle cx="75" cy="70" r="10" fill="none" stroke="#ff5a00" strokeWidth="1.5" />
                  </svg>
                )}
                
                {/* Circuit decor glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              </div>

              {/* Title & Metadata */}
              <div className="space-y-2 text-left flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-sans font-black uppercase text-white group-hover:text-[#ff5a00] transition-colors leading-tight">
                    {art.title}
                  </h3>
                  <p className="text-[11.5px] text-stone-500 leading-normal line-clamp-3 mt-1.5 font-sans">
                    {art.content}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-neutral-900 mt-2 text-[9px] font-mono text-zinc-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#ff5a00]" />
                    <span>{art.timestamp.split(" ")[0]}</span>
                  </div>
                  <span>BY {art.author.toUpperCase()}</span>
                </div>
              </div>

            </div>
          );
        })}

      </div>

      {filteredArticles.length === 0 && (
        <div className="p-12 text-center border border-neutral-900 rounded-3xl text-stone-500 font-mono text-xs">
          🚫 NO OBSERVATIONS MATCHING SELECTION CRITERIA FOUND.
        </div>
      )}

      {/* Symmetrical Pagination display matching Image 1 */}
      <div className="fflex flex-row justify-between items-center gap-4 border-t border-neutral-900 pt-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => showToast("Scrolling to past archives.")}
            className="px-3.5 py-1.5 rounded-xl border border-neutral-800 text-stone-400 font-mono text-[9px] hover:text-white"
          >
            Previous
          </button>
          
          <span className="font-mono text-[9.5px] text-[#ff5a00] font-black uppercase">[ Page 1 of 5 ]</span>
          
          <button
            onClick={() => showToast("Scrolling to network reports.")}
            className="px-3.5 py-1.5 rounded-xl border border-neutral-800 text-stone-400 font-mono text-[9px] hover:text-white"
          >
            Next
          </button>
        </div>

        <button
          onClick={() => showToast("Loading additional archival logs.")}
          className="bg-[#ff5a00] hover:bg-[#ff7e00] text-white px-5 py-2.5 rounded-xl font-mono text-[9.5px] font-bold uppercase cursor-pointer"
        >
          Load More
        </button>
      </div>

      {/* Real Glassmorphic full Article Detail overlay modal */}
      {selectedArticleDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-left">
          <div className="w-full max-w-xl rounded-[2rem] border border-[#ff5a00]/30 bg-[#070512] shadow-2xl p-6 relative">
            
            {/* Close button */}
            <button
              onClick={() => setSelectedArticleDetail(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-neutral-900 border border-neutral-800 text-stone-400 hover:text-white hover:border-[#ff5a00]/50 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="bg-[#ff5a00]/10 text-[#ff5a00] text-[8.5px] font-mono font-bold uppercase px-2.5 py-1 rounded border border-[#ff5a00]/25">
                {selectedArticleDetail.category}
              </span>
              <span className="font-mono text-[9px] text-zinc-500">{selectedArticleDetail.timestamp}</span>
            </div>

            <h3 className="text-lg font-black text-white uppercase tracking-tight pr-8 leading-tight">
              {selectedArticleDetail.title}
            </h3>

            <p className="text-zinc-600 text-[9px] uppercase font-mono mt-2 border-b border-rose-950/20 pb-2">
              SIGNATURE COMPTABLE: {selectedArticleDetail.author.toUpperCase()} // NEX_DOC_ID: {selectedArticleDetail.id}
            </p>

            {/* Expansive reading space */}
            <div className="py-4 text-xs text-stone-300 leading-relaxed max-h-56 overflow-y-auto whitespace-pre-line pr-2">
              {selectedArticleDetail.content}
            </div>

            <div className="flex justify-end gap-3 border-t border-neutral-900 pt-4 mt-2">
              <button
                onClick={() => {
                  setSelectedArticleDetail(null);
                  showToast("Closing structured viewer.");
                }}
                className="font-mono text-[9px] font-bold uppercase tracking-wider text-zinc-400 hover:text-white px-4 py-2"
              >
                Close tab
              </button>
              
              <button
                onClick={() => showToast(`Report ${selectedArticleDetail.id} downloaded locally.`)}
                className="bg-[#ff5a00] hover:bg-[#ff7e00] text-white px-4 py-2.5 rounded-xl font-mono text-[9px] font-bold uppercase"
              >
                Download PDF
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

