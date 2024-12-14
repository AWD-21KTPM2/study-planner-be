import { BaseResponse } from 'src/core/response/base/response.base';

export interface GetProfileResponse extends BaseResponse {
  email: string;
  name: string;
  avatar: string;
  phone: string;
  country: string;
  bio: string;
}
