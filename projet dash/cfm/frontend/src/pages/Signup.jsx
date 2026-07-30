import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Mail, Lock, User, Building, Loader2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Signup() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '', lastName: '', companyName: '', email: '', password: ''
  });
  const { signup, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(form);
      toast.success('🎉 Bienvenue ! Votre essai gratuit de 14 jours est activé.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur lors de l\'inscription');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-indigo-700 to-purple-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
        {/* Progress */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-primary-600 text-white' : 'bg-slate-200'
            }`}>1</div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary-600' : 'bg-slate-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-primary-600 text-white' : 'bg-slate-200'
            }`}>2</div>
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">
            {step === 1 ? 'Créer votre compte' : 'Sécuriser votre accès'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            14 jours d'essai gratuit • Aucune carte requise
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700">Prénom</label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      required
                      value={form.firstName}
                      onChange={e => setForm({...form, firstName: e.target.value})}
                      className="w-full pl-9 pr-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Nom</label>
                  <input
                    required
                    value={form.lastName}
                    onChange={e => setForm({...form, lastName: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Entreprise</label>
                <div className="relative mt-1">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    required
                    value={form.companyName}
                    onChange={e => setForm({...form, companyName: e.target.value})}
                    className="w-full pl-9 pr-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Email professionnel</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full pl-9 pr-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!form.firstName || !form.lastName || !form.email || !form.companyName}
                className="w-full bg-primary-600 text-white py-2.5 rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                Continuer →
              </button>
            </>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium text-slate-700">Mot de passe</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})}
                    className="w-full pl-9 pr-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="mt-2 space-y-1 text-xs">
                  {[
                    { test: form.password.length >= 8, label: 'Au moins 8 caractères' },
                    { test: /[A-Z]/.test(form.password), label: 'Une majuscule' },
                    { test: /[0-9]/.test(form.password), label: 'Un chiffre' }
                  ].map((r, i) => (
                    <div key={i} className={`flex items-center gap-1 ${r.test ? 'text-green-600' : 'text-slate-400'}`}>
                      <Check className="w-3 h-3" /> {r.label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border py-2.5 rounded-lg"
                >
                  ← Retour
                </button>
                <button
                  type="submit"
                  disabled={loading || form.password.length < 8}
                  className="flex-1 bg-primary-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Créer mon compte'}
                </button>
              </div>
            </>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Déjà un compte ? <Link to="/login" className="text-primary-600 font-medium">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
