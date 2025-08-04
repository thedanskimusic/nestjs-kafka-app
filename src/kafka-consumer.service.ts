// src/kafka-consumer.service.ts
import { Injectable } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Injectable()
export class KafkaConsumerService {
  // NestJS's @EventPattern decorator automatically handles the consumer's
  // connection, subscription, and message processing.
  // We do not need OnModuleInit/OnModuleDestroy or manual consumer.run() here
  // when using @EventPattern for basic consumption.

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