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

  // USER
  USER_NOT_FOUND = 'USR_0010',

  // TASK
  TASK_NOT_FOUND = 'TSK_0010',
  TASK_ALREADY_EXISTS = 'TSK_0011',
  TASK_QUERY_EXCEPTION = 'TSK_0012',
}
