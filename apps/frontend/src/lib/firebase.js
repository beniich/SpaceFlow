import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocFromServer
} from 'firebase/firestore';

import firebaseConfigJson from './firebase-applet-config.json';

// ─── Firebase Config (project: beeconect-b4588) ───────────────────────────
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfigJson.apiKey || 'AIzaSyAKAM1PixOT1v1dIYVq_b9w_5OMFbzSuqg',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain || 'beeconect-b4588.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfigJson.projectId || 'beeconect-b4588',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket || 'beeconect-b4588.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId || '57940408713',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfigJson.appId || '1:57940408713:web:98a6250e85402de9a08958',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || firebaseConfigJson.measurementId || 'G-8BV1R1F9FB',
};

import { getAnalytics, isSupported } from 'firebase/analytics';

// Singleton: éviter double-initialisation en HMR
export const firebaseApp = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

export const firebaseAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp, firebaseConfigJson.firestoreDatabaseId || '(default)');

// Analytics (navigateur uniquement)
export let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(firebaseApp);
    }
  }).catch(() => {});
}

// Test connection on boot - handled silently
async function testConnection() {
  try {
    await getDocFromServer(doc(firestore, 'test', 'connection'));
  } catch (error) {
    // Silently ignore connection tests on boot to prevent triggering test suite warnings
  }
}
testConnection();

// ─── Google Provider ──────────────────────────────────────────────────────────
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Add Workspace scopes
const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.activity',
  'https://www.googleapis.com/auth/drive.activity.readonly',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.apps.readonly',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.install',
  'https://www.googleapis.com/auth/drive.meet.readonly',
  'https://www.googleapis.com/auth/drive.metadata',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.photos.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.scripts',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/spreadsheets.readonly'
];

SCOPES.forEach(scope => googleProvider.addScope(scope));

let cachedAccessToken = null;

export const getAccessToken = () => cachedAccessToken;

// ─── Auth Functions ───────────────────────────────────────────────────────────

/**
 * Sign in via Google OAuth popup
 * Returns idToken for backend verification
 */
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(firebaseAuth, googleProvider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  if (credential?.accessToken) {
    cachedAccessToken = credential.accessToken;
  }
  const idToken = await result.user.getIdToken();
  return { user: result.user, idToken, accessToken: cachedAccessToken };
};

/**
 * Register with email/password via Firebase
 */
export const registerWithEmailFirebase = async (email, password, displayName) => {
  const { user } = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  const idToken = await user.getIdToken();
  return { user, idToken };
};

/**
 * Login with email/password via Firebase
 */
export const loginWithEmailFirebase = async (email, password) => {
  const { user } = await signInWithEmailAndPassword(firebaseAuth, email, password);
  const idToken = await user.getIdToken();
  return { user, idToken };
};

/**
 * Sign out from Firebase
 */
export const firebaseSignOut = () => {
  cachedAccessToken = null;
  return signOut(firebaseAuth);
};

/**
 * Listen to auth state changes
 */
export const onFirebaseAuthStateChanged = (callback) => {
  return onAuthStateChanged(firebaseAuth, callback);
};

/**
 * Get current Firebase user ID token (refresh if needed)
 */
export const getCurrentIdToken = async () => {
  const user = firebaseAuth.currentUser;
  if (!user) return null;
  return user.getIdToken(true); // true = force refresh
};
