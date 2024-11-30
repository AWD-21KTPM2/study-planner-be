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

  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  @ApiOkResponse({ description: 'User profile' })
  getProfile(@Req() req: Request) {
    if (!req['user']) {
      throw new UnAuthorizedException();
    }
    return {
      message: 'User profile',
      data: {
        user: req['user'],
      },
    };
  }
}
