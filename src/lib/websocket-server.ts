import { WebSocketServer, WebSocket } from "ws";
import { verify, Secret } from "jsonwebtoken";
import { AuthPayload } from "../types";

interface ClientInfo {
  userId: string;
  teamId?: string;
  socket: WebSocket;
}

declare module "ws" {
  interface WebSocket {
    clientId?: string;
  }
}

class WSServer {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, ClientInfo> = new Map();
  private subscriptions: Map<string, Set<string>> = new Map();
  private clientIdCounter = 0;

  start(port: number = 3001) {
    this.wss = new WebSocketServer({ port });

    this.wss.on("connection", (socket: WebSocket) => {
      const clientId = String(++this.clientIdCounter);
      socket.clientId = clientId;

      socket.on("message", (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());

          if (message.type === "auth") {
            const payload = this.authenticate(message.token) as AuthPayload;
            if (payload) {
              this.clients.set(clientId, {
                userId: payload.userId,
                teamId: payload.teamId,
                socket,
              });
              socket.send(JSON.stringify({ type: "auth:success" }));
            } else {
              socket.send(JSON.stringify({ type: "auth:error", message: "Invalid token" }));
            }
          }

          if (message.type === "subscribe") {
            const client = this.clients.get(clientId);
            if (client) {
              const sub = this.subscriptions.get(message.channel) ?? new Set();
              sub.add(client.userId);
              this.subscriptions.set(message.channel, sub);
            }
          }

          if (message.type === "unsubscribe") {
            const client = this.clients.get(clientId);
            if (client) {
              const sub = this.subscriptions.get(message.channel);
              if (sub) {
                sub.delete(client.userId);
                if (sub.size === 0) this.subscriptions.delete(message.channel);
              }
            }
          }
        } catch (err) {
          console.error("WS message parse error:", err);
        }
      });

      socket.on("close", () => {
        const clientInfo = this.clients.get(clientId);
        this.clients.delete(clientId);

        if (clientInfo) {
          for (const [channel, sub] of this.subscriptions) {
            sub.delete(clientInfo.userId);
            if (sub.size === 0) this.subscriptions.delete(channel);
          }
        }
      });
    });

    this.wss.on("listening", () => {
      console.log(`[WebSocket] Server listening on port ${port}`);
    });

    console.log("[WebSocket] Server starting...");
  }

  authenticate(token: string): AuthPayload | null {
    try {
      return verify(token, process.env.JWT_SECRET || ("dev-secret" as Secret)) as AuthPayload;
    } catch {
      return null;
    }
  }

  broadcast(channel: string, event: { type: string; payload: unknown }): void {
    if (!this.wss) return;

    const subscribed = this.subscriptions.get(channel);
    if (!subscribed || subscribed.size === 0) return;

    const data = JSON.stringify(event);
    this.clients.forEach((client) => {
      if (subscribed.has(client.userId) && client.socket.readyState === WebSocket.OPEN) {
        client.socket.send(data);
      }
    });
  }

  broadcastToTeam(teamId: string, event: { type: string; payload: unknown }): void {
    const data = JSON.stringify(event);
    this.clients.forEach((client) => {
      if (client.teamId === teamId && client.socket.readyState === WebSocket.OPEN) {
        client.socket.send(data);
      }
    });
  }

  getConnectedUserCount(): number {
    return this.clients.size;
  }

  stop() {
    if (this.wss) {
      this.wss.close();
      this.wss = null;
      this.clients.clear();
      this.subscriptions.clear();
      console.log("[WebSocket] Server stopped.");
    }
  }
}

export const wsServer = new WSServer();

if (require.main === module) {
  const port = parseInt(process.env.WS_PORT || "3001", 10);
  wsServer.start(port);

  process.on("SIGINT", () => {
    wsServer.stop();
    process.exit(0);
  });
}
