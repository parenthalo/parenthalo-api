import { Inject, Injectable, LoggerService, NestMiddleware } from '@nestjs/common';
import { EventEmitter } from 'events';
import { NextFunction, Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { RequestWithCorrelationId } from '../request/request-with-correlation-id';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const start = Date.now();
    const responseEvents = response as Response & EventEmitter;

    responseEvents.once('finish', () => {
      const durationMs = Date.now() - start;
      const correlationId = (request as RequestWithCorrelationId).correlationId ?? 'unknown';

      this.logger.log({
        message: 'request completed',
        correlationId,
        method: request.method,
        url: request.originalUrl,
        statusCode: response.statusCode,
        durationMs,
      });
    });

    next();
  }
}
