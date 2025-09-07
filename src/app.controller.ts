// src/app.controller.ts
import { Controller, Get, Post, Body, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { KafkaProducerService } from './kafka-producer.service';
import { MessageGeneratorService } from './message-generator.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly kafkaProducerService: KafkaProducerService,
    private readonly messageGeneratorService: MessageGeneratorService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * HTTP POST endpoint to send a message to a Kafka topic.
   * @param body Contains the topic and message payload.
   * Example Body: { "topic": "my-topic", "message": { "id": 1, "value": "Hello Kafka!" } }
   */
  @Post('send-kafka-message')
  async sendKafkaMessage(@Body() body: { topic: string; message: any }) {
    const { topic, message } = body;
    try {
      await this.kafkaProducerService.sendMessage(topic, message);
      return { status: 'success', message: 'Message sent to Kafka' };
    } catch (error) {
      // Return a more detailed error message from the controller
      console.error('Controller caught error sending Kafka message:', error);
      return { status: 'error', message: 'Failed to send message to Kafka', error: error.message };
    }
  }

  /**
   * Start the message generator with random events
   * @param body Contains the interval in milliseconds (optional, defaults to 5000ms)
   */
  @Post('generator/start')
  async startMessageGenerator(@Body() body: { intervalMs?: number } = {}) {
    const { intervalMs = 5000 } = body;
    try {
      this.messageGeneratorService.start(intervalMs);
      return { 
        status: 'success', 
        message: `Message generator started with ${intervalMs}ms interval`,
        intervalMs 
      };
    } catch (error) {
      console.error('Error starting message generator:', error);
      return { status: 'error', message: 'Failed to start message generator', error: error.message };
    }
  }

  /**
   * Pause the message generator (keeps state)
   */
  @Put('generator/pause')
  async pauseMessageGenerator() {
    try {
      this.messageGeneratorService.pause();
      return { status: 'success', message: 'Message generator paused' };
    } catch (error) {
      console.error('Error pausing message generator:', error);
      return { status: 'error', message: 'Failed to pause message generator', error: error.message };
    }
  }

  /**
   * Resume the message generator
   */
  @Put('generator/resume')
  async resumeMessageGenerator() {
    try {
      this.messageGeneratorService.resume();
      return { status: 'success', message: 'Message generator resumed' };
    } catch (error) {
      console.error('Error resuming message generator:', error);
      return { status: 'error', message: 'Failed to resume message generator', error: error.message };
    }
  }

  /**
   * Stop the message generator and reset state
   */
  @Put('generator/stop')
  async stopMessageGenerator() {
    try {
      this.messageGeneratorService.stop();
      return { status: 'success', message: 'Message generator stopped and state reset' };
    } catch (error) {
      console.error('Error stopping message generator:', error);
      return { status: 'error', message: 'Failed to stop message generator', error: error.message };
    }
  }

  /**
   * Get the current state of the message generator
   */
  @Get('generator/state')
  getMessageGeneratorState(): any {
    try {
      const state = this.messageGeneratorService.getState();
      return { status: 'success', state };
    } catch (error) {
      console.error('Error getting message generator state:', error);
      return { status: 'error', message: 'Failed to get message generator state', error: error.message };
    }
  }

  /**
   * Update the interval for message generation
   * @param body Contains the new interval in milliseconds
   */
  @Put('generator/interval')
  async updateMessageGeneratorInterval(@Body() body: { intervalMs: number }) {
    const { intervalMs } = body;
    try {
      if (!intervalMs || intervalMs < 100) {
        return { status: 'error', message: 'Interval must be at least 100ms' };
      }
      
      this.messageGeneratorService.setInterval(intervalMs);
      return { 
        status: 'success', 
        message: `Message generator interval updated to ${intervalMs}ms`,
        intervalMs 
      };
    } catch (error) {
      console.error('Error updating message generator interval:', error);
      return { status: 'error', message: 'Failed to update message generator interval', error: error.message };
    }
  }
}