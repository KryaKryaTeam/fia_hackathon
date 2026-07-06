import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ServiceTokens } from '@/common/Tokens';
import type { IJWTTokenService } from '@/authorization/application/bounds/IJWTTokenService';
import { Reflector } from '@nestjs/core';
import { ApiError, documentError, UserErrors } from '@/error/ApiError';
import { ApiBearerAuth } from '@nestjs/swagger';
import { WsException } from '@nestjs/websockets';

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
    const isSecure = this.reflector.getAllAndOverride(Authorization, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!isSecure) return true;

    const type = context.getType();
    let authorizationHeader: string | undefined;
    let targetObjectToAttachUser: any;

    if (type === 'http') {
      const request = context.switchToHttp().getRequest();
      authorizationHeader = request.headers.authorization;
      targetObjectToAttachUser = request;
    } else if (type === 'ws') {
      const client = context.switchToWs().getClient();
      authorizationHeader =
        client.handshake.auth?.token || client.handshake.headers?.authorization;

      targetObjectToAttachUser = client;
    }

    // Обробка помилок
    if (!authorizationHeader) {
      this.throwError(type, UserErrors.NO_AUTHORIZATION_HEADER);
    }

    const parts = authorizationHeader!.split(' ');
    if (parts[0] !== 'Bearer') {
      this.throwError(type, UserErrors.UNEXPECTED_FORMAT_OF_TOKEN);
    }

    const token = parts[1];
    if (!this.jwtService.checkAccess(token)) {
      this.throwError(type, UserErrors.UNAUTHORIZED);
    }

    const decoded = this.jwtService.decode(token);

    targetObjectToAttachUser['user_id'] = decoded.sub;
    targetObjectToAttachUser['user_role'] = decoded.role;

    return true;
  }

  private throwError(contextType: string, errorType: any) {
    if (contextType === 'ws') {
      throw new WsException(errorType?.message || 'Unauthorized');
    }
    ApiError.throw(errorType);
  }
}
