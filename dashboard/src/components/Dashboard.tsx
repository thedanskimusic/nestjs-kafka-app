// src/components/Dashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { webSocketService } from '../services/websocket';
import { ControlPanel } from './ControlPanel';
import { StatsPanel } from './StatsPanel';
import { EventList } from './EventList';
import { StatusBadge, Container } from '../styles/GlobalStyles';
import type { 
  MessageGeneratorState, 
  WebSocketEvent, 
  ConnectionState, 
  DashboardStats,
  GeneratorAction,
  EventTypeStats 
} from '../types';

const DashboardContainer = styled(Container)`
  min-height: 100vh;
  padding-top: ${({ theme }) => theme.spacing.xl};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ConnectionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ErrorBanner = styled.div`
  background: ${({ theme }) => theme.colors.error}20;
  color: ${({ theme }) => theme.colors.error};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const Dashboard: React.FC = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    isConnected: false,
    reconnectAttempts: 0,
  });
  
  const [generatorState, setGeneratorState] = useState<MessageGeneratorState>({
    isRunning: false,
    intervalMs: 5000,
    messageCount: 0,
  });
  
  const [events, setEvents] = useState<WebSocketEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Calculate stats
  const calculateStats = useCallback((): DashboardStats => {
    const now = Date.now();
    const uptime = startTime ? Math.floor((now - startTime.getTime()) / 1000) : 0;
    
    // Calculate messages per minute
    const timeWindow = 60 * 1000; // 1 minute
    const recentEvents = events.filter(event => 
      now - new Date(event.timestamp).getTime() < timeWindow
    );
    const messagesPerMinute = recentEvents.filter(event => 
      event.type === 'message:generated'
    ).length;
    
    // Calculate event type distribution
    const eventTypeDistribution: EventTypeStats = {};
    events.forEach(event => {
      if (event.type === 'message:generated' && event.data.message) {
        const eventType = event.data.message.eventType;
        eventTypeDistribution[eventType] = (eventTypeDistribution[eventType] || 0) + 1;
      }
    });
    
    return {
      totalMessages: generatorState.messageCount,
      messagesPerMinute,
      eventTypeDistribution,
      uptime,
      lastActivity: generatorState.lastMessageTime || new Date().toISOString(),
    };
  }, [events, generatorState, startTime]);

  const stats = calculateStats();

  // WebSocket event handlers
  const handleConnectionEstablished = useCallback((data: any) => {
    setConnectionState(prev => ({
      ...prev,
      isConnected: true,
      clientId: data.clientId,
      reconnectAttempts: 0,
    }));
    setError(null);
  }, []);

  const handleConnectionLost = useCallback((data: any) => {
    setConnectionState(prev => ({
      ...prev,
      isConnected: false,
      reconnectAttempts: prev.reconnectAttempts + 1,
    }));
    setError(`Connection lost: ${data.reason}`);
  }, []);

  const handleConnectionError = useCallback((data: any) => {
    setConnectionState(prev => ({
      ...prev,
      isConnected: false,
      reconnectAttempts: prev.reconnectAttempts + 1,
    }));
    setError(`Connection error: ${data.error}`);
  }, []);

  const handleGeneratorStarted = useCallback((data: any) => {
    setStartTime(new Date());
    addEvent('generator:started', data);
  }, []);

  const handleGeneratorPaused = useCallback((data: any) => {
    addEvent('generator:paused', data);
  }, []);

  const handleGeneratorResumed = useCallback((data: any) => {
    addEvent('generator:resumed', data);
  }, []);

  const handleGeneratorStopped = useCallback((data: any) => {
    setStartTime(null);
    addEvent('generator:stopped', data);
  }, []);

  const handleStateUpdated = useCallback((data: any) => {
    if (data.state) {
      setGeneratorState(data.state);
    }
    addEvent('generator:stateUpdated', data);
  }, []);

  const handleMessageGenerated = useCallback((data: any) => {
    addEvent('message:generated', data);
  }, []);

  const handleError = useCallback((data: any) => {
    addEvent('error:occurred', data);
    setError(data.error?.message || 'An error occurred');
  }, []);

  const addEvent = useCallback((type: string, data: any) => {
    const event: WebSocketEvent = {
      type,
      data,
      timestamp: new Date().toISOString(),
    };
    
    setEvents(prev => [...prev, event].slice(-200)); // Keep last 200 events
  }, []);

  // Generator control handler
  const handleGeneratorAction = useCallback((action: GeneratorAction, data?: any) => {
    switch (action) {
      case 'start':
        webSocketService.startGenerator(data?.intervalMs || 5000);
        break;
      case 'pause':
        webSocketService.pauseGenerator();
        break;
      case 'resume':
        webSocketService.resumeGenerator();
        break;
      case 'stop':
        webSocketService.stopGenerator();
        break;
    }
  }, []);

  // Setup WebSocket listeners
  useEffect(() => {
    webSocketService.on('connection:established', handleConnectionEstablished);
    webSocketService.on('connection:lost', handleConnectionLost);
    webSocketService.on('connection:error', handleConnectionError);
    webSocketService.on('generator:started', handleGeneratorStarted);
    webSocketService.on('generator:paused', handleGeneratorPaused);
    webSocketService.on('generator:resumed', handleGeneratorResumed);
    webSocketService.on('generator:stopped', handleGeneratorStopped);
    webSocketService.on('generator:stateUpdated', handleStateUpdated);
    webSocketService.on('message:generated', handleMessageGenerated);
    webSocketService.on('error:occurred', handleError);

    // Connect to WebSocket
    webSocketService.connect().catch(err => {
      setError(`Failed to connect: ${err.message}`);
    });

    return () => {
      webSocketService.off('connection:established', handleConnectionEstablished);
      webSocketService.off('connection:lost', handleConnectionLost);
      webSocketService.off('connection:error', handleConnectionError);
      webSocketService.off('generator:started', handleGeneratorStarted);
      webSocketService.off('generator:paused', handleGeneratorPaused);
      webSocketService.off('generator:resumed', handleGeneratorResumed);
      webSocketService.off('generator:stopped', handleGeneratorStopped);
      webSocketService.off('generator:stateUpdated', handleStateUpdated);
      webSocketService.off('message:generated', handleMessageGenerated);
      webSocketService.off('error:occurred', handleError);
    };
  }, [
    handleConnectionEstablished,
    handleConnectionLost,
    handleConnectionError,
    handleGeneratorStarted,
    handleGeneratorPaused,
    handleGeneratorResumed,
    handleGeneratorStopped,
    handleStateUpdated,
    handleMessageGenerated,
    handleError,
  ]);

  const getConnectionStatus = () => {
    if (connectionState.isConnected) return 'connected';
    if (connectionState.reconnectAttempts > 0) return 'connecting';
    return 'disconnected';
  };

  return (
    <DashboardContainer>
      <Header>
        <Title>
          🚀 Kafka Dashboard
        </Title>
        <ConnectionStatus>
          <StatusBadge status={getConnectionStatus()}>
            {connectionState.isConnected ? (
              <>
                <Wifi size={12} />
                Connected
              </>
            ) : (
              <>
                <WifiOff size={12} />
                {connectionState.reconnectAttempts > 0 ? 'Reconnecting...' : 'Disconnected'}
              </>
            )}
          </StatusBadge>
          {connectionState.clientId && (
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
              ID: {connectionState.clientId.slice(0, 8)}...
            </span>
          )}
        </ConnectionStatus>
      </Header>

      {error && (
        <ErrorBanner>
          <AlertCircle size={16} />
          {error}
        </ErrorBanner>
      )}

      <MainContent>
        <LeftColumn>
          <ControlPanel
            state={generatorState}
            connectionState={connectionState}
            onAction={handleGeneratorAction}
          />
          <StatsPanel stats={stats} state={generatorState} />
        </LeftColumn>
        
        <RightColumn>
          <EventList events={events} maxEvents={100} />
        </RightColumn>
      </MainContent>
    </DashboardContainer>
  );
};
