// src/components/ControlPanel.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Play, Pause, Square, RotateCcw, Settings } from 'lucide-react';
import type { ControlPanelProps } from '../types';
import { Button, Input, Flex, Card } from '../styles/GlobalStyles';

const ControlCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ControlSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ButtonGroup = styled(Flex)`
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const IntervalControl = styled(Flex)`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const IntervalInput = styled(Input)`
  width: 120px;
  text-align: center;
`;

const StatusInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surfaceHover};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ControlPanel: React.FC<ControlPanelProps> = ({
  state,
  connectionState,
  onAction,
}) => {
  const [intervalMs, setIntervalMs] = useState(state.intervalMs);
  const [isLoading, setIsLoading] = useState(false);

  const handleIntervalChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1000 && numValue <= 30000) {
      setIntervalMs(numValue);
    }
  };

  const handleUpdateInterval = async () => {
    setIsLoading(true);
    try {
      await onAction('start', { intervalMs }); // This will update the interval
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (action: string, data?: any) => {
    setIsLoading(true);
    try {
      await onAction(action, data);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = !connectionState.isConnected || isLoading;

  return (
    <ControlCard>
      <SectionTitle>Generator Controls</SectionTitle>
      
      <ControlSection>
        <ButtonGroup>
          <Button
            variant="success"
            onClick={() => handleAction('start', { intervalMs })}
            disabled={isDisabled || state.isRunning}
            size="md"
          >
            <Play size={16} />
            {isLoading ? 'Loading...' : 'Start'}
          </Button>
          
          <Button
            variant="warning"
            onClick={() => handleAction('pause')}
            disabled={isDisabled || !state.isRunning}
            size="md"
          >
            <Pause size={16} />
            {isLoading ? 'Loading...' : 'Pause'}
          </Button>
          
          <Button
            variant="warning"
            onClick={() => handleAction('resume')}
            disabled={isDisabled || state.isRunning}
            size="md"
          >
            <RotateCcw size={16} />
            {isLoading ? 'Loading...' : 'Resume'}
          </Button>
          
          <Button
            variant="error"
            onClick={() => handleAction('stop')}
            disabled={isDisabled}
            size="md"
          >
            <Square size={16} />
            {isLoading ? 'Loading...' : 'Stop'}
          </Button>
        </ButtonGroup>
      </ControlSection>

      <ControlSection>
        <SectionTitle>Settings</SectionTitle>
        <IntervalControl>
          <label htmlFor="interval">Interval (ms):</label>
          <IntervalInput
            id="interval"
            type="number"
            value={intervalMs}
            onChange={(e) => handleIntervalChange(e.target.value)}
            min="1000"
            max="30000"
            step="1000"
            disabled={isDisabled}
          />
          <Button
            variant="secondary"
            onClick={handleUpdateInterval}
            disabled={isDisabled}
            size="sm"
          >
            <Settings size={14} />
            Update
          </Button>
        </IntervalControl>
      </ControlSection>

      <ControlSection>
        <StatusInfo>
          <strong>Status:</strong>
          <span style={{ 
            color: state.isRunning ? '#10b981' : '#64748b',
            fontWeight: '500'
          }}>
            {state.isRunning ? 'Running' : 'Stopped'}
          </span>
          <span>•</span>
          <strong>Messages:</strong>
          <span>{state.messageCount}</span>
          <span>•</span>
          <strong>Interval:</strong>
          <span>{state.intervalMs}ms</span>
        </StatusInfo>
      </ControlSection>
    </ControlCard>
  );
};
