import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErroInternoException } from '../exceptions/errointerno.exception';
import { BaseExceptionFilter } from '@nestjs/core';
import { MongooseError } from 'mongoose';
import { MongoError } from 'mongodb';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(
    exception:
      | HttpException
      | ErroInternoException
      | MongooseError
      | MongoError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (
      exception instanceof HttpException ||
      exception instanceof ErroInternoException
    ) {
      status = exception.getStatus();
    } else if (exception instanceof MongoError) {
      switch (exception.code) {
        case 11000:
          exception['message'] = 'Registro duplicado';
      }
    }

    const request = ctx.getRequest<Request>();

    console.error(request.url);

    console.error('exception: ');
    console.error(exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message || '',
      tipo: exception.name === 'ErroInternoException' ? 1 : 0,
    });
  }
}
