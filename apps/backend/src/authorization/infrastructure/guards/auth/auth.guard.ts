import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request as ExpressRequest } from 'express';
import { ServiceTokens } from '@/common/Tokens';
import type { IJWTTokenService } from '@/authorization/application/bounds/IJWTTokenService';
import { Reflector } from '@nestjs/core';
import { ApiError, documentError, UserErrors } from '@/error/ApiError';
import { ApiBearerAuth } from '@nestjs/swagger';

export const Authorization = Reflector.createDecorator();
export const Secure = () => {
  return applyDecorators(
    documentError([
      UserErrors.NO_AUTHORIZATION_HEADER,
      UserErrors.UNEXPECTED_FORMAT_OF_TOKEN,
      UserErrors.UNAUTHORIZED,
    ]),
    ApiBearerAuth('main'),
    Authorization(true),
  );
};

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject(ServiceTokens.JWTService)
  private readonly jwtService: IJWTTokenService;

  @Inject()
  private readonly reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: ExpressRequest = context.switchToHttp().getRequest();

    const isSecure = this.reflector.getAllAndOverride(Authorization, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!isSecure) return true;

    const authorizatioHeader = request.headers.authorization;
    if (!authorizatioHeader) ApiError.throw(UserErrors.NO_AUTHORIZATION_HEADER);
    const parts = authorizatioHeader.split(' ');
    if (parts[0] != 'Bearer')
      ApiError.throw(UserErrors.UNEXPECTED_FORMAT_OF_TOKEN);
    if (!this.jwtService.checkAccess(parts[1]))
      ApiError.throw(UserErrors.UNAUTHORIZED);

    const decoded = this.jwtService.decode(parts[1]);

    request['user_id'] = decoded.sub;
    request['user_role'] = decoded.role;

    return true;
  }
}
