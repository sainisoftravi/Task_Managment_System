"use client";

import { createContext, useContext, ReactNode } from "react";
import { useWebSocket } from "@/hooks/use-websocket";

interface WebSocketContextType {
  subscribe: (channel: string) => void;
  unsubscribe: (channel: string) => void;
  send: (event: { type: string; payload: unknown }) => void;
  status: string;
  events: any[];
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function useWebSocketContext() {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error("useWebSocketContext must be used within WebSocketProvider");
  return ctx;
}

export function WebSocketProvider({ children, url, token }: { children: ReactNode; url: string; token?: string }) {
  const { status, events, subscribe, unsubscribe, send } = useWebSocket({ url, token });

  return (
    <WebSocketContext.Provider value={{ subscribe, unsubscribe, send, status, events }}>
      {children}
    </WebSocketContext.Provider>
  );
}
