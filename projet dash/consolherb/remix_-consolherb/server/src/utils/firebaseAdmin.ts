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

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      // Replace escaped newline characters from the env variable
      privateKey: privateKey.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

export const firebaseAuth = admin.auth();
export default admin;
