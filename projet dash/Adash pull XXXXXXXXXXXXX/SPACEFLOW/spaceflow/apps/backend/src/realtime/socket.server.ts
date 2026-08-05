import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { verifyToken } from '../utils/jwt';
import { logger } from '../config/logger';

let io: Server | null = null;

export const initializeSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: { origin: process.env.APP_URL || '*' },
    path: '/socket.io'
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('No token'));
    try {
      const decoded = verifyToken(token);
      socket.data.user = decoded;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const { user } = socket.data;
    socket.join(`org:${user.organizationId}`);
    logger.info(`🔌 Socket: user ${user.userId}`);

    socket.on('subscribe-space', (spaceId: string) => {
      socket.join(`space:${spaceId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`🔌 Disconnect: user ${user.userId}`);
    });
  });

  logger.info('✅ WebSocket initialized');
  return io;
};

export const emitToOrg = (orgId: string, event: string, data: any) => {
  io?.to(`org:${orgId}`).emit(event, data);
};

export const emitToUser = (userId: string, event: string, data: any) => {
  io?.to(`user:${userId}`).emit(event, data);
};
