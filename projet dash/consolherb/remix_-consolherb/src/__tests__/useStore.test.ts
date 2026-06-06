import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../store/useStore';

describe('useStore', () => {
  beforeEach(() => {
    useStore.getState().clearLogs();
  });

  it('should add a log entry', () => {
    useStore.getState().addLog('info', 'Test log message');
    const logs = useStore.getState().logs;
    
    expect(logs.length).toBe(1);
    expect(logs[0].level).toBe('info');
    expect(logs[0].message).toBe('Test log message');
  });

  it('should clear all logs', () => {
    useStore.getState().addLog('error', 'Error message');
    useStore.getState().clearLogs();
    const logs = useStore.getState().logs;
    
    expect(logs.length).toBe(0);
  });
});
