import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  // Registration method without token generation
  async registerUser(userData: { email: string; password: string }) {
    const { email, password } = userData;

    // Check if user exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
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
      message: 'User registered successfully',
      data: {
        email: newUser.email,
      },
    };
  }

  // Login method with token generation
  async loginUser(userData: { email: string; password: string }) {
    const { email, password } = userData;

    // Find user by email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Generate JWT token
    const payload = { email: user.email, sub: user._id };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      data: {
        id: user._id,
        email: user.email,
        token,
      },
    };
  }
}
