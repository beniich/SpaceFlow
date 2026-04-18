export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  SECURITY = 'SECURITY',
}

export class AuditLogger {
  static log(level: LogLevel, event: string, metadata: any = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      event,
      context: 'AUDITAX_INDUSTRIAL_V4',
      ...metadata,
    };

    // In production, this would send to OpenTelemetry or Datadog
    console.log(`[${level}] ${event}`, logEntry);

    // Optionally broadcast to a syslogs WebSocket channel
    // In actual implementation, this could hit /api/logs
  }

  static security(event: string, metadata: any = {}) {
    this.log(LogLevel.SECURITY, event, metadata);
  }
}
