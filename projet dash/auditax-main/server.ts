import "dotenv/config";
import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { apiRouter } from './src/server/routes/api';
import { prisma } from './src/lib/prisma';
import { WSManager } from './src/server/lib/ws';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Global Middlewares
  app.use(cors());
  app.use(express.json());

  // Mount Structured API Router
  app.use('/api', apiRouter);

  // Initial Seed Logic (Enterprise Context)
  const orgId = 'global-org-placeholder';
  
  // 1. Ensure Organization
  let org = await prisma.organization.findUnique({ where: { id: orgId } });
  if (!org) {
    org = await prisma.organization.create({
      data: {
        id: orgId,
        name: 'AuditMaster Enterprise Demo',
        domain: 'demo.auditmaster.io'
      }
    });
  }

  // 2. Ensure Audit Template
  const seedTemplateId = 'tpl-safety';
  const existingTemplate = await prisma.auditTemplate.findUnique({ where: { id: seedTemplateId } });
  if (!existingTemplate) {
    await prisma.auditTemplate.create({
      data: {
        id: seedTemplateId,
        title: 'Audit de Sécurité Industrielle',
        description: 'Contrôle trimestriel de conformité HSE et protection incendie.',
        version: 1,
        content: [
          {
            id: 'sec-1',
            title: 'Équipements de Protection Individuelle (EPI)',
            questions: [
              { id: 'q1', text: 'Le port du casque est-il respecté en zone A ?', type: 'YES_NO', weight: 10, required: true },
              { id: 'q2', text: 'État des stocks de gants anti-coupures', type: 'SCORE', weight: 5, required: true },
              { id: 'q3', text: 'Capturez une photo de la signalétique EPI à l\'entrée', type: 'IMAGE', weight: 2, required: false }
            ]
          }
        ]
      }
    });
  }

  // 3. Seed Infrastructure Nodes
  const nodeCount = await prisma.networkNode.count({ where: { organizationId: orgId } });
  if (nodeCount === 0) {
    await prisma.networkNode.createMany({
      data: [
        { name: 'HUB-ALPHA-01', region: 'Frankfurt', type: 'API_GATEWAY', status: 'HEALTHY', organizationId: orgId },
        { name: 'NODE-FRA-04', region: 'Frankfurt', type: 'DATABASE', status: 'DEGRADED', organizationId: orgId },
        { name: 'NODE-LON-01', region: 'London', type: 'VIRTUAL_MACHINE', status: 'HEALTHY', organizationId: orgId }
      ]
    });
  }

  // 4. Seed Policies
  const policyCount = await prisma.policy.count({ where: { organizationId: orgId } });
  if (policyCount === 0) {
    const policy = await prisma.policy.create({
      data: {
        organizationId: orgId,
        title: 'ISO-27001 Information Security',
        framework: 'ISO-27001',
        content: 'Standard for information security management systems.'
      }
    });
    
    await prisma.control.createMany({
      data: [
        { policyId: policy.id, name: 'Access Control', description: 'Ensure only authorized users have access.', frequency: 'CONTINUOUS', status: 'COMPLIANT' },
        { policyId: policy.id, name: 'Backup Policy', description: 'Daily backups of critical data.', frequency: 'DAILY', status: 'NON_COMPLIANT' }
      ]
    });
  }

  // Vite middleware setup for Frontend
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Enterprise AuditMaster Backend running on http://localhost:${PORT}`);
  });

  // Initialize WebSockets
  WSManager.initialize(server);

  // Centralized Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled Error:', err);
    res.status(err.status || 500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
    });
  });
}

startServer().catch(console.error);
