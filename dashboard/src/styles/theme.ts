// src/styles/theme.ts
export const theme = {
  colors: {
    primary: '#3b82f6',
    primaryDark: '#2563eb',
    secondary: '#64748b',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceHover: '#f1f5f9',
    border: '#e2e8f0',
    text: '#1e293b',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
};

export const eventTypeColors = {
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
  default: '#64748b',
};
