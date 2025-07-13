// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaProducerService } from './kafka-producer.service';
import { KafkaConsumerService } from './kafka-consumer.service'; // Ensure this is imported

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE', // Name to inject the Kafka client
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'], // Kafka broker address
            clientId: 'nestjs-producer-client', // Explicit client ID for producer
          },
          producer: {
            allowAutoTopicCreation: true, // Allows NestJS to create topics if they don't exist
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, KafkaProducerService, KafkaConsumerService],
})
export class AppModule {}