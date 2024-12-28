import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { JWT_CONST } from 'src/common/constants/jwt.const';
import {
  EmailExistedException,
  InvalidCredentialsException,
} from 'src/common/exceptions/auth.exception';
import { InvalidRefreshToken } from 'src/common/exceptions/jwt.exception';
import { JwtPayload } from 'src/common/types/jwt.type';
import { JwtRefreshTokenDto } from './dto/jwt-refresh-token.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserResponse } from 'src/common/types/user.type';
import { convertTime } from 'src/common/utils/time.util';
import { UserNotFoundException } from 'src/common/exceptions/user.exception';
import { GetProfileResponse } from './response/get-profile.res';

@Injectable()
export class UserService {
  private googleClient: OAuth2Client;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.googleClient = new OAuth2Client(
      this.configService.get('GOOGLE_CLIENT_ID'),
    );
  }

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

  async fetchGoogleProfile(token: string) {
    const payload = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!payload.ok) {
      throw new HttpException('Invalid Google token', HttpStatus.UNAUTHORIZED);
    }

    return payload.json();
  }
  // Google Login Method
  async googleLogin(token: string) {
    const googleProfile = await this.fetchGoogleProfile(token);

    if (!googleProfile) {
      throw new HttpException('Invalid Google token', HttpStatus.UNAUTHORIZED);
    }

    const { email } = googleProfile;
    let user = await this.userModel.findOne({ email });

    if (!user) {
      // Register user if not already in the database
      user = new this.userModel({
        email,
        password: '', // Password is empty because it's OAuth
        // name,
        // profilePicture: picture,
      });
      await user.save();
    }

    // Generate JWT token
    const jwtPayload: JwtPayload = {
      id: user._id.toString(),
      email: user.email,
    };
    const accessToken = this.jwtService.sign(jwtPayload);
    const refreshToken = this.jwtService.sign(jwtPayload, {
      expiresIn: this.configService.get<string>(
        JWT_CONST.JWT_REFRESH_EXPIRES_IN,
      ),
    });

    return {
      message: 'Google login successful',
      data: {
        id: user._id.toString(),
        email: user.email,
        // name: user.name,
        // profilePicture: user.profilePicture,
        refreshToken,
        accessToken,
      },
    };
  }

  // Method to refresh tokens
  async refreshToken(tokenData: JwtRefreshTokenDto): Promise<JwtPayload> {
    if (!tokenData.refreshToken) {
      throw new InvalidRefreshToken();
    }

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

  async getProfileByEmail(email: string): Promise<GetProfileResponse> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UserNotFoundException();
    }

    const { refreshToken, password, authProvider, ...mappedUser } =
      user.toObject();

    return mappedUser;
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Save the token and expiration in the database
    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiration
    await user.save();

    console.log('already go to sendEmail!!');
    // Send email with reset token (implement email sending logic here)
    await this.sendResetEmail(email, resetToken);
  }

  // private async sendResetEmail(email: string, token: string): Promise<void> {
  //   const resetUrl = `http://your-frontend-url.com/reset-password/${token}`;

  //   // Use a mailing service like SendGrid, Nodemailer, etc.
  //   console.log(`Send password reset email to ${email} with link: ${resetUrl}`);
  // }

  private async sendResetEmail(email: string, token: string): Promise<void> {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email service (e.g., Gmail, SendGrid)
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });

    const resetUrl = `${this.configService.get<string>('FE_URL')}/reset-password/${token}`;

    // Send the email
    await transporter.sendMail({
      // from: this.configService.get<string>('EMAIL_USER'),
      from: '"Study Planner" <no-reply@dinhquytrieu@gmail.com>',
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>This link is valid for 15 minutes.</p>
      `,
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await this.userModel.findOne({
      passwordResetToken: resetTokenHash,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.BAD_REQUEST,
      );
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
  }
}
