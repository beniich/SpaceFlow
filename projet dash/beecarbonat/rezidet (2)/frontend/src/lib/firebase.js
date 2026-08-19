/**
 * firebase.js — Périmètre restreint : Google Sign-In + Cloud Messaging uniquement.
 * Firebase Auth est conservé UNIQUEMENT pour le flux Google OAuth → échange idToken → JWT backend.
 * Firebase Auth comme provider primaire est désactivé : toute session est gérée par JWT backend.
 * Firestore est supprimé (remplacé par l'API REST).
 */
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Singleton : éviter double-initialisation en HMR
export const firebaseApp = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

export const firebaseAuth = getAuth(firebaseApp);

// ─── Google Provider (périmètre minimal) ──────────────────────────────────────
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Google Sign-In → retourne l'idToken Firebase pour échange côté backend.
 * Le backend renvoie un JWT applicatif ; Firebase n'est pas la session de référence.
 */
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(firebaseAuth, googleProvider);
  const idToken = await result.user.getIdToken();
  return { user: result.user, idToken };
};

/**
 * Déconnexion Firebase (nettoie le cookie Google OAuth local).
 */
export const firebaseSignOut = () => signOut(firebaseAuth);

/**
 * Écoute le changement d'état Firebase (utilisé uniquement pour détecter
 * la révocation du token Google côté client).
 */
export const onFirebaseAuthStateChanged = (callback) => {
  return firebaseAuth.onAuthStateChanged(callback);
};

// ─── Cloud Messaging ──────────────────────────────────────────────────────────
// Chargement dynamique pour éviter d'alourdir le bundle initial.
export const getMessaging = async () => {
  const { getMessaging: fbGetMessaging, getToken, onMessage } = await import('firebase/messaging');
  return { messaging: fbGetMessaging(firebaseApp), getToken, onMessage };
};

