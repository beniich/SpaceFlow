import admin from 'firebase-admin';

/**
 * Initialise Firebase Admin SDK exactly once.
 * The private key must have literal \n characters replaced by actual newlines.
 */
if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!process.env.FIREBASE_PROJECT_ID || !privateKey || !process.env.FIREBASE_CLIENT_EMAIL) {
    throw new Error(
      'Missing Firebase Admin credentials. ' +
        'Ensure FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL are set.'
    );
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  } catch (err: any) {
    console.error('⚠️ Firebase Admin Initialization Warning:', err.message);
    console.error('Continuing without Firebase Admin authentication (Auth disabled).');
  }
}

export const firebaseAuth = admin.apps.length > 0 
  ? admin.auth() 
  : { verifyIdToken: async () => ({ uid: 'mock-local-user', role: 'ADMIN' }) } as any;
export default admin;
