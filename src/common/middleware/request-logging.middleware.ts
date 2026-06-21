import { Inject, Injectable, LoggerService, NestMiddleware } from '@nestjs/common';
import { EventEmitter } from 'events';
import { NextFunction, Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const start = Date.now();
    const responseEvents = response as Response & EventEmitter;

    responseEvents.once('finish', () => {
      const durationMs = Date.now() - start;
      this.logger.log(
        `${request.method} ${request.originalUrl} ${response.statusCode} ${durationMs}ms`,
      );
    });

    next();
  }
}
