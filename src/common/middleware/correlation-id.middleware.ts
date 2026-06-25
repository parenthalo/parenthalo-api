import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { CORRELATION_ID_HEADER } from '../request/correlation-id.constants';
import { RequestWithCorrelationId } from '../request/request-with-correlation-id';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    const incomingCorrelationId = request.header(CORRELATION_ID_HEADER);
    const correlationId = incomingCorrelationId?.trim() || randomUUID();

    (request as RequestWithCorrelationId).correlationId = correlationId;
    response.setHeader(CORRELATION_ID_HEADER, correlationId);
    next();
  }
}
