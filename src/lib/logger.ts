/**
 * Structured logging utility for the Matt Dinh Blog project
 * Only logs in development mode to avoid performance and security issues in production
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  data?: Record<string, any>;
  error?: Error;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(level: LogLevel, message: string, context?: LogContext): void {
    if (!this.isDevelopment) return;

    const timestamp = new Date().toISOString();
    const prefix = this.getLogPrefix(level);
    
    if (context) {
      console.log(`${prefix} [${timestamp}] ${message}`, context);
    } else {
      console.log(`${prefix} [${timestamp}] ${message}`);
    }
  }

  private getLogPrefix(level: LogLevel): string {
    switch (level) {
      case 'debug':
        return '🔍';
      case 'info':
        return '✅';
      case 'warn':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return '📝';
    }
  }

  debug(message: string, context?: LogContext): void {
    this.formatMessage('debug', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.formatMessage('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.formatMessage('warn', message, context);
  }

  error(message: string, context?: LogContext): void {
    this.formatMessage('error', message, context);
    
    // In production, you might want to send errors to a logging service
    if (!this.isDevelopment && context?.error) {
      // Example: Send to error tracking service like Sentry
      // captureException(context.error);
    }
  }

  // Specialized logging methods for common use cases
  dbQuery(message: string, context?: LogContext): void {
    this.debug(`DB: ${message}`, { component: 'database', ...context });
  }

  apiCall(message: string, context?: LogContext): void {
    this.debug(`API: ${message}`, { component: 'api', ...context });
  }

  imageUpload(message: string, context?: LogContext): void {
    this.debug(`IMG: ${message}`, { component: 'image-upload', ...context });
  }

  auth(message: string, data?: { userId?: string; action?: string }): void {
    this.info(`AUTH: ${message}`, { component: 'auth', data });
  }
}

// Export singleton instance
export const logger = new Logger();

// Export types for use in other files
export type { LogLevel, LogContext }; 