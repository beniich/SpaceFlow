import { Router, Request, Response } from 'express';
import { addSSEClient, removeSSEClient } from '../utils/iotSimulator';

const streamRouter = Router();

/**
 * GET /api/stream
 * Server-Sent Events endpoint — no auth required for dashboard monitoring.
 * The client opens a persistent connection and receives real-time node states and logs.
 */
streamRouter.get('/', (req: Request, res: Response) => {
  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // disable Nginx buffering
  res.flushHeaders();

  // Send a connection-established comment every 15s as keepalive
  const keepalive = setInterval(() => {
    res.write(': keepalive\n\n');
  }, 15000);

  // Register this client to receive broadcasts
  const send = (payload: object) => {
    const { event, data } = payload as { event: string; data: object };
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  addSSEClient(send);

  // Immediately send current state snapshot
  res.write(`event: connected\n`);
  res.write(`data: ${JSON.stringify({ message: 'AgroMaître SSE connected' })}\n\n`);

  // Clean up when client disconnects
  req.on('close', () => {
    clearInterval(keepalive);
    removeSSEClient(send);
  });
});

export default streamRouter;
