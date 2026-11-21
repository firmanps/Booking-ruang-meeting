import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { catchError, tap, throwError } from 'rxjs';
import { Logger } from 'winston';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const startedAt = Date.now();

    // Pakai pola route jika tersedia, supaya ID kontak tidak muncul di log.
    const route = request.route?.path;
    const routeName =
      typeof route === 'string' ? `${request.baseUrl}${route}` : request.path;

    const fields = (statusCode: number) => ({
      context: 'HTTP',
      method: request.method,
      route: routeName,
      statusCode,
      durationMs: Date.now() - startedAt,
    });

    return next.handle().pipe(
      tap(() => {
        this.logger.info('HTTP request completed', fields(response.statusCode));
      }),
      catchError((error: unknown) => {
        const statusCode =
          error instanceof HttpException ? error.getStatus() : 500;
        const logFields = fields(statusCode);

        if (statusCode >= 500) {
          this.logger.error('HTTP request failed', logFields);
        } else {
          this.logger.warn('HTTP request failed', logFields);
        }

        return throwError(() => error);
      }),
    );
  }
}
