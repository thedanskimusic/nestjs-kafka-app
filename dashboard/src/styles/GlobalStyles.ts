// src/styles/GlobalStyles.ts
import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.6;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    transition: all 0.2s ease;
  }

  input {
    font-family: inherit;
    outline: none;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.surfaceHover};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Grid = styled.div<{ columns?: number; gap?: string }>`
  display: grid;
  grid-template-columns: repeat(${({ columns = 1 }) => columns}, 1fr);
  gap: ${({ gap, theme }) => gap || theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

export const Flex = styled.div<{ 
  direction?: 'row' | 'column';
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch';
  gap?: string;
  wrap?: boolean;
}>`
  display: flex;
  flex-direction: ${({ direction = 'row' }) => direction};
  justify-content: ${({ justify = 'flex-start' }) => justify};
  align-items: ${({ align = 'flex-start' }) => align};
  gap: ${({ gap, theme }) => gap || theme.spacing.md};
  flex-wrap: ${({ wrap = false }) => wrap ? 'wrap' : 'nowrap'};
`;

export const Button = styled.button<{ 
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}>`
  padding: ${({ size, theme }) => {
    switch (size) {
      case 'sm': return `${theme.spacing.sm} ${theme.spacing.md}`;
      case 'lg': return `${theme.spacing.md} ${theme.spacing.xl}`;
      default: return `${theme.spacing.sm} ${theme.spacing.lg}`;
    }
  }};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 500;
  font-size: ${({ size }) => {
    switch (size) {
      case 'sm': return '0.875rem';
      case 'lg': return '1.125rem';
      default: return '1rem';
    }
  }};
  transition: all 0.2s ease;
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  
  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary};
          color: white;
          &:hover:not(:disabled) {
            background: ${theme.colors.primaryDark};
          }
        `;
      case 'secondary':
        return `
          background: ${theme.colors.surfaceHover};
          color: ${theme.colors.text};
          border: 1px solid ${theme.colors.border};
          &:hover:not(:disabled) {
            background: ${theme.colors.border};
          }
        `;
      case 'success':
        return `
          background: ${theme.colors.success};
          color: white;
          &:hover:not(:disabled) {
            opacity: 0.9;
          }
        `;
      case 'warning':
        return `
          background: ${theme.colors.warning};
          color: white;
          &:hover:not(:disabled) {
            opacity: 0.9;
          }
        `;
      case 'error':
        return `
          background: ${theme.colors.error};
          color: white;
          &:hover:not(:disabled) {
            opacity: 0.9;
          }
        `;
      default:
        return `
          background: ${theme.colors.primary};
          color: white;
          &:hover:not(:disabled) {
            background: ${theme.colors.primaryDark};
          }
        `;
    }
  }}
`;

export const Input = styled.input<{ error?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ error, theme }) => error ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  transition: border-color 0.2s ease;
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const StatusBadge = styled.span<{ status: 'connected' | 'disconnected' | 'connecting' }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  font-weight: 500;
  
  ${({ status, theme }) => {
    switch (status) {
      case 'connected':
        return `
          background: ${theme.colors.success}20;
          color: ${theme.colors.success};
        `;
      case 'connecting':
        return `
          background: ${theme.colors.warning}20;
          color: ${theme.colors.warning};
        `;
      case 'disconnected':
        return `
          background: ${theme.colors.error}20;
          color: ${theme.colors.error};
        `;
    }
  }}
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
  }
`;
