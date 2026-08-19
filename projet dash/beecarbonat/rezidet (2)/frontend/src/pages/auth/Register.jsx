import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import AuthLayout from '../../components/auth/AuthLayout';
import SocialButtons from '../../components/auth/SocialButtons';
import { AuthInput } from '../../components/auth/AuthInput';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const { register, loginWithGoogleFirebase, checkPasswordStrength } = useAuthStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(true);

  const passwordStrength = checkPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!acceptTerms) {
      setError('Vous devez accepter les conditions d\'utilisation');
      return;
    }

    if (passwordStrength.score < 3) {
      setError('Mot de passe trop faible. ' + passwordStrength.feedback.join(', '));
      return;
    }

    setLoading(true);
    try {
      await register({ email, password, firstName, lastName });
      toast.success('Inscription réussie ! Vérifiez votre email.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogleFirebase();
      navigate('/');
    } catch (err) {
      setError(err.message || 'Erreur Google SignIn');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      showSignup={true}
      signupLink="/login"
      legalText={null}
      marketingTag="BEECARBONAT CONNECT 2026"
      marketingHeadline="Là où les bâtisseurs d'infrastructures se connectent."
      marketingMeta="October 19–21, 2026 · Moscone West, San Francisco"
    >
      <h1 className="auth-form-title">Créez votre compte</h1>

      <SocialButtons
        onGoogle={handleGoogle}
        disabled={loading}
      />

      <div className="auth-divider">ou avec votre email</div>

      {error && (
        <div className="auth-error-banner">
          <span>⚠</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="auth-name-row">
          <AuthInput
            label="Prénom"
            placeholder="Jean"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoComplete="given-name"
          />
          <AuthInput
            label="Nom"
            placeholder="Dupont"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            autoComplete="family-name"
          />
        </div>

        <AuthInput
          type="email"
          label="Email professionnel"
          placeholder="vous@entreprise.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <AuthInput
          type="password"
          label="Mot de passe"
          placeholder="Minimum 8 caractères"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          showPasswordToggle
          hint={passwordStrength.feedback[0] || '✓ Mot de passe sécurisé'}
        />

        {password && (
          <>
            <div className="auth-password-strength">
              <div className={`auth-password-strength-fill ${passwordStrength.label}`} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--auth-text-muted)', marginTop: 4, marginBottom: 16 }}>
              Force : <strong style={{ textTransform: 'uppercase', color:
                passwordStrength.label === 'weak' ? 'var(--auth-error)' :
                passwordStrength.label === 'medium' ? 'var(--auth-orange)' : 'var(--auth-success)'
              }}>{passwordStrength.label}</strong>
            </div>
          </>
        )}

        <label className="auth-checkbox-group">
          <input
            type="checkbox"
            className="auth-checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            required
          />
          <span className="auth-checkbox-label">
            J'accepte les <a href="/terms">conditions d'utilisation</a> et la{' '}
            <a href="/privacy">politique de confidentialité</a> de BEECARBONAT.
          </span>
        </label>

        <label className="auth-checkbox-group">
          <input
            type="checkbox"
            className="auth-checkbox"
            checked={newsletter}
            onChange={(e) => setNewsletter(e.target.checked)}
          />
          <span className="auth-checkbox-label">
            Recevoir les actualités et mises à jour du produit.
          </span>
        </label>

        <button
          type="submit"
          className={`auth-button-primary with-arrow ${loading ? 'loading' : ''}`}
          disabled={loading || !email || !password || !firstName || !lastName}
        >
          {loading ? (
            <>
              <span className="auth-spinner" />
              <span>Création en cours...</span>
            </>
          ) : (
            <>
              <span>Créer mon compte</span>
              <span className="arrow">→</span>
            </>
          )}
        </button>
      </form>

      <div className="auth-text-center">
        Vous avez déjà un compte ?{' '}
        <Link to="/login" className="auth-link">
          Se connecter
        </Link>
      </div>
    </AuthLayout>
  );
}
