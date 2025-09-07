// src/components/EventList.tsx
import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Clock, User, ShoppingCart, CreditCard, Package, Bell, Globe, AlertTriangle, Activity } from 'lucide-react';
import type { EventListProps, WebSocketEvent } from '../types';
import { Card } from '../styles/GlobalStyles';

const EventListContainer = styled(Card)`
  height: 500px;
  display: flex;
  flex-direction: column;
`;

const EventListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const EventListTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const EventCount = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  background: ${({ theme }) => theme.colors.surfaceHover};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const EventScrollContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: ${({ theme }) => theme.spacing.sm};
`;

const EventItem = styled.div<{ eventType: string }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border-left: 4px solid ${({ eventType, theme }) => {
    const colors = {
      user_login: '#10b981',
      user_logout: '#64748b',
      order_created: '#3b82f6',
      order_updated: '#8b5cf6',
      payment_processed: '#f59e0b',
      inventory_updated: '#06b6d4',
      notification_sent: '#84cc16',
      api_call: '#6366f1',
      error_occurred: '#ef4444',
      system_health_check: '#8b5cf6',
    };
    return colors[eventType as keyof typeof colors] || theme.colors.border;
  }};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    transform: translateX(2px);
  }
`;

const EventIcon = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ color }) => color}20;
  color: ${({ color }) => color};
  flex-shrink: 0;
`;

const EventContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const EventHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const EventType = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  text-transform: capitalize;
  font-size: 0.875rem;
`;

const EventTime = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const EventDetails = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.4;
`;

const EventId = styled.span`
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.surfaceHover};
  padding: 2px 6px;
  border-radius: 4px;
`;

const getEventIcon = (eventType: string) => {
  const icons = {
    user_login: User,
    user_logout: User,
    order_created: ShoppingCart,
    order_updated: ShoppingCart,
    payment_processed: CreditCard,
    inventory_updated: Package,
    notification_sent: Bell,
    api_call: Globe,
    error_occurred: AlertTriangle,
    system_health_check: Activity,
  };
  return icons[eventType as keyof typeof icons] || Activity;
};

const getEventColor = (eventType: string) => {
  const colors = {
    user_login: '#10b981',
    user_logout: '#64748b',
    order_created: '#3b82f6',
    order_updated: '#8b5cf6',
    payment_processed: '#f59e0b',
    inventory_updated: '#06b6d4',
    notification_sent: '#84cc16',
    api_call: '#6366f1',
    error_occurred: '#ef4444',
    system_health_check: '#8b5cf6',
  };
  return colors[eventType as keyof typeof colors] || '#64748b';
};

const formatEventDetails = (event: WebSocketEvent): string => {
  if (event.type === 'message:generated' && event.data.message) {
    const msg = event.data.message;
    const details = [];
    
    if (msg.userId) details.push(`User: ${msg.userId}`);
    if (msg.orderId) details.push(`Order: ${msg.orderId}`);
    if (msg.amount) details.push(`Amount: $${msg.amount}`);
    if (msg.paymentId) details.push(`Payment: ${msg.paymentId}`);
    if (msg.productId) details.push(`Product: ${msg.productId}`);
    if (msg.quantity) details.push(`Qty: ${msg.quantity}`);
    if (msg.endpoint) details.push(`Endpoint: ${msg.endpoint}`);
    if (msg.statusCode) details.push(`Status: ${msg.statusCode}`);
    if (msg.errorCode) details.push(`Error: ${msg.errorCode}`);
    
    return details.join(' • ') || 'Event generated';
  }
  
  if (event.type === 'generator:stateUpdated' && event.data.state) {
    const state = event.data.state;
    return `Running: ${state.isRunning}, Messages: ${state.messageCount}, Interval: ${state.intervalMs}ms`;
  }
  
  return event.data.message || 'Event occurred';
};

export const EventList: React.FC<EventListProps> = ({ events, maxEvents = 100 }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new events arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  const displayEvents = events.slice(-maxEvents);
  const eventType = (event: WebSocketEvent) => {
    if (event.type === 'message:generated' && event.data.message) {
      return event.data.message.eventType;
    }
    return event.type.split(':')[0];
  };

  return (
    <EventListContainer>
      <EventListHeader>
        <EventListTitle>Real-time Events</EventListTitle>
        <EventCount>{events.length} events</EventCount>
      </EventListHeader>
      
      <EventScrollContainer ref={scrollRef}>
        {displayEvents.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#94a3b8', 
            padding: '2rem',
            fontStyle: 'italic'
          }}>
            No events yet. Start the generator to see real-time events!
          </div>
        ) : (
          displayEvents.map((event, index) => {
            const type = eventType(event);
            const Icon = getEventIcon(type);
            const color = getEventColor(type);
            const details = formatEventDetails(event);
            
            return (
              <EventItem key={index} eventType={type}>
                <EventIcon color={color}>
                  <Icon size={16} />
                </EventIcon>
                
                <EventContent>
                  <EventHeader>
                    <EventType>{type.replace('_', ' ')}</EventType>
                    <EventTime>
                      <Clock size={12} />
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </EventTime>
                  </EventHeader>
                  
                  <EventDetails>
                    {details}
                    {event.data.message?.id && (
                      <>
                        <br />
                        <EventId>ID: {event.data.message.id}</EventId>
                      </>
                    )}
                  </EventDetails>
                </EventContent>
              </EventItem>
            );
          })
        )}
      </EventScrollContainer>
    </EventListContainer>
  );
};
