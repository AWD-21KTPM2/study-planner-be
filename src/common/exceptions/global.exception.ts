import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { COMMON_CONST } from '../constants/common.const';
import { ERROR_MESSAGE } from '../constants/error-message.const';
import { ERROR_CODE } from '../enums/error-code.enum';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly config_service: ConfigService) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    const message =
      exception instanceof HttpException
        ? exception.message
        : ERROR_MESSAGE[ERROR_CODE.SERVER_ERROR];

    if (status == 400) {
      if (exception.response.message instanceof Array) {
        exception.response = exception.response.message.reduce((acc, curr) => {
          const [field, ...errorMessages] = curr.split(' ');
          acc[field] = (acc[field] || []).concat(errorMessages.join(' '));
          return acc;
        }, {});
      } else {
        const key = exception.response.message.split(' ')[0];
        exception.response = {
          [key]: exception.response.message.split(' ').slice(1).join(' '),
        };
      }
    }
    response.status(status).json({
      statusCode: status,
      message,
      errors:
        exception.response instanceof Object
          ? { ...exception.response }
          : exception.response,
      stack:
        this.config_service.get(COMMON_CONST.NODE_ENV) !== COMMON_CONST.PROD_ENV
          ? exception.stack
          : null,
    });
  }
}
