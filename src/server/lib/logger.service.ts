import pino, { Logger } from 'pino';
import { env } from '@/env';

declare global {
  var __logger: Logger | undefined;
}

if (!globalThis.__logger) {
  globalThis.__logger =
    env.NODE_ENV === 'production'
      ? pino({ level: 'warn' })
      : pino({
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
            },
          },
          level: 'debug',
        });
}

export const logger: Logger = globalThis.__logger;
