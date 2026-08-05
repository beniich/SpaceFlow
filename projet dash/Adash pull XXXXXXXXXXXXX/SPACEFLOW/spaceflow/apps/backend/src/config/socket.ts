import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { logger } from './logger';

export let io: SocketIOServer;

export const initSocket = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: (process.env.APP_URL || 'http://localhost:5173').split(',').map(o => o.trim()),
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      // Attach orgId and userId to the socket
      socket.data.userId = decoded.userId;
      socket.data.organizationId = decoded.organizationId;
      
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const orgId = socket.data.organizationId;
    
    // Rejoindre la room de son organisation
    socket.join(`org_${orgId}`);
    logger.info(`🔌 Socket connected: User ${socket.data.userId} joined org_${orgId}`);

    socket.on('disconnect', () => {
      logger.info(`🔌 Socket disconnected: User ${socket.data.userId}`);
    });
  });

  return io;
};

/**
 * Envoie un événement à toute une organisation
 */
export const notifyOrganization = (organizationId: string, event: string, payload: any) => {
  if (io) {
    io.to(`org_${organizationId}`).emit(event, payload);
  }
};
