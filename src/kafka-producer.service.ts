// src/kafka-producer.service.ts
import { Injectable, Inject, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject('KAFKA_SERVICE') private client: ClientKafka) {}

  async onModuleInit() {
    try {
      await this.client.connect();
      console.log('Kafka Producer connected successfully.');
    } catch (error) {
      console.error('Failed to connect Kafka Producer:', error);
      // In a real application, you might want to implement retry logic or health checks here.
      // For now, we'll just log the error.
    }
  }

  async onModuleDestroy() {
    try {
      await this.client.close();
      console.log('Kafka Producer disconnected.');
    } catch (error) {
      console.error('Failed to disconnect Kafka Producer:', error);
    }
  }

  /**
   * Sends a message to a specified Kafka topic.
   * Uses client.emit for event-driven communication (no reply expected).
   * @param topic The Kafka topic to send the message to.
   * @param message The message payload.
   */
  async sendMessage(topic: string, message: any) {
    console.log(`Attempting to send message to topic "${topic}":`, message);
    return new Promise((resolve, reject) => {
      // Use client.emit for event-driven communication.
      // It does not expect a reply topic.
      this.client.emit(topic, JSON.stringify(message)).pipe( // Use emit instead of send
        tap(() => {
          console.log(`Message successfully emitted to topic "${topic}"`);
          resolve(true); // Resolve with a success indicator
        }),
        catchError((err) => {
          console.error(`ERROR: Failed to emit message to topic "${topic}":`, err);
          reject(err); // Reject the promise with the error
          return throwError(() => err); // Re-throw the error for NestJS's internal error handling
        })
      ).subscribe(); // Subscribe to trigger the observable
    });
  }
}