import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

export class WSManager {
  private static wss: WebSocketServer;
  private static clients: Set<WebSocket> = new Set();

  static initialize(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws' });

    this.wss.on('connection', (ws) => {
      console.log('New WS Client Connected');
      this.clients.add(ws);

      ws.on('close', () => {
        this.clients.delete(ws);
        console.log('WS Client Disconnected');
      });

      // Send initial welcome
      ws.send(JSON.stringify({ type: 'WELCOME', message: 'AuditAX Live Stream Active' }));
    });
  }

  static broadcast(type: string, payload: any) {
    const message = JSON.stringify({ type, payload });
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}
