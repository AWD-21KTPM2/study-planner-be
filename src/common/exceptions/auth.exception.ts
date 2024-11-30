import { ERROR_MESSAGE } from '../constants/error-message.const';
import { ERROR_CODE } from '../enums/error-code.enum';
import { BaseBusinessException } from './base/base-message.exception';

export class UnAuthorizedException extends BaseBusinessException {
  constructor() {
    super(
      ERROR_CODE.AUTH_UNAUTHORIZED,
      ERROR_MESSAGE[ERROR_CODE.AUTH_UNAUTHORIZED],
      401,
    );
  }
}

export class InvalidCredentialsException extends BaseBusinessException {
  constructor() {
    super(
      ERROR_CODE.AUTH_INVALID_CREDENTIALS,
      ERROR_MESSAGE[ERROR_CODE.AUTH_INVALID_CREDENTIALS],
      401,
    );
  }
}

export class EmailExistedException extends BaseBusinessException {
  constructor() {
    super(
      ERROR_CODE.AUTH_EMAIL_EXISTED,
      ERROR_MESSAGE[ERROR_CODE.AUTH_EMAIL_EXISTED],
      400,
    );
  }
}
