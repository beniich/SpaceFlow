import "dotenv/config";
import express from 'express';
import cors from 'cors';
import { apiRouter } from '../src/server/routes/api';
import { prisma } from '../src/lib/prisma';

const app = express();

app.use(cors());
app.use(express.json());

// Mount Structured API Router
app.use('/api', apiRouter);

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV });
});

// For Vercel, we export the app as a handler
export default app;
