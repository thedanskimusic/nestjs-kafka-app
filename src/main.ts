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