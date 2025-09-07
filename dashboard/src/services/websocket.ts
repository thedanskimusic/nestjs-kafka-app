// src/services/websocket.ts
import { io, Socket } from 'socket.io-client';
import type { ConnectionState } from '../types';

class WebSocketService {
  private socket: Socket | null = null;
  private connectionState: ConnectionState = {
    isConnected: false,
    reconnectAttempts: 0,
  };
  private eventListeners: Map<string, Function[]> = new Map();

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      this.socket = io('http://localhost:3000/dashboard', {
        transports: ['websocket'],
        timeout: 5000,
      });

      this.socket.on('connect', () => {
        this.connectionState = {
          isConnected: true,
          clientId: this.socket?.id,
          reconnectAttempts: 0,
        };
        this.emit('connection:established', {
          clientId: this.socket?.id,
          timestamp: new Date().toISOString(),
        });
        resolve();
      });

      this.socket.on('disconnect', (reason) => {
        this.connectionState = {
          isConnected: false,
          reconnectAttempts: this.connectionState.reconnectAttempts + 1,
        };
        this.emit('connection:lost', { reason, timestamp: new Date().toISOString() });
      });

      this.socket.on('connect_error', (error) => {
        this.connectionState = {
          isConnected: false,
          reconnectAttempts: this.connectionState.reconnectAttempts + 1,
        };
        this.emit('connection:error', { error: error.message, timestamp: new Date().toISOString() });
        reject(error);
      });

      // Generator events
      this.socket.on('generator:started', (data) => {
        this.emit('generator:started', data);
      });

      this.socket.on('generator:paused', (data) => {
        this.emit('generator:paused', data);
      });

      this.socket.on('generator:resumed', (data) => {
        this.emit('generator:resumed', data);
      });

      this.socket.on('generator:stopped', (data) => {
        this.emit('generator:stopped', data);
      });

      this.socket.on('generator:stateUpdated', (data) => {
        this.emit('generator:stateUpdated', data);
      });

      this.socket.on('message:generated', (data) => {
        this.emit('message:generated', data);
      });

      this.socket.on('error:occurred', (data) => {
        this.emit('error:occurred', data);
      });

      this.socket.on('connection:established', (data) => {
        this.emit('connection:established', data);
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connectionState = {
        isConnected: false,
        reconnectAttempts: 0,
      };
    }
  }

  // Generator control methods
  startGenerator(intervalMs: number = 5000): void {
    if (this.socket?.connected) {
      this.socket.emit('generator:start', { intervalMs });
    }
  }

  pauseGenerator(): void {
    if (this.socket?.connected) {
      this.socket.emit('generator:pause');
    }
  }

  resumeGenerator(): void {
    if (this.socket?.connected) {
      this.socket.emit('generator:resume');
    }
  }

  stopGenerator(): void {
    if (this.socket?.connected) {
      this.socket.emit('generator:stop');
    }
  }

  updateInterval(intervalMs: number): void {
    if (this.socket?.connected) {
      this.socket.emit('generator:updateInterval', { intervalMs });
    }
  }

  getState(): void {
    if (this.socket?.connected) {
      this.socket.emit('generator:getState');
    }
  }

  // Event listener management
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  getConnectionState(): ConnectionState {
    return { ...this.connectionState };
  }

  isConnected(): boolean {
    return this.connectionState.isConnected;
  }
}

export const webSocketService = new WebSocketService();
