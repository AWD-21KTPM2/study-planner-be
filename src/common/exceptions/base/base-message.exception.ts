import { HttpException } from '@nestjs/common';
import { ERROR_CODE } from 'src/common/enums/error-code.enum';
export class BaseBusinessException extends HttpException {
  constructor(message: ERROR_CODE, detail: string, statusCode: number) {
    super(
      {
        message,
        detail,
      },
      statusCode,
    );
  }
}
