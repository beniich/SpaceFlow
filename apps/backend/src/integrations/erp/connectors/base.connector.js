const crypto = require('crypto');

/**
 * Interface commune pour tous les connecteurs ERP
 * Pattern Strategy pour supporter SAP, Oracle, Dynamics, Odoo
 */
class BaseERPConnector {
  constructor(config) {
    this.config = config;
    this.token = null;
    this.tokenExpires = null;
  }

  // ============== MÉTHODES ABSTRAITES ==============
  async authenticate() {
    throw new Error('authenticate() must be implemented');
  }

  async fetchAssets(filters = {}) {
    throw new Error('fetchAssets() must be implemented');
  }

  async fetchWorkOrders(filters = {}) {
    throw new Error('fetchWorkOrders() must be implemented');
  }

  async pushWorkOrder(workOrder) {
    throw new Error('pushWorkOrder() must be implemented');
  }

  async fetchInvoices(filters = {}) {
    throw new Error('fetchInvoices() must be implemented');
  }

  async testConnection() {
    throw new Error('testConnection() must be implemented');
  }

  // ============== HELPERS COMMUNS ==============
  
  async ensureAuthenticated() {
    if (!this.token || (this.tokenExpires && Date.now() > this.tokenExpires)) {
      await this.authenticate();
    }
    return this.token;
  }

  async withRetry(operation, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        if (error.response?.status === 429 || error.response?.status >= 500) {
          await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
        } else {
          throw error;
        }
      }
    }
  }

  // Chiffrement simple des credentials
  encrypt(text) {
    if (!text) return '';
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'cafm-encryption-key-32-chars-here', 'salt', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  decrypt(encryptedData) {
    if (!encryptedData) return '';
    if (!encryptedData.includes(':')) return encryptedData; // Fallback si non chiffré
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'cafm-encryption-key-32-chars-here', 'salt', 32);
    const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

module.exports = BaseERPConnector;
