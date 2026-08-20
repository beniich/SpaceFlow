import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCrmAuthStore } from '../../store/crmAuthStore';
import { Activity, Building2, User, Mail, Lock, ArrowRight, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CRMSignup() {
  const navigate = useNavigate();
  const { signup, isLoading } = useCrmAuthStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: 'Admin',
    lastName: 'Test',
    email: `admin-${Date.now()}@masociete.com`,
    password: 'password123',
    companyName: 'Ma Societe Inc.'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.companyName) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const success = await signup(formData);
    if (success) {
      toast.success('Compte cree avec succes !');
      navigate('/crm/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans text-zinc-100">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden font-mono text-xs">
        <div className="p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-zinc-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-lg">
              <Activity size={24} />
            </div>
          </div>
          
          <h2 className="text-xl font-bold font-display uppercase tracking-widest text-center text-zinc-50 mb-2">Rejoignez le CRM</h2>
          <p className="text-center text-zinc-400 mb-8 font-mono">
            {step === 1 ? 'Parlez-nous de vous' : 'Sécurisez votre compte'}
          </p>

          <form onSubmit={step === 1 ? handleNext : handleSubmit} className="space-y-5">
            {step === 1 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-zinc-400">Prénom</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-cyan-500"
                        placeholder="Jean"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-zinc-400">Nom</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-cyan-500"
                        placeholder="Dupont"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-zinc-400">Entreprise</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-cyan-500"
                      placeholder="Ma Société Inc."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold uppercase py-3 px-4 transition-colors shadow-md"
                >
                  Continuer <ArrowRight size={18} />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-zinc-400">Email professionnel</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-cyan-500"
                      placeholder="jean@masociete.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-zinc-400">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-cyan-500"
                      placeholder="••••••••"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500">8 caractères minimum</p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3 px-4 border border-zinc-700 text-zinc-400 hover:text-zinc-100 uppercase transition"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-2/3 flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-zinc-950 font-bold uppercase py-3 px-4 transition"
                  >
                    {isLoading ? <Loader className="animate-spin" size={18} /> : 'Créer mon compte'}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
            <p className="text-zinc-400">
              Vous avez déjà un compte ?{' '}
              <Link to="/crm/login" className="text-cyan-400 font-bold hover:underline">
                Connectez-vous
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
