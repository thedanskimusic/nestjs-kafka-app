# Kafka Dashboard

A modern, real-time dashboard for monitoring and controlling Kafka message generation.

## Features

- 🚀 **Real-time Event Streaming** - Live WebSocket connection for instant updates
- 🎛️ **Generator Controls** - Start, pause, resume, and stop message generation
- 📊 **Live Statistics** - Message count, rate, uptime, and event type distribution
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Clean, intuitive interface with smooth animations
- 🔄 **Auto-reconnection** - Handles connection drops gracefully

## Getting Started

### Prerequisites

- Node.js 18+ 
- The NestJS backend running on port 3000
- Kafka running on localhost:9092

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The dashboard will be available at `http://localhost:5173`

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## Usage

1. **Connect**: The dashboard automatically connects to the WebSocket server
2. **Control**: Use the control panel to start/pause/resume/stop the message generator
3. **Monitor**: Watch real-time events and statistics in the dashboard
4. **Configure**: Adjust the message generation interval as needed

## Architecture

- **React 18** with TypeScript
- **Styled Components** for styling
- **Socket.IO Client** for WebSocket communication
- **Vite** for fast development and building
- **Lucide React** for icons

## WebSocket Events

The dashboard listens for these events from the backend:

- `generator:started` - Generator started
- `generator:paused` - Generator paused
- `generator:resumed` - Generator resumed
- `generator:stopped` - Generator stopped
- `generator:stateUpdated` - State changes
- `message:generated` - New messages
- `error:occurred` - Error events

## Development

The dashboard is built with modern React patterns:

- **Functional Components** with hooks
- **TypeScript** for type safety
- **Styled Components** for component-scoped styling
- **Custom Hooks** for WebSocket management
- **Responsive Design** with CSS Grid and Flexbox

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+