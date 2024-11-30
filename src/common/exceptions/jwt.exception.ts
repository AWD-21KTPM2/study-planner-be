import { ERROR_MESSAGE } from '../constants/error-message.const';
import { ERROR_CODE } from '../enums/error-code.enum';
import { BaseBusinessException } from './base/base-message.exception';

export class InvalidRefreshToken extends BaseBusinessException {
  constructor() {
    super(
      ERROR_CODE.JWT_INVALID_REFRESH_TOKEN,
      ERROR_MESSAGE[ERROR_CODE.JWT_INVALID_REFRESH_TOKEN],
      401,
    );
  }
}
