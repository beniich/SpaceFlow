const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

// Configuration de l'exportateur (à adapter selon le backend choisi: Jaeger, Datadog, etc.)
const traceExporter = new OTLPTraceExporter({
  url: process.env.OTLP_TRACE_URL || 'http://localhost:4318/v1/traces',
  headers: {}
});

const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      // Désactiver certaines instrumentations si elles sont trop verbeuses
      '@opentelemetry/instrumentation-fs': { enabled: false },
    })
  ]
});

// Initialiser le SDK si l'observabilité est activée (par défaut en prod ou si forcé)
if (process.env.NODE_ENV === 'production' || process.env.ENABLE_OTEL === 'true') {
  sdk.start();
  console.log('OpenTelemetry initialisé.');

  // Gestion de l'arrêt propre
  process.on('SIGTERM', () => {
    sdk.shutdown()
      .then(() => console.log('OpenTelemetry arrêté proprement'))
      .catch((error) => console.log('Erreur lors de l\'arrêt d\'OpenTelemetry', error))
      .finally(() => process.exit(0));
  });
}

module.exports = { sdk };
