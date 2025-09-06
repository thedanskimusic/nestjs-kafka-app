// src/app.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { KafkaProducerService } from './kafka-producer.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly kafkaProducerService: KafkaProducerService,
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
}