import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { JWT_CONST } from 'src/common/constants/jwt.const';
import { UnAuthorizedException } from 'src/common/exceptions/auth.exception';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next(); // If no token, skip adding user data for backward compatibility
    }

    try {
      const secret = this.configService.get<string>(JWT_CONST.JWT_SECRET);
      const decoded = this.jwtService.verify(token, { secret });
      req['user'] = decoded; // Attach decoded token data to request
    } catch (error) {
      throw new UnAuthorizedException();
    }

    next();
  }
}
