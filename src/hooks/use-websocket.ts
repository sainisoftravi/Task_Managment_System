"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { WebSocketEvent } from "../types";

type WSStatus = "connecting" | "open" | "closing" | "closed";

export interface UseWebSocketOptions {
  url: string;
  token?: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export function useWebSocket(options: UseWebSocketOptions) {
  const [status, setStatus] = useState<WSStatus>("closed");
  const [events, setEvents] = useState<WebSocketEvent[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!options.url) return;

    const ws = new WebSocket(options.url);
    wsRef.current = ws;

    setStatus("connecting");

    ws.onopen = () => {
      setStatus("open");
      setEvents((prev) => prev.slice(-99));
      reconnectAttemptsRef.current = 0;

      if (options.token) {
        ws.send(JSON.stringify({ type: "auth", token: options.token }));
      }
    };

    ws.onmessage = (event) => {
      try {
        const msg: WebSocketEvent = JSON.parse(event.data);
        setEvents((prev) => {
          const updated = [...prev.slice(-99), msg];
          return updated;
        });
      } catch (err) {
        console.error("WS parse error:", err);
      }
    };

    ws.onclose = () => {
      setStatus("closed");

      if (reconnectAttemptsRef.current < (options.maxReconnectAttempts ?? 5)) {
        reconnectAttemptsRef.current += 1;
        reconnectTimerRef.current = setTimeout(() => {
          setStatus("connecting");
        }, options.reconnectInterval ?? 3000);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [options.url, options.token, options.reconnectInterval, options.maxReconnectAttempts]);

  const subscribe = useCallback((channel: string) => {
    wsRef.current?.send(JSON.stringify({ type: "subscribe", channel }));
  }, []);

  const unsubscribe = useCallback((channel: string) => {
    wsRef.current?.send(JSON.stringify({ type: "unsubscribe", channel }));
  }, []);

  const send = useCallback((event: WebSocketEvent) => {
    wsRef.current?.send(JSON.stringify(event));
  }, []);

  return { status, events, subscribe, unsubscribe, send, ws: wsRef.current };
}
