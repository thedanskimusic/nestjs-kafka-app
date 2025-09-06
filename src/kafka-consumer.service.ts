// src/kafka-consumer.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private consumer: any;

  onModuleInit() {
    console.log('KafkaConsumerService initializing...');
    this.initializeConsumer();
  }

  async onModuleDestroy() {
    if (this.consumer) {
      await this.consumer.disconnect();
      console.log('Kafka consumer disconnected');
    }
  }

  private async initializeConsumer() {
    try {
      // Initialize Kafka client
      this.kafka = new Kafka({
        clientId: 'nestjs-direct-consumer',
        brokers: ['localhost:9092'],
      });

      // Create consumer
      this.consumer = this.kafka.consumer({ 
        groupId: 'nestjs-direct-consumer-group',
        allowAutoTopicCreation: true,
      });

      // Connect and subscribe
      await this.consumer.connect();
      console.log('Kafka consumer connected successfully');

      await this.consumer.subscribe({ 
        topic: 'my-topic',
        fromBeginning: false 
      });

      // Start consuming messages
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const messageValue = message.value?.toString();
            const parsedMessage = messageValue ? JSON.parse(messageValue) : messageValue;
            
            console.log('Received message from direct consumer:', {
              topic,
              partition,
              offset: message.offset,
              key: message.key?.toString(),
              value: parsedMessage,
            });
          } catch (error) {
            console.error('Error processing message:', error);
          }
        },
      });

      console.log('KafkaConsumerService initialized and consuming messages from my-topic');
    } catch (error) {
      console.error('Failed to initialize Kafka consumer:', error);
    }
  }
}