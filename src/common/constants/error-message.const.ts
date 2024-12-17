import { ERROR_CODE } from 'src/common/enums/error-code.enum';

export const ERROR_MESSAGE = {
  // COMMON
  [ERROR_CODE.SERVER_ERROR]:
    'Server is busy, please try again later! (Internal Server Error)',

  // JWT
  [ERROR_CODE.JWT_INVALID_REFRESH_TOKEN]: 'Invalid refresh token',
  [ERROR_CODE.JWT_INVALID_OR_EXPIRED_TOKEN]: 'Invalid or expired token',

  // AUTH
  [ERROR_CODE.AUTH_EMAIL_EXISTED]: 'Email already in use',
  [ERROR_CODE.AUTH_INVALID_CREDENTIALS]: 'Invalid credentials',
  [ERROR_CODE.AUTH_UNAUTHORIZED]: 'Unauthorized',
  [ERROR_CODE.AUTH_ERROR_WHEN_REFRESH_TOKEN]: 'Error when refreshing token',
  [ERROR_CODE.AUTH_EMAIL_IS_REQUIRED]: 'Email is required',

  // USER
  [ERROR_CODE.USER_NOT_FOUND]: 'User not found',

  // TASK
  [ERROR_CODE.TASK_NOT_FOUND]: 'Task not found',
  [ERROR_CODE.TASK_ALREADY_EXISTS]: 'Task already exists',
  [ERROR_CODE.TASK_QUERY_EXCEPTION]:
    'Invalid query, please provide either id or userId',

  // AI GENERATE
  [ERROR_CODE.AI_GENERATE_EXCEPTION]: 'AI analysis for tasks failed',
};
