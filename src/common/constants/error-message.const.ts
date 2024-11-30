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
};
