import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';
    let data: any = null;

    if (exception instanceof BadRequestException) {
      const res: any = exception.getResponse();
      status = exception.getStatus();
      message = 'Validation error';
      error = 'Bad Request';
      data = {
        validation: Array.isArray(res.message) ? res.message : [res.message],
      };
    } else if (exception instanceof HttpException) {
      const res: any = exception.getResponse();
      status = exception.getStatus();
      message = res.message || 'Error';
      error = res.error || 'HttpException';
      data = res.data || null;
    }

    response.status(status).json({
      message,
      error,
      data,
    });
  }
}
