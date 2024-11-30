import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() userData: { email: string; password: string }) {
    return this.userService.registerUser(userData);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() userData: { email: string; password: string }) {
    return this.userService.loginUser(userData);
  }

  @UseGuards(JwtAuthGuard) // Protect only this route
  @HttpCode(200)
  @Get('profile')
  getProfile(@Req() req: Request) {
    if (!req['user']) {
      return { message: 'No user logged in' };
    }
    return {
      message: 'User profile',
      data: {
        user: req['user'],
      },
    };
  }
}
