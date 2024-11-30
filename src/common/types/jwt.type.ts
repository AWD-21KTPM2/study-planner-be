export interface JwtPayload {
  id: string;
  email: string;
  accessToken?: string;
  refreshToken?: string;
}
