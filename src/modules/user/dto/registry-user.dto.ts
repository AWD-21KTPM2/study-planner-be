import { ApiProperty } from '@nestjs/swagger';

export class RegistryUserDto {
  @ApiProperty({ description: 'Email', example: 'study-plan@gmail.com' })
  email: string;

  @ApiProperty({ description: 'Password', example: 'password' })
  password: string;
}
