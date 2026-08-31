/**
 * Crypto Service — Web Crypto API (AES-GCM 256-bit + PBKDF2)
 * Assure le chiffrement des données locales stockées dans IndexedDB (Encryption-at-Rest)
 */

const SALT = new TextEncoder().encode('beecarbonat_enterprise_local_salt_v1');
const ITERATIONS = 100000;
let cachedKey = null;

/**
 * Dérive une CryptoKey AES-GCM à partir du token ou mot de passe de session
 * @param {string} secret
 * @returns {Promise<CryptoKey>}
 */
export async function getDerivedKey(secret = 'beecarbonat-default-session-fallback') {
  if (cachedKey) return cachedKey;

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  cachedKey = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: SALT,
      iterations: ITERATIONS,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  return cachedKey;
}

/**
 * Réinitialise la clé de chiffrement lors d'une déconnexion
 */
export function clearCryptoKey() {
  cachedKey = null;
}

/**
 * Chiffre un objet JSON en chaîne base64 avec IV
 * @param {any} data
 * @param {string} [secret]
 * @returns {Promise<{ iv: string, cipherText: string }>}
 */
export async function encryptData(data, secret) {
  try {
    const key = await getDerivedKey(secret);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(JSON.stringify(data));

    const encryptedContent = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encodedData
    );

    return {
      iv: btoa(String.fromCharCode(...iv)),
      cipherText: btoa(String.fromCharCode(...new Uint8Array(encryptedContent)))
    };
  } catch (err) {
    console.warn('[Crypto] Encryption error, fallback to raw data:', err);
    return data;
  }
}

/**
 * Déchiffre une charge utile { iv, cipherText }
 * @param {{ iv: string, cipherText: string } | any} encryptedPayload
 * @param {string} [secret]
 * @returns {Promise<any>}
 */
export async function decryptData(encryptedPayload, secret) {
  if (!encryptedPayload || !encryptedPayload.iv || !encryptedPayload.cipherText) {
    return encryptedPayload; // Non chiffré ou format brut
  }

  try {
    const key = await getDerivedKey(secret);
    const iv = Uint8Array.from(atob(encryptedPayload.iv), c => c.charCodeAt(0));
    const cipherBytes = Uint8Array.from(atob(encryptedPayload.cipherText), c => c.charCodeAt(0));

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      cipherBytes
    );

    const decoded = new TextDecoder().decode(decryptedBuffer);
    return JSON.parse(decoded);
  } catch (err) {
    console.error('[Crypto] Decryption error:', err);
    return null;
  }
}
