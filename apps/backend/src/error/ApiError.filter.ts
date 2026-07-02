import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Inject,
  Logger,
} from '@nestjs/common';
import { ApiError } from './ApiError';
import { Response as ResponseExpress } from 'express';
import { ConfigService } from '@nestjs/config';

@Catch()
export class ApiErrorExceptionsFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger('Exception Filter');

  constructor(@Inject() private readonly configService: ConfigService) {}

  //@ts-expect-error ddd
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: ResponseExpress = ctx.getResponse();

    if (exception instanceof ApiError) {
      const error = {
        code: exception.code,
        message: exception.message,
        cause: exception.cause,
        timestamp: new Date().toISOString(),
      };
      this.logger.error(error);
      return response.status(exception.status).json(error);
    }

    this.logger.error({
      code: 'ERR_000',
      message: 'Something went wrong on our side',
      cause: (exception as { message: string }).message,
      stack: (exception as { stack: string }).stack,
      timestamp: new Date().toISOString(),
    });
    response.status(500).json({
      code: 'ERR_000',
      message: 'Something went wrong on our side',
      cause: this.configService.getOrThrow<boolean>('server.isPreview')
        ? (exception as { message: string }).message
        : 'HIDDEN',
      stack: this.configService.getOrThrow<boolean>('server.isPreview')
        ? (exception as { stack: string }).stack
        : 'HIDDEN',
      timestamp: new Date().toISOString(),
    });
  }
}
