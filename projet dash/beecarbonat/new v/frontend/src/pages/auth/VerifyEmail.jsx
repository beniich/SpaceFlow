import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuthStore();
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    const verify = async () => {
      if (!token || !email) {
        setStatus('error');
        setErrorMessage('Lien invalide. Demandez un nouvel email.');
        return;
      }

      try {
        await verifyEmail(token);
        setStatus('success');
        setTimeout(() => navigate('/login', { replace: true }), 2000);
      } catch (err) {
        setStatus('error');
        setErrorMessage(err.message || 'Lien expiré ou invalide');
      }
    };

    verify();
  }, [token, email, verifyEmail, navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#000',
      color: 'white',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center', maxWidth: 440, padding: 24 }}>
        {status === 'loading' && (
          <>
            <div className="auth-spinner" style={{ width: 48, height: 48 }} />
            <h2 style={{ marginTop: 24, fontSize: 24 }}>Vérification en cours...</h2>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="auth-verify-icon" style={{ background: 'rgba(76,175,80,0.15)', width: 80, height: 80, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: 36 }}>
              ✓
            </div>
            <h2 style={{ marginTop: 24, fontSize: 24 }}>Email vérifié !</h2>
            <p style={{ color: '#aaa', marginTop: 12 }}>
              Bienvenue chez BEECARBONAT. Redirection en cours...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="auth-verify-icon" style={{ background: 'rgba(255,82,82,0.15)', width: 80, height: 80, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: 36 }}>
              ✕
            </div>
            <h2 style={{ marginTop: 24, fontSize: 24 }}>Lien invalide</h2>
            <p style={{ color: '#aaa', marginTop: 12 }}>{errorMessage}</p>
            <Link
              to="/login"
              style={{
                marginTop: 24,
                display: 'inline-block',
                padding: '12px 24px',
                background: 'white',
                color: 'black',
                borderRadius: 8,
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              Retour à la connexion
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
