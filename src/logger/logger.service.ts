import { Injectable } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class LoggerService {
  private readonly logger: winston.Logger;
  private readonly httpLogger: winston.Logger;

  constructor() {
    const logFormat = winston.format.printf(
      (info: { timestamp: string; level: string; message: string }) =>
        `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`,
    );

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        logFormat,
      ),
      transports: [
        new winston.transports.File({ filename: 'logs/combined.log' }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
      ],
    });

    this.httpLogger = winston.createLogger({
      level: 'http',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        logFormat,
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/http.log' }),
      ],
    });
  }

  log(message: string) {
    const logMessage = message;
    this.logger.info(logMessage);
  }

  error(message: string, trace?: string) {
    const logMessage = `${message} - ${trace}`;
    this.logger.error(logMessage);
  }

  http(message: string) {
    this.httpLogger.http(message);
  }
}
