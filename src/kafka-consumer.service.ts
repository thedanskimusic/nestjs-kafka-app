// src/kafka-consumer.service.ts
import { Injectable } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Injectable()
export class KafkaConsumerService {
  // Removed OnModuleInit, OnModuleDestroy, and manual consumer management.
  // NestJS's @EventPattern handles the consumer lifecycle automatically.

  /**
   * This method acts as a Kafka consumer for the 'my-topic' topic.
   * The @EventPattern decorator tells NestJS to listen for messages on this topic.
   * @param data The payload of the Kafka message.
   */
  @EventPattern('my-topic')
  async handleMyTopicMessage(@Payload() data: any) {
    console.log('Received message from @EventPattern "my-topic":', data);
    // Here you would process the message, e.g., save to a database,
    // trigger other services, etc.
  }

  /**
   * You can add more consumer methods for different topics.
   * @EventPattern('another-topic')
   * async handleAnotherTopicMessage(@Payload() data: any) {
   * console.log('Received message from "another-topic":', data);
   * }
   */
}