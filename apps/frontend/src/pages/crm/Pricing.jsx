import React, { useEffect, useState } from 'react';
import { Check, Info, ArrowRight, Zap, CreditCard, Users, UserCheck, ShieldCheck, Wrench, Search, Building2, ChevronRight, Calculator } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Pricing() {
  const [plans, setPlans] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('FREE');
  const [activeTab, setActiveTab] = useState('ROLES'); // 'ROLES' | 'GLOBAL'
  const [billingCycle, setBillingCycle] = useState('ANNUAL'); // 'MONTHLY' | 'ANNUAL'

  // Role seat quantities state
  const [seats, setSeats] = useState({
    occupant: 50,
    technician: 5,
    manager: 2,
    supervisor: 1
  });

  const ROLE_PRICING = [
    {
      id: 'occupant',
      roleTitle: 'Demandeur / Occupant',
      tagline: 'Qui fait la réclamation',
      description: 'Pour les locataires, employés et résidents qui soumettent des tickets et scannent les QR codes.',
      priceMonthly: 0,
      priceAnnual: 0,
      badge: 'Inclus & Illimité',
      icon: Users,
      color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
      features: [
        'Soumission de réclamations illimitées',
        'Scan QR Code sur équipements',
        'Suivi du statut en temps réel',
        'Notifications Push & Email'
      ]
    },
    {
      id: 'technician',
      roleTitle: 'Technicien & Inspecteur',
      tagline: 'Qui inspecte & intervient',
      description: 'Pour les techniciens de maintenance, contrôleurs qualité et intervenants terrain.',
      priceMonthly: 15,
      priceAnnual: 12,
      badge: 'Populaire Terrain',
      icon: Wrench,
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
      features: [
        'Application mobile d\'intervention',
        'Clôture avec photo & signature',
        'Rapports d\'inspection de conformité',
        'Diagnostic guidé & historique',
        'Mode hors-ligne synchro'
      ]
    },
    {
      id: 'manager',
      roleTitle: 'Gestionnaire / Dispatcher',
      tagline: 'Qui gère & attribue',
      description: 'Pour les chargés d\'exploitation, responsables Helpdesk et gestionnaires de site.',
      priceMonthly: 45,
      priceAnnual: 36,
      badge: 'Gestion Clé',
      icon: UserCheck,
      color: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
      features: [
        'Validation & dispatching des réclamations',
        'Gestion des SLA & priorités',
        'Attribution automatique des Work Orders',
        'Gestion des stocks de pièces détachées',
        'Suivi des contrats prestataires'
      ]
    },
    {
      id: 'supervisor',
      roleTitle: 'Superviseur & Direction',
      tagline: 'Qui pilote & suit',
      description: 'Pour les directeurs FM, auditeurs qualité et responsables du patrimoine immobilier.',
      priceMonthly: 89,
      priceAnnual: 70,
      badge: 'Pilote Stratégique',
      icon: ShieldCheck,
      color: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
      features: [
        'Tableaux de bord & KPIs d\'exploitation',
        'Audit & conformité (SOC2 / ISO)',
        'Digital Twin & Modélisation BIM 3D',
        'Analytics prédictifs & export ERP',
        'Support dédié 24/7 VIP'
      ]
    }
  ];

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/crm/billing/plans');
        setPlans(response.data.plans || {});
      } catch (err) {
        console.warn('Could not fetch plans:', err);
      }
    };
    fetchPlans();
  }, []);

  const handleCheckout = async (planKey) => {
    setLoading(true);
    const toastId = toast.loading('Préparation de votre paiement sécurisé...');
    try {
      const response = await api.post('/crm/billing/create-checkout', { planKey });
      if (response.data?.url) {
        toast.dismiss(toastId);
        window.location.href = response.data.url;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la création de la session', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handlePortal = async () => {
    setLoading(true);
    const toastId = toast.loading('Redirection vers le portail...');
    try {
      const response = await api.post('/crm/billing/portal');
      if (response.data?.url) {
        toast.dismiss(toastId);
        window.location.href = response.data.url;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Aucun abonnement actif trouvé', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // Calculate total monthly estimate
  const totalMonthlyCost = ROLE_PRICING.reduce((acc, r) => {
    const price = billingCycle === 'ANNUAL' ? r.priceAnnual : r.priceMonthly;
    return acc + (seats[r.id] * price);
  }, 0);

  const featuresGlobal = {
    STARTER: [
      'Jusqu\'à 500 contacts',
      '3 utilisateurs inclus',
      'Gestion des tickets (Work Orders)',
      'Support par email (48h)'
    ],
    PRO: [
      'Jusqu\'à 5 000 contacts',
      '10 utilisateurs inclus',
      'Modélisation BIM basique',
      'Alertes IoT (50 capteurs)',
      'Support prioritaire (24h)'
    ],
    ENTERPRISE: [
      'Contacts et Utilisateurs illimités',
      'Digital Twin & BIM Avancé',
      'IoT en temps réel (Illimité)',
      'Intégration ERP dédiée',
      'Account Manager dédié'
    ]
  };

  return (
    <div className="p-4 sm:p-8 max-w-[1400px] mx-auto min-h-screen text-zinc-100 font-sans">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-display uppercase tracking-widest text-brand-orange mb-3">
          Forfaits & Abonnements par Rôle
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto font-mono text-sm leading-relaxed">
          Choisissez la formule adaptée à chaque rôle de votre chaîne de traitement des réclamations :
          de l'occupant au technicien, jusqu'au superviseur.
        </p>

        {/* View Mode Toggle */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="bg-zinc-900 border border-zinc-800 p-1 rounded-xl flex items-center font-mono text-xs">
            <button
              onClick={() => setActiveTab('ROLES')}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'ROLES' ? 'bg-brand-orange text-black shadow' : 'text-zinc-400 hover:text-white'}`}
            >
              Abonnement par Rôle (Recommandé)
            </button>
            <button
              onClick={() => setActiveTab('GLOBAL')}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'GLOBAL' ? 'bg-brand-orange text-black shadow' : 'text-zinc-400 hover:text-white'}`}
            >
              Forfaits Globaux Entreprise
            </button>
          </div>
        </div>

        {/* Billing Cycle Switch */}
        {activeTab === 'ROLES' && (
          <div className="mt-4 flex items-center justify-center gap-3 text-xs font-mono">
            <span className={billingCycle === 'MONTHLY' ? 'text-white font-bold' : 'text-zinc-400'}>Mensuel</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'ANNUAL' ? 'MONTHLY' : 'ANNUAL')}
              className="w-12 h-6 bg-zinc-800 border border-zinc-700 rounded-full p-1 relative transition-all"
            >
              <div className={`w-4 h-4 bg-brand-orange rounded-full transition-transform ${billingCycle === 'ANNUAL' ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <span className={billingCycle === 'ANNUAL' ? 'text-brand-orange font-bold flex items-center gap-1' : 'text-zinc-400'}>
              Annuel <span className="bg-brand-orange/20 text-brand-orange px-1.5 py-0.5 rounded text-[10px] font-bold">-20%</span>
            </span>
          </div>
        )}
      </div>

      {/* ================= TAB 1: ROLE-BASED SUBSCRIPTIONS ================= */}
      {activeTab === 'ROLES' && (
        <div className="space-y-12">
          
          {/* Grid of 4 Role Subscriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ROLE_PRICING.map((role) => {
              const IconComp = role.icon;
              const unitPrice = billingCycle === 'ANNUAL' ? role.priceAnnual : role.priceMonthly;

              return (
                <div 
                  key={role.id}
                  className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-700 transition-all relative shadow-xl group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2.5 rounded-xl border ${role.color}`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {role.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1">{role.roleTitle}</h3>
                    <p className="text-xs font-mono text-brand-orange mb-3">{role.tagline}</p>
                    <p className="text-xs text-zinc-400 font-sans mb-5 leading-relaxed min-h-[36px]">
                      {role.description}
                    </p>

                    <div className="border-t border-b border-zinc-800/80 py-4 mb-5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-white">{unitPrice}€</span>
                        <span className="text-xs font-mono text-zinc-400">
                          {unitPrice === 0 ? '' : '/ utili. / mois'}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {unitPrice === 0 ? 'Aucune limite d\'utilisateurs' : `Facturé ${unitPrice * 12}€/an par licence`}
                      </span>
                    </div>

                    {/* Features list */}
                    <div className="space-y-3 mb-6">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block mb-1">Inclus dans ce rôle:</span>
                      {role.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Seat Adjustment & Instant Subscribe */}
                  <div className="pt-4 border-t border-zinc-800/80 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-400">Nombre de licences:</span>
                      <input 
                        type="number"
                        min="0"
                        value={seats[role.id]}
                        onChange={(e) => setSeats({ ...seats, [role.id]: Math.max(0, parseInt(e.target.value) || 0) })}
                        className="w-16 bg-zinc-950 border border-zinc-700 text-white text-center rounded py-1 text-xs font-bold focus:border-brand-orange focus:outline-none"
                      />
                    </div>

                    <button
                      onClick={() => {
                        toast.success(`Souscription activée pour ${seats[role.id]} licences (${role.roleTitle})`);
                        handleCheckout(role.id.toUpperCase());
                      }}
                      className="w-full py-2.5 px-3 bg-zinc-800 hover:bg-brand-orange hover:text-black text-white font-mono text-xs uppercase font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Souscrire ce Rôle <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Calculator Banner */}
          <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-brand-orange/40 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-brand-orange/10 border border-brand-orange/30 rounded-2xl text-brand-orange shrink-0">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Calculateur de Licence Multi-Rôles</h3>
                <p className="text-xs text-zinc-400 font-mono">
                  {seats.occupant} Occupants (Inclus) + {seats.technician} Techniciens + {seats.manager} Gestionnaires + {seats.supervisor} Superviseurs
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto justify-end">
              <div className="text-center sm:text-right">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Estimation Mensuelle Totale</span>
                <div className="text-3xl font-extrabold text-brand-orange font-mono">
                  {totalMonthlyCost}€ <span className="text-xs font-normal text-zinc-400">/ mois</span>
                </div>
              </div>

              <button
                onClick={() => handleCheckout('CUSTOM_ROLES')}
                className="w-full sm:w-auto px-6 py-3.5 bg-brand-orange hover:bg-[#f59e0b] text-black font-mono text-xs uppercase font-extrabold rounded-xl transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                Commander ces licences <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ================= TAB 2: GLOBAL ENTERPRISE TIERS ================= */}
      {activeTab === 'GLOBAL' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Starter Plan */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 flex flex-col hover:border-zinc-700 transition-colors">
            <div className="mb-6 border-b border-zinc-800 pb-6">
              <h3 className="text-lg font-mono font-bold uppercase tracking-widest text-zinc-100 mb-2">Starter</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold font-sans">29€</span>
                <span className="text-zinc-500 font-mono text-xs uppercase">/ mois</span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">L'essentiel pour numériser votre gestion locale.</p>
            </div>
            
            <div className="flex-1 space-y-4 mb-8">
              {featuresGlobal.STARTER.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-zinc-300 font-sans">{feature}</span>
                </div>
              ))}
            </div>
            
            <button 
              disabled={loading || currentPlan === 'STARTER'}
              onClick={() => handleCheckout('STARTER')}
              className="w-full py-3 px-4 rounded font-mono text-xs uppercase font-bold tracking-widest border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              {currentPlan === 'STARTER' ? 'Plan Actuel' : 'Sélectionner Starter'}
            </button>
          </div>

          {/* Pro Plan (Highlighted) */}
          <div className="bg-gradient-to-b from-brand-orange/10 to-zinc-900/60 border border-brand-orange/50 rounded-2xl p-8 flex flex-col relative shadow-[0_0_30px_rgba(243,128,32,0.1)] hover:shadow-[0_0_40px_rgba(243,128,32,0.2)] transition-shadow -mt-4 mb-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-orange text-black px-4 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-3 h-3" /> Recommandé
            </div>
            <div className="mb-6 border-b border-zinc-800/60 pb-6 pt-4">
              <h3 className="text-xl font-mono font-bold uppercase tracking-widest text-brand-orange mb-2">Pro</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-bold font-sans">79€</span>
                <span className="text-zinc-500 font-mono text-xs uppercase">/ mois</span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">Pilotage avancé avec IoT et Digital Twin pour PME.</p>
            </div>
            
            <div className="flex-1 space-y-4 mb-8">
              {featuresGlobal.PRO.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-sm text-zinc-100 font-sans font-medium">{feature}</span>
                </div>
              ))}
            </div>
            
            <button 
              disabled={loading || currentPlan === 'PRO'}
              onClick={() => handleCheckout('PRO')}
              className="w-full py-3 px-4 rounded font-mono text-xs uppercase font-bold tracking-widest bg-brand-orange text-black hover:bg-[#f59e0b] transition-colors disabled:opacity-50 shadow-md"
            >
               {currentPlan === 'PRO' ? 'Plan Actuel' : 'Passer en Pro'}
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 flex flex-col hover:border-zinc-700 transition-colors">
            <div className="mb-6 border-b border-zinc-800 pb-6">
              <h3 className="text-lg font-mono font-bold uppercase tracking-widest text-zinc-100 mb-2">Enterprise</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold font-sans">199€</span>
                <span className="text-zinc-500 font-mono text-xs uppercase">/ mois</span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">Solution complète pour les grands parcs immobiliers.</p>
            </div>
            
            <div className="flex-1 space-y-4 mb-8">
              {featuresGlobal.ENTERPRISE.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-zinc-300 font-sans">{feature}</span>
                </div>
              ))}
            </div>
            
            <button 
              disabled={loading || currentPlan === 'ENTERPRISE'}
              onClick={() => handleCheckout('ENTERPRISE')}
              className="w-full py-3 px-4 rounded font-mono text-xs uppercase font-bold tracking-widest border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              {currentPlan === 'ENTERPRISE' ? 'Plan Actuel' : 'Contacter les ventes'}
            </button>
          </div>

        </div>
      )}

      {/* Customer Portal Action */}
      <div className="mt-16 bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-cyan-950 border border-cyan-900 rounded-full flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h4 className="font-mono text-sm font-bold uppercase tracking-wider text-zinc-100 mb-1">Portail Client Sécurisé</h4>
            <p className="text-xs text-zinc-400 font-sans">
              Téléchargez vos factures, modifiez votre moyen de paiement ou résiliez votre abonnement en toute autonomie via l'interface Stripe.
            </p>
          </div>
        </div>
        <button 
          onClick={handlePortal}
          disabled={loading}
          className="flex items-center gap-2 whitespace-nowrap bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-5 py-2.5 rounded font-mono text-xs uppercase font-bold transition-colors cursor-pointer"
        >
          Gérer mon abonnement <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
