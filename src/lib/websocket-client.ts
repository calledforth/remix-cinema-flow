import { io, Socket } from 'socket.io-client';
import type { JobStatus } from './api-client';

export interface WebSocketEvents {
  connected: (data: { message: string }) => void;
  job_update: (data: JobStatus) => void;
  joined_job: (data: { job_id: string; status: string }) => void;
  error: (data: { message: string }) => void;
}

class WebSocketClient {
  private socket: Socket | null = null;
  private serverUrl: string;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(serverUrl: string = 'https://remix-backend-rg80.onrender.com') {
    this.serverUrl = serverUrl;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket && this.isConnected) {
        resolve();
        return;
      }

      console.log('🔌 Connecting to WebSocket server...');

      this.socket = io(this.serverUrl, {
        transports: ['websocket', 'polling'],
        timeout: 5000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        console.log('✅ WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        resolve();
      });

      this.socket.on('disconnect', (reason) => {
        console.log('🔌 WebSocket disconnected:', reason);
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ WebSocket connection error:', error);
        this.reconnectAttempts++;
        
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          reject(new Error('Failed to connect to WebSocket server'));
        }
      });

      this.socket.on('connected', (data) => {
        console.log('📡 Server acknowledgment:', data.message);
        this.emitToListeners('connected', data);
      });

      this.socket.on('job_update', (data) => {
        console.log('📊 Job update:', data);
        this.emitToListeners('job_update', data);
      });

      this.socket.on('joined_job', (data) => {
        console.log('📋 Joined job room:', data.job_id);
        this.emitToListeners('joined_job', data);
      });

      this.socket.on('error', (data) => {
        console.error('❌ WebSocket error:', data);
        this.emitToListeners('error', data);
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      console.log('🔌 Disconnecting WebSocket');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.eventListeners.clear();
    }
  }

  joinJob(jobId: string): void {
    if (this.socket && this.isConnected) {
      console.log('📋 Joining job room:', jobId);
      this.socket.emit('join_job', { job_id: jobId });
    } else {
      console.warn('⚠️ Cannot join job - not connected to WebSocket');
    }
  }

  on<K extends keyof WebSocketEvents>(event: K, callback: WebSocketEvents[K]): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback as Function);
  }

  off<K extends keyof WebSocketEvents>(event: K, callback: WebSocketEvents[K]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback as Function);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emitToListeners(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  get connected(): boolean {
    return this.isConnected;
  }
}

export const wsClient = new WebSocketClient(); 