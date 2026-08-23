/**
 * webhook.service.js — Service d'envoi de Webhooks (Horizon 2 BeeCarbonat)
 * Permet d'alerter des systèmes tiers (ex: SAP, SRE Slack) lors d'anomalies.
 */

const axios = require('axios'); // Utilisation d'axios si présent, sinon on pourrait utiliser node-fetch natif (Node 18+)

/**
 * Dispatche un événement métier vers une URL webhook cible
 * @param {string} targetUrl - L'URL du partenaire (ex: webhook.site ou connecteur interne)
 * @param {string} eventType - Le type d'événement (ex: 'iot.anomaly.critical')
 * @param {Object} payload - Les données associées à l'événement
 */
async function dispatchWebhook(targetUrl, eventType, payload) {
  if (!targetUrl) {
    console.warn(`[Webhook] Tentative d'envoi ignorée: targetUrl manquante pour l'événement ${eventType}`);
    return;
  }

  const webhookPayload = {
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    eventType,
    timestamp: new Date().toISOString(),
    data: payload,
    source: 'BeeCarbonat-core-engine'
  };

  try {
    // Utiliser l'API fetch native de Node.js >= 18
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'BeeCarbonat-webhook-dispatcher/1.0',
        'X-BeeCarbonat-Signature': 'mock-signature-h2' // A terme, HMAC SHA-256 du payload
      },
      body: JSON.stringify(webhookPayload)
    });

    if (response.ok) {
      console.info(`[Webhook] Event '${eventType}' dispatché avec succès vers ${targetUrl}`);
    } else {
      console.error(`[Webhook] Échec de l'envoi vers ${targetUrl} - HTTP ${response.status}`);
    }
  } catch (error) {
    console.error(`[Webhook] Erreur réseau lors de l'envoi vers ${targetUrl} :`, error.message);
  }
}

module.exports = { dispatchWebhook };
