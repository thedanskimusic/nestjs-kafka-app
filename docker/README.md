# Kafka Development Environment

This directory contains the Docker Compose configuration for running a local Kafka development environment.

## Services Included

- **Zookeeper** (port 2181) - Kafka coordination service
- **Kafka Broker** (port 9092) - Main Kafka message broker
- **Schema Registry** (port 8081) - Schema management for Kafka topics
- **Control Center** (port 9021) - Web UI for monitoring and managing Kafka

## Quick Start

1. **Start the services:**
   ```bash
   cd docker
   docker-compose up -d
   ```

2. **Check service status:**
   ```bash
   docker-compose ps
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Stop the services:**
   ```bash
   docker-compose down
   ```

## Access Points

- **Kafka Broker**: `localhost:9092`
- **Schema Registry**: `http://localhost:8081`
- **Control Center**: `http://localhost:9021`

## Configuration

The Kafka broker is configured with:
- Bootstrap server: `localhost:9092`
- Internal communication: `broker:29092`
- Single partition replication (suitable for development)

## Notes

- This setup is intended for local development only
- All data is ephemeral and will be lost when containers are removed
- For production use, consider persistent volumes and proper security configurations
