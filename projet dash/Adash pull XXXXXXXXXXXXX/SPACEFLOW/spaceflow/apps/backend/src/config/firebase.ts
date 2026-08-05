import admin from 'firebase-admin';
import { logger } from './logger';

let initialized = false;

function initializeFirebase() {
  if (initialized) return admin;

  if (!process.env.FIREBASE_PROJECT_ID || 
      !process.env.FIREBASE_CLIENT_EMAIL || 
      !process.env.FIREBASE_PRIVATE_KEY) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('❌ Firebase credentials required in production');
    }
    logger.warn('⚠️  Firebase not configured - auth will not work');
    return null;
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    initialized = true;
    logger.info('✅ Firebase Admin initialized');
    return admin;
  } catch (err) {
    logger.error('❌ Firebase init error:', err);
    throw err;
  }
}

initializeFirebase();

export { admin as firebaseAdmin };