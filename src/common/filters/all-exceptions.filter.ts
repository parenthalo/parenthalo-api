import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiErrorResponse } from '../dto/api-response.dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

    const messageValue =
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
        ? (exceptionResponse as { message: string | string[] }).message
        : exceptionResponse;
    const message = this.toMessage(messageValue);

    if (status >= 500) {
      this.logger.error(exception instanceof Error ? exception.stack : exception);
    }

    const body: ApiErrorResponse = {
      success: false,
      error: {
        code: exception instanceof HttpException ? exception.name : 'InternalServerError',
        message,
        details: typeof exceptionResponse === 'object' ? exceptionResponse : undefined,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    };

    response.status(status).json(body);
  }

  private toMessage(value: unknown): string {
    if (Array.isArray(value)) {
      return value.map((item) => this.toMessage(item)).join(', ');
    }

    if (typeof value === 'string') {
      return value;
    }

    if (value instanceof Error) {
      return value.message;
    }

    if (value === null || value === undefined) {
      return 'Unexpected error';
    }

    return JSON.stringify(value);
  }
}
