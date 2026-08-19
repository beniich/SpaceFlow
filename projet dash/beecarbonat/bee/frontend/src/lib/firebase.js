/**
 * firebase.js — Init lazy & défensive
 * Firebase Auth conservé UNIQUEMENT pour le flux Google OAuth → idToken → JWT backend.
 * ✅ L'app ne crashe PAS si les variables VITE_FIREBASE_* sont manquantes.
 */
import { getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from 'firebase/auth';

// ─── Validation de la config ──────────────────────────────────────────────────
const REQUIRED_FIREBASE_FIELDS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
];

function isFirebaseConfigValid() {
  const missing = REQUIRED_FIREBASE_FIELDS.filter(
    (key) => !import.meta.env[key] || import.meta.env[key] === 'undefined'
  );
  if (missing.length > 0) {
    console.warn(
      `[Firebase] Configuration incomplète — clés manquantes: ${missing.join(', ')}.\n` +
      'Google Sign-In et Push Notifications désactivés.'
    );
    return false;
  }
  return true;
}

// ─── Initialisation Singleton (lazy + défensive) ──────────────────────────────
let _firebaseApp = null;
let _firebaseAuth = null;
let _firebaseEnabled = false;

function initFirebase() {
  if (_firebaseApp) return _firebaseApp;

  if (!isFirebaseConfigValid()) {
    _firebaseEnabled = false;
    return null;
  }

  try {
    const firebaseConfig = {
      apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId:             import.meta.env.VITE_FIREBASE_APP_ID,
    };

    _firebaseApp = getApps().length === 0
      ? initializeApp(firebaseConfig)
      : getApps()[0];

    _firebaseAuth = getAuth(_firebaseApp);
    _firebaseEnabled = true;

    console.log('[Firebase] ✅ Initialisé avec succès');
    return _firebaseApp;
  } catch (error) {
    console.error('[Firebase] ❌ Erreur d\'initialisation:', error?.message);
    _firebaseEnabled = false;
    return null;
  }
}

// ─── API Publique ─────────────────────────────────────────────────────────────
export const firebaseApp = initFirebase();
export const firebaseAuth = _firebaseAuth;
export const isFirebaseEnabled = () => _firebaseEnabled;

// ─── Google Provider ──────────────────────────────────────────────────────────
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Google Sign-In → retourne l'idToken Firebase pour échange côté backend.
 * ✅ Lève une erreur claire si Firebase n'est pas configuré.
 */
export const signInWithGoogle = async () => {
  if (!_firebaseEnabled || !_firebaseAuth) {
    throw new Error(
      'Google Sign-In non disponible : Firebase non configuré. ' +
      'Vérifiez vos variables VITE_FIREBASE_* dans le fichier .env'
    );
  }
  const result = await signInWithPopup(_firebaseAuth, googleProvider);
  const idToken = await result.user.getIdToken();
  return { user: result.user, idToken };
};

/**
 * Déconnexion Firebase (nettoie le cookie Google OAuth local).
 * ✅ No-op si Firebase non configuré.
 */
export const firebaseSignOut = () => {
  if (!_firebaseEnabled || !_firebaseAuth) return Promise.resolve();
  return signOut(_firebaseAuth);
};

/**
 * Écoute le changement d'état Firebase.
 * ✅ Retourne un no-op unsubscribe si Firebase non configuré.
 */
export const onFirebaseAuthStateChanged = (callback) => {
  if (!_firebaseEnabled || !_firebaseAuth) {
    return () => {}; // no-op unsubscribe
  }
  return _firebaseAuth.onAuthStateChanged(callback);
};

// ─── Cloud Messaging (lazy) ───────────────────────────────────────────────────
export const getMessaging = async () => {
  if (!_firebaseEnabled || !_firebaseApp) {
    console.warn('[Firebase] Push Notifications non disponibles (Firebase non configuré)');
    return null;
  }
  try {
    const { getMessaging: fbGetMessaging, getToken, onMessage } = await import('firebase/messaging');
    return { messaging: fbGetMessaging(_firebaseApp), getToken, onMessage };
  } catch (error) {
    console.error('[Firebase] Erreur chargement Cloud Messaging:', error?.message);
    return null;
  }
};
