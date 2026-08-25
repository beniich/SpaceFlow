import Constants from 'expo-constants';

export const API_URL = Constants.expoConfig?.extra?.apiUrl || 'https://api.yourdomain.com';

export const COLORS = {
  light: {
    bg: '#ffffff',
    bgSubtle: '#f8fafc',
    text: '#000000',
    textSecondary: '#475569',
    border: '#e2e8f0',
    primary: '#ff5500',
    accent: '#00dbe7',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
  },
  dark: {
    bg: '#000000',
    bgSubtle: '#0a0a0a',
    text: '#ffffff',
    textSecondary: '#cbd5e1',
    border: '#27272a',
    primary: '#ff5500',
    accent: '#00dbe7',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
  },
};

export const PRIORITY_COLORS = {
  LOW: '#64748b',
  MEDIUM: '#3b82f6',
  HIGH: '#f59e0b',
  URGENT: '#ef4444',
  CRITICAL: '#dc2626',
};

export const STATUS_COLORS = {
  OPEN: '#3b82f6',
  IN_PROGRESS: '#f59e0b',
  RESOLVED: '#10b981',
  CLOSED: '#64748b',
  CANCELLED: '#94a3b8',
};
