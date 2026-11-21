import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

type ErrorResponseBody = {
  statusCode: number;
  error: string;
  message: string;
  details: unknown;
  path: string;
  timestamp: string;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : undefined;
    const responseObject =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? (exceptionResponse as Record<string, unknown>)
        : undefined;
    const rawMessage = responseObject?.message ?? exceptionResponse;
    const hasValidationDetails =
      typeof rawMessage === 'object' && rawMessage !== null;

    const body: ErrorResponseBody = {
      statusCode,
      error:
        typeof responseObject?.error === 'string'
          ? responseObject.error
          : statusCode >= 500
            ? 'Internal Server Error'
            : 'Request Error',
      message: hasValidationDetails
        ? 'Validasi input gagal'
        : typeof rawMessage === 'string'
          ? rawMessage
          : Array.isArray(rawMessage)
            ? rawMessage.join(', ')
            : 'Terjadi kesalahan',
      details: hasValidationDetails ? rawMessage : null,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(statusCode).json(body);
  }
}
