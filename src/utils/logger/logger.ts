import { Logger, LoggerOptions, pino } from 'pino';

export type AppLogger = Logger<LoggerOptions>;

export const createLogger = (serviceName: string): Logger<LoggerOptions> => {
  const logger = pino({
    level: 'info',
    mixin() {
      return { service: serviceName, env: process.env.STAGE };
    },
  });

  return logger;
};
