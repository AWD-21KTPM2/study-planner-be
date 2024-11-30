import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class JwtRefreshTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  refreshToken: string;
}
