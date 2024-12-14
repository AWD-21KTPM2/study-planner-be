import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { RegistryUserDto } from './dto/registry-user.dto';
import { JwtRefreshTokenDto } from './dto/jwt-refresh-token.dto';
import { JWT_CONST, JWT_OBJECT } from 'src/common/constants/jwt.const';
import { JwtPayload } from 'src/common/types/jwt.type';
import { ResponseData } from 'src/common/types/common.type';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('users')
@Controller('user')
export class UserController {
  // constructor(private readonly userService: UserService) {}
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

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
    const refreshTokenResponse = this.userService.refreshToken(tokenData);

    return {
      message: JWT_CONST.JWT_REFRESH_TOKEN_SUCCESS,
      data: refreshTokenResponse,
    } as ResponseData<Promise<JwtPayload>>;
  }

  @ApiBearerAuth()
  @Get('profile')
  @ApiOkResponse({
    description: 'User profile',
    schema: { example: { email: 'example@email.com' } },
  })
  getProfileByEmail(@Req() req: Request) {
    const { email } = req[JWT_OBJECT];
    console.log('email', email);

    return this.userService.getProfileByEmail(email);
  }

  // New endpoint for Google OAuth login
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOkResponse({ description: 'Initiates Google OAuth' })
  async googleAuth() {
    // Initiates the Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOkResponse({ description: 'Handles Google OAuth callback' })
  async googleAuthRedirect(@Req() req: any) {
    const user = req.user; // User data from Google Strategy
    const jwtPayload = { id: user.id, email: user.email };

    // Generate JWT token
    const accessToken = this.jwtService.sign(jwtPayload);

    return {
      message: 'Login successful',
      data: { user, accessToken },
    };
  }

  @Post('google-login')
  @ApiBody({
    description: 'Login using Google token',
    schema: { example: { token: 'GoogleIdToken' } },
  })
  @ApiCreatedResponse({ description: 'User logged in via Google' })
  async googleLogin(@Body('token') token: string) {
    return this.userService.googleLogin(token); // Delegates to a method in UserService
  }
}
