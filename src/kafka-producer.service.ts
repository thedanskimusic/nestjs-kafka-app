// src/kafka-producer.service.ts
import { Injectable, Inject, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject('KAFKA_SERVICE') private client: ClientKafka) {}

  async onModuleInit() {
    // This is crucial for the producer to connect to Kafka.
    // It ensures topics are created and the producer is ready before messages are sent.
    try {
      await this.client.connect();
      console.log('Kafka Producer connected successfully.');
    } catch (error) {
      console.error('Failed to connect Kafka Producer:', error);
      // Depending on your application, you might want to exit or handle this more gracefully
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
   * @param topic The Kafka topic to send the message to.
   * @param message The message payload.
   */
  async sendMessage(topic: string, message: any) {
    console.log(`Attempting to send message to topic "${topic}":`, message);
    return new Promise((resolve, reject) => {
      this.client.emit(topic, message).pipe(
        tap(() => {
          console.log(`Message successfully sent to topic "${topic}"`);
          resolve(true); // Resolve with a success indicator
        }),
        catchError((err) => {
          console.error(`ERROR: Failed to send message to topic "${topic}":`, err);
          reject(err); // Reject the promise with the error
          return throwError(() => err); // Re-throw the error for NestJS's internal error handling
        })
      ).subscribe(); // Subscribe to trigger the observable
    });
  }
}