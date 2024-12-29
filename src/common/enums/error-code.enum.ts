export enum ERROR_CODE {
  // COMMON
  SERVER_ERROR = 'COM_0010',

  // JWT
  JWT_INVALID_REFRESH_TOKEN = 'JWT_0010',
  JWT_INVALID_OR_EXPIRED_TOKEN = 'JWT_0011',

  // AUTH
  AUTH_EMAIL_EXISTED = 'AUT_0010',
  AUTH_INVALID_CREDENTIALS = 'AUT_0011',
  AUTH_UNAUTHORIZED = 'AUT_0012',
  AUTH_ERROR_WHEN_REFRESH_TOKEN = 'AUT_0013',
  AUTH_EMAIL_IS_REQUIRED = 'AUT_0014',

  // USER
  USER_NOT_FOUND = 'USR_0010',

  // TASK
  TASK_NOT_FOUND = 'TSK_0010',
  TASK_ALREADY_EXISTS = 'TSK_0011',
  TASK_QUERY_EXCEPTION = 'TSK_0012',

  // AI GENERATE
  AI_GENERATE_EXCEPTION = 'AIG_0010',
  AI_GENERATE_FEEDBACK_EXCEPTION = 'AIG_0011',

  // TIMER
  TIMER_NOT_FOUND = 'TMR_0010',
}
