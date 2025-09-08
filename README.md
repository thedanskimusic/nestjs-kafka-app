## Project setup

This project contains two separate applications:
1. **NestJS Backend** - Kafka message generator with WebSocket support
2. **React Dashboard** - Real-time monitoring dashboard

### Backend Setup

```bash
# Install backend dependencies
$ yarn install

# Start the NestJS backend
$ yarn run start

# Start in development mode (with hot reload)
$ yarn run start:dev

# Start in production mode
$ yarn run start:prod
```

The backend will be available at `http://localhost:3000`

### Dashboard Setup

```bash
# Navigate to dashboard directory
$ cd dashboard

# Install dashboard dependencies
$ yarn install

# Start the React dashboard
$ yarn dev
```

The dashboard will be available at `http://localhost:5173`

### Running Both Applications

To run the complete system, you need to start both applications:

**Terminal 1 (Backend):**
```bash
$ yarn run start:dev
```

**Terminal 2 (Dashboard):**
```bash
$ cd dashboard
$ yarn dev
```

Make sure Kafka is running on `localhost:9092` for the backend to work properly.

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```