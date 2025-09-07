# Real-time Kafka Dashboard - TODO List

## 🎯 Project Overview
Create a modern web dashboard to control the Kafka message generator and visualize real-time event streams using WebSocket connectivity.

## 📋 Implementation Plan

### Phase 1: Backend WebSocket Setup
- [ ] **1.1** Install WebSocket dependencies (`@nestjs/websockets`, `@nestjs/platform-socket.io`, `socket.io`)
- [ ] **1.2** Create WebSocket Gateway service for real-time communication
- [ ] **1.3** Integrate WebSocket with existing message generator service
- [ ] **1.4** Emit events to WebSocket clients when messages are generated
- [ ] **1.5** Add CORS configuration for frontend connectivity
- [ ] **1.6** Test WebSocket connection and event emission

### Phase 2: Frontend Dashboard (React)
- [ ] **2.1** Create React application structure
  - [ ] Set up Vite/Create React App
  - [ ] Install dependencies (socket.io-client, axios, styled-components/emotion)
  - [ ] Configure TypeScript if needed
- [ ] **2.2** Design dashboard layout
  - [ ] Header with application title and status
  - [ ] Control panel (start/pause/resume/stop buttons)
  - [ ] Settings panel (interval configuration)
  - [ ] Real-time event stream display
  - [ ] Statistics panel (message count, rate, etc.)
- [ ] **2.3** Implement WebSocket client
  - [ ] Connect to NestJS WebSocket server
  - [ ] Handle connection states (connected/disconnected/reconnecting)
  - [ ] Listen for real-time events
- [ ] **2.4** Create control components
  - [ ] Generator control buttons with state management
  - [ ] Interval slider/input with validation
  - [ ] Status indicators (running/paused/stopped)
- [ ] **2.5** Create event visualization
  - [ ] Real-time event list with auto-scroll
  - [ ] Event type filtering and search
  - [ ] Event details modal/expandable view
  - [ ] Color coding for different event types
- [ ] **2.6** Add statistics and monitoring
  - [ ] Message count display
  - [ ] Generation rate (messages per minute)
  - [ ] Event type distribution chart
  - [ ] Connection status indicator

### Phase 3: Enhanced Features
- [ ] **3.1** Event filtering and search
  - [ ] Filter by event type
  - [ ] Search by content
  - [ ] Date/time range filtering
- [ ] **3.2** Data persistence
  - [ ] Store recent events in browser localStorage
  - [ ] Export events to JSON/CSV
  - [ ] Clear history functionality
- [ ] **3.3** Advanced visualization
  - [ ] Real-time charts (message rate over time)
  - [ ] Event type pie chart
  - [ ] Timeline view of events
- [ ] **3.4** Responsive design
  - [ ] Mobile-friendly layout
  - [ ] Tablet optimization
  - [ ] Dark/light theme toggle

### Phase 4: Polish and Testing
- [ ] **4.1** Error handling
  - [ ] WebSocket connection error handling
  - [ ] API error display
  - [ ] Graceful degradation when backend is unavailable
- [ ] **4.2** Performance optimization
  - [ ] Virtual scrolling for large event lists
  - [ ] Debounced search/filtering
  - [ ] Memory management for long-running sessions
- [ ] **4.3** Testing
  - [ ] Unit tests for React components
  - [ ] Integration tests for WebSocket communication
  - [ ] End-to-end testing with Cypress/Playwright
- [ ] **4.4** Documentation
  - [ ] README updates with dashboard instructions
  - [ ] API documentation for WebSocket events
  - [ ] Deployment instructions

## 🛠 Technical Stack

### Backend (NestJS)
- `@nestjs/websockets` - WebSocket support
- `@nestjs/platform-socket.io` - Socket.IO integration
- `socket.io` - WebSocket library

### Frontend (React)
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite (fast, modern)
- **Styling**: Styled-components or Emotion
- **WebSocket**: socket.io-client
- **HTTP Client**: Axios
- **Charts**: Recharts or Chart.js
- **Icons**: React Icons or Heroicons

## 📁 Project Structure
```
nestjs-kafka-app/
├── src/                    # NestJS backend
│   ├── websocket/         # WebSocket gateway
│   ├── message-generator/ # Existing service
│   └── ...
├── dashboard/             # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API and WebSocket services
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   ├── public/
│   └── package.json
└── docker-compose.yml     # Updated for both services
```

## 🚀 Quick Start Commands (Future)
```bash
# Backend
npm run start:dev

# Frontend (in dashboard directory)
npm run dev

# Both services
docker-compose up
```

## 🎨 UI/UX Considerations
- **Real-time feel**: Smooth animations, live updates
- **Intuitive controls**: Clear button states, visual feedback
- **Event visualization**: Color-coded event types, readable timestamps
- **Responsive design**: Works on desktop, tablet, mobile
- **Accessibility**: Keyboard navigation, screen reader support

## 📊 Dashboard Features Preview
1. **Control Panel**: Start/Stop/Pause/Resume with visual state indicators
2. **Settings**: Interval slider with real-time updates
3. **Event Stream**: Live scrolling list with event details
4. **Statistics**: Message count, rate, event type distribution
5. **Filters**: Search and filter events by type/content
6. **Export**: Download event data as JSON/CSV

## 🔄 WebSocket Events
- `generator:started` - Generator started
- `generator:paused` - Generator paused  
- `generator:resumed` - Generator resumed
- `generator:stopped` - Generator stopped
- `message:generated` - New message created
- `state:updated` - Generator state changed
- `error:occurred` - Error events

---

**Estimated Timeline**: 2-3 days for MVP, 1 week for full-featured dashboard
**Priority**: High - This will significantly improve the developer experience
