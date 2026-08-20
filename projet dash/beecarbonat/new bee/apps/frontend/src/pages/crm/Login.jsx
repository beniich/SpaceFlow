import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCrmAuthStore } from '../../store/crmAuthStore';
import { Activity, Mail, Lock, LogIn, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useFirebaseAuth } from '../../hooks/useFirebaseAuth';

// Icône Google SVG
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default function CRMLogin() {
  const navigate = useNavigate();
  const { login, isLoading } = useCrmAuthStore();
  const { loginWithGoogle, loading: googleLoading, error: googleError } = useFirebaseAuth();
  const [formData, setFormData] = useState({ 
    email: 'admin@masociete.com', 
    password: 'password123' 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    const success = await login(formData.email, formData.password);
    if (success) navigate('/crm/dashboard');
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success('Connexion Google réussie !');
      navigate('/crm/dashboard');
    } catch (err) {
      toast.error(err.message || 'Erreur Google Sign-In');
    }
  };

  const isAnyLoading = isLoading || googleLoading;

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans text-zinc-100">
      <div className="w-full max-w-md relative z-10 font-mono text-xs">
        <div className="bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 p-8">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-zinc-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-lg">
              <Activity size={24} />
            </div>
          </div>

          <h2 className="text-xl font-bold font-display uppercase tracking-widest text-center text-zinc-50 mb-1">Bienvenue</h2>
          <p className="text-center text-zinc-400 text-xs mb-8 font-mono">Connectez-vous à votre espace CRM</p>

          {/* Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isAnyLoading}
            className="w-full flex items-center justify-center gap-3 bg-zinc-950 border border-zinc-700 hover:bg-zinc-800 text-zinc-200 font-bold uppercase py-3 px-4 transition mb-4 disabled:opacity-50"
          >
            {googleLoading ? <Loader className="animate-spin" size={18} /> : <GoogleIcon />}
            <span>Continuer avec Google</span>
          </button>

          {/* Séparateur */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">ou par email</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-mono">Email professionnel</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="email"
                  name="email"
                  id="crm-email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-cyan-500 text-xs"
                  placeholder="jean@masociete.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-zinc-400 font-mono">Mot de passe</label>
                <a href="#" className="text-[10px] text-cyan-400 hover:underline uppercase">
                  Oublié ?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="password"
                  name="password"
                  id="crm-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-cyan-500 text-xs"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAnyLoading}
              id="crm-submit-login"
              className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-zinc-950 font-bold uppercase py-3 px-4 transition mt-2"
            >
              {isLoading ? <Loader className="animate-spin" size={18} /> : <><LogIn size={18} /> Se connecter</>}
            </button>
          </form>

          <div className="mt-7 pt-5 border-t border-zinc-800/80 text-center">
            <p className="text-zinc-400">
              Pas encore de compte ?{' '}
              <Link to="/crm/signup" className="text-cyan-400 font-bold hover:underline">
                Inscrivez-vous gratuitement
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
