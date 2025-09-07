// src/components/StatsPanel.tsx
import React from 'react';
import styled from 'styled-components';
import { Activity, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import type { StatsPanelProps } from '../types';
import { Card, Grid } from '../styles/GlobalStyles';

const StatCard = styled(Card)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const StatIcon = styled.div<{ color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ color }) => color}20;
  color: ${({ color }) => color};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
`;

const StatSubtext = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const EventTypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const EventTypeItem = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ color }) => color}10;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border-left: 3px solid ${({ color }) => color};
`;

const EventTypeDot = styled.div<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ color }) => color};
`;

const EventTypeLabel = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

const EventTypeCount = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-left: auto;
`;

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };


  const eventTypeColors = {
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

  const sortedEventTypes = Object.entries(stats.eventTypeDistribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6); // Show top 6 event types

  return (
    <Grid columns={4} gap="1rem">
      <StatCard>
        <StatIcon color="#3b82f6">
          <Activity size={24} />
        </StatIcon>
        <StatValue>{stats.totalMessages}</StatValue>
        <StatLabel>Total Messages</StatLabel>
        <StatSubtext>Generated</StatSubtext>
      </StatCard>

      <StatCard>
        <StatIcon color="#10b981">
          <TrendingUp size={24} />
        </StatIcon>
        <StatValue>{stats.messagesPerMinute}</StatValue>
        <StatLabel>Messages/Min</StatLabel>
        <StatSubtext>Current Rate</StatSubtext>
      </StatCard>

      <StatCard>
        <StatIcon color="#f59e0b">
          <Clock size={24} />
        </StatIcon>
        <StatValue>{formatUptime(stats.uptime)}</StatValue>
        <StatLabel>Uptime</StatLabel>
        <StatSubtext>Since Start</StatSubtext>
      </StatCard>

      <StatCard>
        <StatIcon color="#8b5cf6">
          <BarChart3 size={24} />
        </StatIcon>
        <StatValue>{Object.keys(stats.eventTypeDistribution).length}</StatValue>
        <StatLabel>Event Types</StatLabel>
        <StatSubtext>Active</StatSubtext>
      </StatCard>

      {/* Event Type Distribution */}
      <div style={{ gridColumn: '1 / -1' }}>
        <Card>
          <h3 style={{ 
            marginBottom: '1rem', 
            fontSize: '1.125rem', 
            fontWeight: '600',
            color: '#1e293b'
          }}>
            Event Type Distribution
          </h3>
          <EventTypeGrid>
            {sortedEventTypes.map(([eventType, count]) => (
              <EventTypeItem 
                key={eventType} 
                color={eventTypeColors[eventType as keyof typeof eventTypeColors] || '#64748b'}
              >
                <EventTypeDot 
                  color={eventTypeColors[eventType as keyof typeof eventTypeColors] || '#64748b'} 
                />
                <EventTypeLabel>
                  {eventType.replace('_', ' ')}
                </EventTypeLabel>
                <EventTypeCount>{count}</EventTypeCount>
              </EventTypeItem>
            ))}
          </EventTypeGrid>
        </Card>
      </div>
    </Grid>
  );
};
