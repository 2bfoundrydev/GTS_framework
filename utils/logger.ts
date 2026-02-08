import pino from 'pino';

// Configure Pino logger for Next.js
export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
});

// Convenience methods for common logging patterns
export const logApi = {
  request: (method: string, path: string, data?: unknown) =>
    logger.info({ method, path, data }, 'API Request'),
  
  response: (method: string, path: string, status: number, duration?: number) =>
    logger.info({ method, path, status, duration }, 'API Response'),
  
  error: (method: string, path: string, error: unknown) =>
    logger.error({ method, path, error }, 'API Error'),
};

export const logStripe = {
  webhook: (event: string, data?: unknown) =>
    logger.info({ event, data }, 'Stripe Webhook'),
  
  error: (operation: string, error: unknown) =>
    logger.error({ operation, error }, 'Stripe Error'),
};

export const logAuth = {
  signin: (userId: string) =>
    logger.info({ userId }, 'User signed in'),
  
  signout: (userId: string) =>
    logger.info({ userId }, 'User signed out'),
  
  error: (operation: string, error: unknown) =>
    logger.error({ operation, error }, 'Auth Error'),
};

