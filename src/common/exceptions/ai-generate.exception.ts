import { ERROR_MESSAGE } from '../constants/error-message.const';
import { ERROR_CODE } from '../enums/error-code.enum';
import { BaseBusinessException } from './base/base-message.exception';

export class ErrorAnalyzeTaskException extends BaseBusinessException {
  constructor() {
    super(
      ERROR_CODE.AI_GENERATE_EXCEPTION,
      ERROR_MESSAGE[ERROR_CODE.AI_GENERATE_EXCEPTION],
      500,
    );
  }
}
