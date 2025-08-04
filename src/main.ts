// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // Create the HTTP server part of the application
  const app = await NestFactory.create(AppModule);

  // Connect the Kafka microservice consumer
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'], // Kafka broker address
        clientId: 'nestjs-consumer-client', // Explicit client ID for consumer
      },
      consumer: {
        groupId: 'my-nestjs-consumer-group', // Consumer group ID
        // 'fromBeginning' is NOT set here. For NestJS microservices,
        // the 'fromBeginning' behavior is often tied to the consumer group's
        // offset management. If you need to re-read old messages for testing,
        // you might need to reset the consumer group in Confluent Control Center.
      },
    },
  });

  // Start both the HTTP server and the Kafka consumer
  await app.startAllMicroservices();
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log('Kafka Consumer is listening...');
}
bootstrap();