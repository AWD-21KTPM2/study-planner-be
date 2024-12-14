import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { JWT_CONST, JWT_OBJECT } from 'src/common/constants/jwt.const';

import { InvalidOrExpiredToken } from 'src/common/exceptions/jwt.exception';
import { convertTimeFromSeconds } from 'src/common/utils/time.util';

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
      req[JWT_OBJECT] = null;
      return next(); // If no token, skip adding user data for backward compatibility
    }

    try {
      const secret = this.configService.get<string>(JWT_CONST.JWT_SECRET);
      const decoded = this.jwtService.verify(token, { secret });

      // Convert iat and exp to ISO format if present
      decoded.iat = convertTimeFromSeconds(decoded.iat);
      decoded.exp = convertTimeFromSeconds(decoded.exp);

      req[JWT_OBJECT] = decoded;
    } catch (error) {
      throw new InvalidOrExpiredToken();
    }

    next();
  }
}
