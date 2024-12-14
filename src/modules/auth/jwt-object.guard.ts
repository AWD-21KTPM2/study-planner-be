import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JWT_OBJECT } from 'src/common/constants/jwt.const';
import { UnAuthorizedException } from 'src/common/exceptions/auth.exception';

@Injectable()
export class JwtObjectGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Check if JWT_OBJECT exists in the request
    if (!request[JWT_OBJECT]) {
      throw new UnAuthorizedException();
    }

    return true;
  }
}
