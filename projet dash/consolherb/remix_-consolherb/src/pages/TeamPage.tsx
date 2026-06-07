import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  UserPlus, Mail, Shield, UserX, CheckCircle,
  AlertCircle, ShieldCheck, Sparkles
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { usePlan } from '../hooks/usePlan';
import { TeamMember, UserRole } from '../types';
import FeatureGate from '../components/ui/FeatureGate';

export default function TeamPage() {
  const { teamMembers, addTeamMember, removeTeamMember, updateTeamMember, addLog } = useStore();
  const { plan, canAddUser, userLimit } = usePlan();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('viewer');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    if (!canAddUser) {
      alert(`Limite d'utilisateurs atteinte pour le plan actuel (${userLimit} max). Veuillez mettre à niveau votre plan.`);
      return;
    }

    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name,
      email,
      role,
      joinedAt: new Date().toISOString().split('T')[0],
      status: 'invited',
    };

    addTeamMember(newMember);
    addLog('success', `👥 Invitation envoyée à ${email} avec le rôle ${role.toUpperCase()}.`);
    
    // Reset inputs
    setName('');
    setEmail('');
    setRole('viewer');
  };

  const handleRemove = (id: string, name: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${name} de l'équipe ?`)) {
      removeTeamMember(id);
      addLog('warn', `👥 Membre de l'équipe ${name} révoqué.`);
    }
  };

  const handleRoleChange = (id: string, newRole: UserRole) => {
    updateTeamMember(id, { role: newRole });
    addLog('info', `👥 Rôle mis à jour.`);
  };

  return (
    <FeatureGate feature="team" message="La gestion d'équipe multi-utilisateurs professionnelle nécessite le plan ELITE.">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-white">Gestion de l'Équipe & Multi-utilisateurs</h1>
          <p className="text-slate-400 text-xs mt-1">
            Gérez les collaborateurs, invitez des agronomes ou des gestionnaires, et définissez leurs niveaux d'accès.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Members Table */}
          <div className="lg:col-span-2 bg-[#0d1c2d] border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Membres Actifs & Invitations</h2>
              <span className="text-xs text-slate-500 font-semibold">
                {teamMembers.length} / {userLimit === Infinity ? 'Illimités' : `${userLimit} max`}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 font-semibold uppercase tracking-wider pb-3">
                    <th className="pb-3">Collaborateur</th>
                    <th className="pb-3">Rôle</th>
                    <th className="pb-3">Date d'inscription</th>
                    <th className="pb-3">Statut</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {teamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-slate-200">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white">{member.name}</p>
                          <p className="text-[10px] text-slate-500">{member.email}</p>
                        </div>
                      </td>
                      <td className="py-4">
                        <select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.id, e.target.value as UserRole)}
                          disabled={member.role === 'owner'}
                          className="bg-slate-800 text-slate-200 text-xs rounded border border-white/10 px-2 py-1 outline-none focus:border-amber-500 disabled:opacity-50"
                        >
                          <option value="admin">Administrateur</option>
                          <option value="manager">Gestionnaire</option>
                          <option value="viewer">Observateur</option>
                          {member.role === 'owner' && <option value="owner">Propriétaire</option>}
                        </select>
                      </td>
                      <td className="py-4 text-slate-400">{member.joinedAt}</td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          member.status === 'active'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : member.status === 'invited'
                              ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                              : 'bg-slate-500/10 border-slate-500/20 text-slate-400'
                        }`}>
                          {member.status === 'active' ? 'Actif' : 'Invité'}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        {member.role !== 'owner' && (
                          <button
                            onClick={() => handleRemove(member.id, member.name)}
                            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Révoquer l'accès"
                          >
                            <UserX size={15} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invitation Form */}
          <div className="bg-[#0d1c2d] border border-white/10 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <UserPlus size={16} className="text-amber-500" /> Inviter un collaborateur
            </h2>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1.5">Nom complet</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex. Youssef Karam"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1.5">Adresse email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="y.karam@agromatre.io"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1.5">Rôle d'accès</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="admin">Administrateur (Tous droits sauf facturation)</option>
                  <option value="manager">Gestionnaire (Édition des cultures)</option>
                  <option value="viewer">Observateur (Lecture seule)</option>
                </select>
              </div>

              {!canAddUser && (
                <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-[10px] font-bold">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>Quota max atteint. Veuillez mettre à niveau.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!canAddUser}
                className="w-full py-3 bg-white hover:bg-slate-200 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
              >
                Envoyer l'invitation
              </button>
            </form>
          </div>
        </div>

        {/* Roles details card */}
        <div className="bg-[#0d1c2d] border border-white/10 rounded-2xl p-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" /> Guide des rôles de sécurité
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
            <div>
              <p className="font-bold text-white mb-1">Administrateur</p>
              <p className="text-slate-500">Accès total aux tableaux de bord, ajout/suppression de capteurs, gestion des logs, simulation d'attaques et gestion d'équipe.</p>
            </div>
            <div>
              <p className="font-bold text-white mb-1">Gestionnaire</p>
              <p className="text-slate-500">Ajout de zones, édition des cultures, consultation de l'assistant IA. Ne peut pas supprimer des rapports d'audit ou révoquer des membres.</p>
            </div>
            <div>
              <p className="font-bold text-white mb-1">Observateur</p>
              <p className="text-slate-500">Consultation des données télémétriques et géolocalisation. Ne peut faire aucune modification ni utiliser les outils avancés.</p>
            </div>
          </div>
        </div>
      </div>
    </FeatureGate>
  );
}
