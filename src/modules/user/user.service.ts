import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWT_CONST } from 'src/common/constants/jwt.const';
import {
  EmailExistedException,
  InvalidCredentialsException,
} from 'src/common/exceptions/auth.exception';
import { InvalidRefreshToken } from 'src/common/exceptions/jwt.exception';
import { AUTH_CONST } from 'src/common/constants/auth.const';
import { JwtPayload } from 'src/common/types/jwt.type';
import { JwtRefreshTokenDto } from './dto/jwt-refresh-token.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserResponse } from 'src/common/types/user.type';
import { toString } from '../../../node_modules/@types/validator/index.d';
import { convertTime } from 'src/common/utils/time.util';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Registration method without token generation
  async registerUser(userData: {
    email: string;
    password: string;
  }): Promise<RegisterUserResponse> {
    const { email, password } = userData;

    // Check if user exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new EmailExistedException();
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
    });
    await newUser.save();

    return {
      id: newUser._id.toString(),
      email: newUser.email,
      createdAt: convertTime(newUser.createdAt),
      updatedAt: convertTime(newUser.updatedAt),
    };
  }

  // Login method with token generation
  // async loginUser(userData: LoginUserDto) {
  //   const { email, password } = userData;
  //   const refreshTokenExpiration = this.configService.get<string>(
  //     JWT_CONST.JWT_REFRESH_EXPIRES_IN,
  //   );

  //   // Find user by email
  //   const user = await this.userModel.findOne({ email });
  //   if (!user) {
  //     throw new InvalidCredentialsException();
  //   }

  //   // Validate password
  //   const isPasswordValid = await bcrypt.compare(password, user.password);
  //   if (!isPasswordValid) {
  //     throw new InvalidCredentialsException();
  //   }

  //   // Generate JWT token
  //   const payload: JwtPayload = { id: user._id.toString(), email: user.email };

  //   const accessToken = this.jwtService.sign(payload);
  //   const refreshToken = this.jwtService.sign(payload, {
  //     expiresIn: refreshTokenExpiration,
  //   });

  //   // Save refresh token to user
  //   user.refreshToken = refreshToken;
  //   await user.save();

  //   payload.accessToken = accessToken;
  //   payload.refreshToken = refreshToken;

  //   return payload;
  // }

  async loginUser(userData: LoginUserDto) {
    const { email, password } = userData;
    const refreshTokenExpiration = this.configService.get<string>(
      JWT_CONST.JWT_REFRESH_EXPIRES_IN,
    );

    // Find user by email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new InvalidCredentialsException();
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    // Generate JWT token
    const payload: JwtPayload = { id: user._id.toString(), email: user.email };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: refreshTokenExpiration,
    });

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    return {
      data: {
        id: payload.id,
        email: payload.email,
        accessToken,
        refreshToken,
      },
      message: 'Login successful',
    };
  }

  // Method to refresh tokens
  async refreshToken(tokenData: JwtRefreshTokenDto): Promise<JwtPayload> {
    // Decode and verify the refresh token
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(tokenData.refreshToken);
    } catch (e) {
      throw new InvalidRefreshToken();
    }

    const userId = payload.id;

    // Find user by ID
    const user = await this.userModel.findById(userId);

    if (!user || !user.refreshToken) {
      throw new InvalidRefreshToken();
    }

    if (user.refreshToken !== tokenData.refreshToken) {
      throw new InvalidRefreshToken();
    }

    // Generate new access token and refresh token
    const newAccessToken = this.jwtService.sign({
      id: payload.id,
      email: payload.email,
    });

    payload.accessToken = newAccessToken;

    return {
      id: payload.id,
      email: payload.email,
      accessToken: newAccessToken,
    };
  }
}
