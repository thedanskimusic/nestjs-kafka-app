// src/websocket/websocket.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Inject, forwardRef } from '@nestjs/common';
import { MessageGeneratorService } from '../message-generator.service';

@WebSocketGateway({
  cors: {
    origin: '*', // In production, specify your frontend URL
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: '/dashboard', // Optional: create a specific namespace for the dashboard
})
export class DashboardWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(DashboardWebSocketGateway.name);
  private connectedClients = new Map<string, Socket>();

  constructor(
    @Inject(forwardRef(() => MessageGeneratorService))
    private readonly messageGeneratorService: MessageGeneratorService,
  ) {}

  handleConnection(client: Socket) {
    this.connectedClients.set(client.id, client);
    this.logger.log(`Client connected: ${client.id}`);
    
    // Send welcome message to the newly connected client
    client.emit('connection:established', {
      message: 'Connected to Kafka Dashboard WebSocket',
      clientId: client.id,
      timestamp: new Date().toISOString(),
    });
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Handle client requests for generator state
   */
  @SubscribeMessage('generator:getState')
  handleGetState(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client ${client.id} requested generator state`);
    const state = this.messageGeneratorService.getState();
    client.emit('generator:stateUpdated', { state });
  }

  /**
   * Handle client requests to start generator
   */
  @SubscribeMessage('generator:start')
  handleStartGenerator(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { intervalMs?: number }
  ) {
    this.logger.log(`Client ${client.id} requested to start generator with interval: ${data.intervalMs || 5000}ms`);
    this.messageGeneratorService.start(data.intervalMs || 5000);
  }

  /**
   * Handle client requests to pause generator
   */
  @SubscribeMessage('generator:pause')
  handlePauseGenerator(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client ${client.id} requested to pause generator`);
    this.messageGeneratorService.pause();
  }

  /**
   * Handle client requests to resume generator
   */
  @SubscribeMessage('generator:resume')
  handleResumeGenerator(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client ${client.id} requested to resume generator`);
    this.messageGeneratorService.resume();
  }

  /**
   * Handle client requests to stop generator
   */
  @SubscribeMessage('generator:stop')
  handleStopGenerator(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client ${client.id} requested to stop generator`);
    this.messageGeneratorService.stop();
  }

  /**
   * Handle client requests to update interval
   */
  @SubscribeMessage('generator:updateInterval')
  handleUpdateInterval(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { intervalMs: number }
  ) {
    this.logger.log(`Client ${client.id} requested to update interval to: ${data.intervalMs}ms`);
    this.messageGeneratorService.setInterval(data.intervalMs);
  }

  // Public methods for emitting events to all connected clients

  /**
   * Emit generator state update to all connected clients
   */
  emitGeneratorStateUpdate(state: any) {
    this.server.emit('generator:stateUpdated', {
      state,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Emitted generator state update to ${this.connectedClients.size} clients`);
  }

  /**
   * Emit new message event to all connected clients
   */
  emitNewMessage(message: any) {
    this.server.emit('message:generated', {
      message,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Emitted new message to ${this.connectedClients.size} clients`);
  }

  /**
   * Emit generator started event
   */
  emitGeneratorStarted(intervalMs: number) {
    this.server.emit('generator:started', {
      intervalMs,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Emitted generator started event to ${this.connectedClients.size} clients`);
  }

  /**
   * Emit generator paused event
   */
  emitGeneratorPaused() {
    this.server.emit('generator:paused', {
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Emitted generator paused event to ${this.connectedClients.size} clients`);
  }

  /**
   * Emit generator resumed event
   */
  emitGeneratorResumed() {
    this.server.emit('generator:resumed', {
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Emitted generator resumed event to ${this.connectedClients.size} clients`);
  }

  /**
   * Emit generator stopped event
   */
  emitGeneratorStopped() {
    this.server.emit('generator:stopped', {
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Emitted generator stopped event to ${this.connectedClients.size} clients`);
  }

  /**
   * Emit error event
   */
  emitError(error: any) {
    this.server.emit('error:occurred', {
      error,
      timestamp: new Date().toISOString(),
    });
    this.logger.error(`Emitted error event to ${this.connectedClients.size} clients:`, error);
  }

  /**
   * Get number of connected clients
   */
  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }

  /**
   * Get list of connected client IDs
   */
  getConnectedClientIds(): string[] {
    return Array.from(this.connectedClients.keys());
  }
}
