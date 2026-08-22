import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, MessageSquare, Trophy, Heart, Sparkles, 
  Flame, Award, ArrowUpRight, Share2, Filter, 
  ThumbsUp, BookOpen, Globe, Shield, Zap
} from 'lucide-react';

const communityPosts = [
  {
    id: 'post-1',
    author: 'Julien Mercier',
    role: 'Facility Manager Senior · Groupe Saint-Gobain',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    title: 'Optimisation de la sur-ventilation nocturne (Night-Cooling) en période caniculaire',
    category: 'CVC & Thermique',
    content: 'Nous avons programmé l\'ouverture asservie des ouvrants de façade et le forçage des CTA en air neuf entre 2h et 6h du matin quand T° ext < 21°C. Résultat : 2.5°C de gagnés sans aucun allumage du groupe froid le matin jusqu\'à 11h.',
    likes: 48,
    comments: 14,
    co2Saved: '3.4 tCO2e/mois',
    time: 'Il y a 3 heures',
    tags: ['NightCooling', 'DécretTertiaire', 'LowTech']
  },
  {
    id: 'post-2',
    author: 'Elena Rostova',
    role: 'Lead ESG Data Analyst · Bouygues Immobilier',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    title: 'Script open-source : Calcul automatique des facteurs d\'émissions Ademe Base Carbone v23',
    category: 'Data & Algorithmes',
    content: 'J\'ai partagé sur le repository communautaire BEECARBONAT notre module Python/Node pour mapper automatiquement les consommations gaz, fioul, réseau de chaleur et électricité avec les incertitudes de calcul CSRD.',
    likes: 72,
    comments: 29,
    co2Saved: 'Outil de calcul',
    time: 'Hier à 16:20',
    tags: ['CSRD', 'OpenData', 'GHGProtocol']
  },
  {
    id: 'post-3',
    author: 'Marc Delaunay',
    role: 'Directeur Technique · Eiffage Énergie Systèmes',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    title: 'Retour d\'expérience : Remplacement R410A par fluide frigorigène R32 bas GWP',
    category: 'Fluides & Maintenance',
    content: 'Bilan après 12 mois sur 4 groupes froids Daikin : aucun problème de fuite, COP amélioré de +8.4%, et division par 3 de l\'impact potentiel des fuites sur le bilan Scope 1.',
    likes: 35,
    comments: 9,
    co2Saved: '18 tCO2e évités',
    time: 'Il y a 2 jours',
    tags: ['F-Gas', 'Chillers', 'Maintenance']
  }
];

const leaderboards = [
  { rank: 1, name: 'Campus Green Tech La Défense', score: '98.4 pts', reduction: '-54% CO2', city: 'Paris' },
  { rank: 2, name: 'Parc Tertiaire Euratlantique', score: '96.1 pts', reduction: '-49% CO2', city: 'Bordeaux' },
  { rank: 3, name: 'BioCluster Lyon Gerland', score: '94.8 pts', reduction: '-46% CO2', city: 'Lyon' },
  { rank: 4, name: 'Hub Innovation Nantes Ouest', score: '92.5 pts', reduction: '-41% CO2', city: 'Nantes' },
];

export default function Community() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [likedPosts, setLikedPosts] = useState({});

  const toggleLike = (id) => {
    setLikedPosts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = ['ALL', 'CVC & Thermique', 'Data & Algorithmes', 'Fluides & Maintenance', 'Réglementation & CSRD'];

  const filteredPosts = activeCategory === 'ALL'
    ? communityPosts
    : communityPosts.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-10 font-sans">
      {/* Header section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs font-mono mb-3">
              <Users className="w-3.5 h-3.5" />
              <span>PEER EXCHANGE & DECARBONIZATION HUB</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              Communauté des Gestionnaires Bas-Carbone
            </h1>
            <p className="text-zinc-400 mt-2 max-w-2xl text-sm lg:text-base">
              Échangez des retours d’expérience, découvrez les réglages GTB les plus efficaces et collaborez avec plus de 4 200 experts du bâtiment durable.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => alert('Ouverture de l\'éditeur de partage communautaire...')}
              className="px-4 py-2 bg-brand-orange hover:bg-white text-black font-bold text-xs font-mono uppercase rounded-lg shadow-[0_0_15px_rgba(243,128,32,0.3)] transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Publier un retour d'expérience
            </button>
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-2">
          <Filter className="w-4 h-4 text-zinc-500 mr-2" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? 'bg-brand-orange text-black font-bold shadow-[0_0_15px_rgba(243,128,32,0.3)]'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
              }`}
            >
              {cat === 'ALL' ? 'Tous les sujets' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Feed + Leaderboard Sidebar */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Posts Feed */}
        <div className="lg:col-span-2 space-y-6">
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 p-6 rounded-2xl backdrop-blur-md transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={post.author === 'Julien Mercier' ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80' : post.avatar} 
                    alt={post.author} 
                    className="w-11 h-11 rounded-full object-cover border border-zinc-700"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm">{post.author}</h4>
                    <p className="text-xs text-zinc-400 font-mono">{post.role}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-1 rounded bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-[11px] font-mono">
                    {post.category}
                  </span>
                  <div className="text-[11px] text-zinc-500 font-mono mt-1">{post.time}</div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mt-4 hover:text-brand-orange transition-colors cursor-pointer">
                {post.title}
              </h3>

              <p className="text-sm text-zinc-300 mt-2 leading-relaxed">
                {post.content}
              </p>

              {/* CO2 badge & tags */}
              <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-zinc-800/80">
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold">
                    <Zap className="w-3 h-3" />
                    Gain : {post.co2Saved}
                  </span>
                  {post.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] font-mono">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
                  <button 
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 transition-colors ${likedPosts[post.id] ? 'text-brand-orange font-bold' : 'hover:text-white'}`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{post.likes + (likedPosts[post.id] ? 1 : 0)}</span>
                  </button>

                  <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments}</span>
                  </button>

                  <button className="hover:text-white transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sidebar: Leaderboard & Challenges */}
        <div className="space-y-6">
          {/* Decarbonization Trophy Leaderboard */}
          <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl backdrop-blur-md">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">Classement National Décarbonation</h3>
            </div>
            <p className="text-xs text-zinc-400 font-mono mb-4">Sites tertiaires avec la plus forte réduction validée</p>

            <div className="space-y-3">
              {leaderboards.map((b) => (
                <div key={b.rank} className="p-3 bg-black/40 border border-zinc-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                      b.rank === 1 ? 'bg-amber-400 text-black' :
                      b.rank === 2 ? 'bg-zinc-300 text-black' :
                      b.rank === 3 ? 'bg-amber-700 text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {b.rank}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white">{b.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{b.city}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-brand-cyan">{b.reduction}</div>
                    <div className="text-[10px] text-zinc-400 font-mono">{b.score}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Challenge Banner */}
          <div className="bg-gradient-to-br from-brand-orange/20 via-zinc-900 to-black border border-brand-orange/40 p-6 rounded-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-brand-orange uppercase font-bold mb-2">
              <Flame className="w-4 h-4" />
              Challenge du Mois
            </div>
            <h4 className="text-lg font-bold text-white">Chasse aux Consommations Fantômes de Nuit</h4>
            <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
              Réduisez le talon de puissance résiduel entre 22h et 5h du matin de plus de 15% pour débloquer le badge certifié Bâtiment Sobriété 2026.
            </p>
            <button 
              onClick={() => alert('Participation au challenge enregistrée !')}
              className="mt-4 w-full py-2.5 bg-brand-orange text-black font-bold font-mono text-xs uppercase rounded-lg hover:bg-white transition-colors"
            >
              Participer au Challenge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
