import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegistryUserDto } from './dto/registry-user.dto';
import { UnAuthorizedException } from 'src/common/exceptions/auth.exception';
import { JwtRefreshTokenDto } from './dto/jwt-refresh-token.dto';
import { JWT_CONST } from 'src/common/constants/jwt.const';
import { JwtPayload } from 'src/common/types/jwt.type';
import { ResponseData } from 'src/common/types/common.type';

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiCreatedResponse({ description: 'User registered' })
  @ApiBody({ type: RegistryUserDto })
  async register(@Body() userData: RegistryUserDto) {
    return this.userService.registerUser(userData);
  }

  @Post('login')
  @ApiBody({ type: LoginUserDto })
  @ApiCreatedResponse({ description: 'User logged in' })
  async login(@Body() userData: LoginUserDto) {
    return this.userService.loginUser(userData);
  }

  @Post('refresh-token')
  @ApiBody({ type: JwtRefreshTokenDto })
  @ApiCreatedResponse({ description: 'Refresh token' })
  async refreshToken(@Body() tokenData: JwtRefreshTokenDto) {
    return this.userService.refreshToken(tokenData);
  }

  @ApiBearerAuth()
  @Get('profile')
  @ApiOkResponse({ description: 'User profile' })
  getProfile(@Body() tokenData: JwtRefreshTokenDto) {
    const refreshTokenResponse = this.userService.refreshToken(tokenData);

    return {
      message: JWT_CONST.JWT_REFRESH_TOKEN_SUCCESS,
      data: refreshTokenResponse,
    } as ResponseData<Promise<JwtPayload>>;
  }
}
