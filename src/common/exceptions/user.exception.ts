import { ERROR_MESSAGE } from '../constants/error-message.const';
import { ERROR_CODE } from '../enums/error-code.enum';
import { BaseBusinessException } from './base/base-message.exception';

export class UserNotFoundException extends BaseBusinessException {
  constructor() {
    super(
      ERROR_CODE.USER_NOT_FOUND,
      ERROR_MESSAGE[ERROR_CODE.USER_NOT_FOUND],
      401,
    );
  }
}
