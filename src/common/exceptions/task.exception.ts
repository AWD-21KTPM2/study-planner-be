import { ERROR_MESSAGE } from '../constants/error-message.const';
import { ERROR_CODE } from '../enums/error-code.enum';
import { BaseBusinessException } from './base/base-message.exception';

export class TaskNotFoundException extends BaseBusinessException {
  constructor() {
    super(
      ERROR_CODE.TASK_NOT_FOUND,
      ERROR_MESSAGE[ERROR_CODE.TASK_NOT_FOUND],
      401,
    );
  }
}

export class TaskAlreadyExistsException extends BaseBusinessException {
  constructor() {
    super(
      ERROR_CODE.TASK_ALREADY_EXISTS,
      ERROR_MESSAGE[ERROR_CODE.TASK_ALREADY_EXISTS],
      401,
    );
  }
}

export class TaskQueryException extends BaseBusinessException {
  constructor() {
    super(
      ERROR_CODE.TASK_QUERY_EXCEPTION,
      ERROR_MESSAGE[ERROR_CODE.TASK_QUERY_EXCEPTION],
      401,
    );
  }
}
