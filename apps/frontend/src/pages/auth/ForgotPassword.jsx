import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import { AuthInput } from '../../components/auth/AuthInput';
import { useAuthStore } from '../../store/authStore';

export default function ForgotPassword() {
  const { forgotPassword } = useAuthStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      showSignup={false}
      marketingTag="Récupération"
      marketingHeadline="On vous aide à récupérer l'accès."
      marketingMeta="Un email sécurisé vous sera envoyé"
    >
      <Link to="/login" className="auth-back-link">
        ← Retour à la connexion
      </Link>

      <h1 className="auth-form-title">Mot de passe oublié ?</h1>

      {success ? (
        <div>
          <div className="auth-success-banner">
            <span>✓</span>
            <span>Email envoyé à {email}</span>
          </div>
          <p style={{ color: 'var(--auth-text-muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
            Si un compte existe avec cette adresse, vous recevrez un lien de réinitialisation
            dans quelques minutes. Pensez à vérifier vos spams.
          </p>
          <Link to="/login" className="auth-button-primary with-arrow" style={{ display: 'flex' }}>
            <span>Retour à la connexion</span>
            <span className="arrow">→</span>
          </Link>
        </div>
      ) : (
        <>
          <p style={{ color: 'var(--auth-text-muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
            Saisissez l'email associé à votre compte. Nous vous enverrons un lien sécurisé pour
            définir un nouveau mot de passe.
          </p>

          {error && (
            <div className="auth-error-banner">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <AuthInput
              type="email"
              label="Email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus
            />

            <button
              type="submit"
              className={`auth-button-primary with-arrow ${loading ? 'loading' : ''}`}
              disabled={loading || !email}
            >
              {loading ? (
                <>
                  <span className="auth-spinner" />
                  <span>Envoi...</span>
                </>
              ) : (
                <>
                  <span>Envoyer le lien de réinitialisation</span>
                  <span className="arrow">→</span>
                </>
              )}
            </button>
          </form>

          <div className="auth-text-center">
            <Link to="/login" className="auth-link">
              Retour à la connexion
            </Link>
          </div>
        </>
      )}
    </AuthLayout>
  );
}
