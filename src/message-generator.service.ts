// src/message-generator.service.ts
import { Injectable, OnModuleDestroy, Inject, forwardRef } from '@nestjs/common';
import { KafkaProducerService } from './kafka-producer.service';
import { DashboardWebSocketGateway } from './websocket/websocket.gateway';

interface MessageGeneratorState {
  isRunning: boolean;
  intervalMs: number;
  messageCount: number;
  lastMessageTime?: Date;
}

@Injectable()
export class MessageGeneratorService implements OnModuleDestroy {
  private state: MessageGeneratorState = {
    isRunning: false,
    intervalMs: 5000, // 5 seconds default
    messageCount: 0,
  };

  private intervalId?: NodeJS.Timeout;

  constructor(
    private readonly kafkaProducerService: KafkaProducerService,
    @Inject(forwardRef(() => DashboardWebSocketGateway))
    private readonly webSocketGateway: DashboardWebSocketGateway,
  ) {}

  async onModuleDestroy() {
    this.stop();
  }

  /**
   * Start generating random messages at the specified interval
   */
  start(intervalMs: number = 5000): void {
    if (this.state.isRunning) {
      console.log('Message generator is already running');
      return;
    }

    this.state.isRunning = true;
    this.state.intervalMs = intervalMs;
    this.state.lastMessageTime = new Date();

    console.log(`Starting message generator with ${intervalMs}ms interval`);

    this.intervalId = setInterval(async () => {
      await this.generateRandomMessage();
    }, intervalMs);

    // Emit WebSocket event
    this.webSocketGateway.emitGeneratorStarted(intervalMs);
    this.webSocketGateway.emitGeneratorStateUpdate(this.getState());

    // Generate first message immediately
    this.generateRandomMessage();
  }

  /**
   * Pause message generation (keeps state)
   */
  pause(): void {
    if (!this.state.isRunning) {
      console.log('Message generator is not running');
      return;
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }

    this.state.isRunning = false;
    console.log('Message generator paused');

    // Emit WebSocket event
    this.webSocketGateway.emitGeneratorPaused();
    this.webSocketGateway.emitGeneratorStateUpdate(this.getState());
  }

  /**
   * Resume message generation from where it left off
   */
  resume(): void {
    if (this.state.isRunning) {
      console.log('Message generator is already running');
      return;
    }

    this.state.isRunning = true;
    this.state.lastMessageTime = new Date();

    console.log(`Resuming message generator with ${this.state.intervalMs}ms interval`);

    this.intervalId = setInterval(async () => {
      await this.generateRandomMessage();
    }, this.state.intervalMs);

    // Emit WebSocket event
    this.webSocketGateway.emitGeneratorResumed();
    this.webSocketGateway.emitGeneratorStateUpdate(this.getState());
  }

  /**
   * Stop message generation and reset state
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }

    this.state.isRunning = false;
    this.state.messageCount = 0;
    this.state.lastMessageTime = undefined;
    console.log('Message generator stopped and state reset');

    // Emit WebSocket event
    this.webSocketGateway.emitGeneratorStopped();
    this.webSocketGateway.emitGeneratorStateUpdate(this.getState());
  }

  /**
   * Get current state of the message generator
   */
  getState(): MessageGeneratorState {
    return { ...this.state };
  }

  /**
   * Update the interval for message generation
   */
  setInterval(intervalMs: number): void {
    this.state.intervalMs = intervalMs;
    
    if (this.state.isRunning && this.intervalId) {
      // Restart with new interval
      this.pause();
      this.resume();
    } else {
      // Just emit state update if not running
      this.webSocketGateway.emitGeneratorStateUpdate(this.getState());
    }
  }

  /**
   * Generate a random message and send it to Kafka
   */
  private async generateRandomMessage(): Promise<void> {
    try {
      this.state.messageCount++;
      this.state.lastMessageTime = new Date();

      const randomMessage = this.createRandomMessage();
      
      console.log(`Generating message #${this.state.messageCount}:`, randomMessage);
      
      // Send to Kafka
      await this.kafkaProducerService.sendMessage('my-topic', randomMessage);
      
      // Emit WebSocket event for new message
      this.webSocketGateway.emitNewMessage(randomMessage);
      
      // Emit state update
      this.webSocketGateway.emitGeneratorStateUpdate(this.getState());
    } catch (error) {
      console.error('Error generating random message:', error);
      // Emit error event
      this.webSocketGateway.emitError({
        type: 'message_generation_error',
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Create a random message with various event types
   */
  private createRandomMessage(): any {
    const eventTypes = [
      'user_login',
      'user_logout', 
      'order_created',
      'order_updated',
      'payment_processed',
      'inventory_updated',
      'notification_sent',
      'api_call',
      'error_occurred',
      'system_health_check'
    ];

    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    const baseMessage = {
      id: this.state.messageCount,
      eventType,
      timestamp: new Date().toISOString(),
      source: 'message-generator',
    };

    // Add event-specific data based on type
    switch (eventType) {
      case 'user_login':
      case 'user_logout':
        return {
          ...baseMessage,
          userId: Math.floor(Math.random() * 1000) + 1,
          sessionId: `session_${Math.random().toString(36).substr(2, 9)}`,
        };

      case 'order_created':
      case 'order_updated':
        return {
          ...baseMessage,
          orderId: `order_${Math.random().toString(36).substr(2, 9)}`,
          amount: (Math.random() * 1000).toFixed(2),
          currency: 'USD',
          customerId: Math.floor(Math.random() * 500) + 1,
        };

      case 'payment_processed':
        return {
          ...baseMessage,
          paymentId: `pay_${Math.random().toString(36).substr(2, 9)}`,
          amount: (Math.random() * 500).toFixed(2),
          currency: 'USD',
          status: Math.random() > 0.1 ? 'success' : 'failed',
        };

      case 'inventory_updated':
        return {
          ...baseMessage,
          productId: `prod_${Math.floor(Math.random() * 1000) + 1}`,
          quantity: Math.floor(Math.random() * 100),
          warehouse: `warehouse_${Math.floor(Math.random() * 5) + 1}`,
        };

      case 'notification_sent':
        return {
          ...baseMessage,
          recipientId: Math.floor(Math.random() * 1000) + 1,
          notificationType: ['email', 'sms', 'push'][Math.floor(Math.random() * 3)],
          message: `Random notification message ${this.state.messageCount}`,
        };

      case 'api_call':
        return {
          ...baseMessage,
          endpoint: `/api/v1/${['users', 'orders', 'products', 'payments'][Math.floor(Math.random() * 4)]}`,
          method: ['GET', 'POST', 'PUT', 'DELETE'][Math.floor(Math.random() * 4)],
          responseTime: Math.floor(Math.random() * 1000),
          statusCode: [200, 201, 400, 404, 500][Math.floor(Math.random() * 5)],
        };

      case 'error_occurred':
        return {
          ...baseMessage,
          errorCode: `ERR_${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`,
          errorMessage: `Random error message ${this.state.messageCount}`,
          stackTrace: 'Stack trace would be here...',
        };

      case 'system_health_check':
        return {
          ...baseMessage,
          cpuUsage: (Math.random() * 100).toFixed(2),
          memoryUsage: (Math.random() * 100).toFixed(2),
          diskUsage: (Math.random() * 100).toFixed(2),
          status: Math.random() > 0.2 ? 'healthy' : 'warning',
        };

      default:
        return {
          ...baseMessage,
          data: `Random data for message ${this.state.messageCount}`,
        };
    }
  }
}
