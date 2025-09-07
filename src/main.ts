// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create the HTTP server part of the application
  const app = await NestFactory.create(AppModule);

  // Enable CORS for WebSocket and HTTP requests
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173', 'http://localhost:8080'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Start the HTTP server
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log('WebSocket server is available at ws://localhost:3000/dashboard');
  console.log('Kafka Consumer will be initialized by KafkaConsumerService...');
}
bootstrap();