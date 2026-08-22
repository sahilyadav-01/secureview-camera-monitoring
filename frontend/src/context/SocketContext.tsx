import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connectionAttempts: number;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  connectionAttempts: 0,
});

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('secureview_token');

    const socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      transports: ['websocket', 'polling'],
      auth: { token: token || 'demo-token' },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      setConnectionAttempts(0);
      console.log('🔌 SecureView Socket.IO connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      setIsConnected(false);
      console.warn('⚡ Socket.IO disconnected:', reason);
    });

    socket.on('connect_error', () => {
      setConnectionAttempts((p) => p + 1);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected, connectionAttempts }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

/**
 * Hook: subscribe to a socket event. Automatically cleans up on unmount.
 */
export function useSocketEvent<T = unknown>(event: string, handler: (data: T) => void) {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.on(event, handler as (...args: unknown[]) => void);
    return () => {
      socket.off(event, handler as (...args: unknown[]) => void);
    };
  }, [socket, event, handler]);
}

/**
 * Hook: subscribe to camera status update events.
 */
export function useCameraStatusUpdates(callback: (data: { cameraId: string; status: string; latencyMs: number }) => void) {
  useSocketEvent('camera:status_update', callback);
}

/**
 * Hook: subscribe to new alert events.
 */
export function useAlertUpdates(callback: (data: { id: string; title: string; severity: string; source: string }) => void) {
  useSocketEvent('alert:new', callback);
}

/**
 * Hook: subscribe to health probe completion events.
 */
export function useHealthProbeUpdates(callback: (data: { cameraId: string; status: string; pingMs: number }) => void) {
  useSocketEvent('health:probe_complete', callback);
}
