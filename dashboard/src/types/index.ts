// src/types/index.ts

export interface MessageGeneratorState {
  isRunning: boolean;
  intervalMs: number;
  messageCount: number;
  lastMessageTime?: string;
}

export interface KafkaMessage {
  id: number;
  eventType: string;
  timestamp: string;
  source: string;
  [key: string]: any; // For event-specific data
}

export interface WebSocketEvent {
  type: string;
  data: any;
  timestamp: string;
}

export interface ConnectionState {
  isConnected: boolean;
  clientId?: string;
  reconnectAttempts: number;
}

export interface EventTypeStats {
  [eventType: string]: number;
}

export interface DashboardStats {
  totalMessages: number;
  messagesPerMinute: number;
  eventTypeDistribution: EventTypeStats;
  uptime: number;
  lastActivity: string;
}

export type GeneratorAction = 'start' | 'pause' | 'resume' | 'stop';

export interface ControlPanelProps {
  state: MessageGeneratorState;
  connectionState: ConnectionState;
  onAction: (action: GeneratorAction, data?: any) => void;
}

export interface EventListProps {
  events: WebSocketEvent[];
  maxEvents?: number;
}

export interface StatsPanelProps {
  stats: DashboardStats;
  state: MessageGeneratorState;
}
