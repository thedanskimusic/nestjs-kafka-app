// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaProducerService } from './kafka-producer.service';
import { KafkaConsumerService } from './kafka-consumer.service'; // Ensure this is imported
import { MessageGeneratorService } from './message-generator.service';
import { DashboardWebSocketGateway } from './websocket/websocket.gateway';

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
            // 'acks' is not directly configurable here in MicroserviceOptions for Transport.KAFKA.
            // The underlying kafkajs producer defaults to acks: 1 (leader acknowledgment).
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, KafkaProducerService, KafkaConsumerService, MessageGeneratorService, DashboardWebSocketGateway],
})
export class AppModule {}