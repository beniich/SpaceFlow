import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';

import apiRouter from './routes/apiRouter';
import streamRouter from './routes/streamRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { startIotSimulator } from './utils/iotSimulator';
import { execSync } from 'child_process';

// ─── App setup ────────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT ?? '4000';

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000,http://localhost:3001')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin "${origin}" is not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Body parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ─── Health check (unauthenticated) ──────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── SSE stream (unauthenticated — real-time IoT data) ───────────────────────
app.use('/api/stream', streamRouter);

// ─── API routes ───────────────────────────────────────────────────────────────
app.use('/api', apiRouter);

// ─── 404 for unknown routes ───────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found', status: 404 });
});

// ─── Global error handler (must be LAST) ─────────────────────────────────────
app.use(errorHandler);

// ─── Start server ─────────────────────────────────────────────────────────────
async function bootstrap() {
  try {
    // eslint-disable-next-line no-console
    console.log("🚀 Démarrage d'AgroMaître Backend...");

    // eslint-disable-next-line no-console
    console.log("📦 Synchronisation des connaissances agricoles...");
    execSync('npx prisma db seed', { stdio: 'inherit' });

    app.listen(Number(PORT), () => {
      // eslint-disable-next-line no-console
      console.log(`📡 Serveur actif sur le port ${PORT}`);
      // eslint-disable-next-line no-console
      console.log('✅ Système expert agricole opérationnel');
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log(`   Health: http://localhost:${PORT}/health`);
        // eslint-disable-next-line no-console
        console.log(`   API:    http://localhost:${PORT}/api`);
        // eslint-disable-next-line no-console
        console.log(`   Stream: http://localhost:${PORT}/api/stream`);
      }

      // Start the IoT simulator after server is ready
      startIotSimulator();
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('💥 Erreur fatale au démarrage:', error);
    process.exit(1);
  }
}

bootstrap();

export default app;
