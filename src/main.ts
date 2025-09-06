// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create the HTTP server part of the application
  const app = await NestFactory.create(AppModule);

  // Start the HTTP server
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log('Kafka Consumer will be initialized by KafkaConsumerService...');
}
bootstrap();