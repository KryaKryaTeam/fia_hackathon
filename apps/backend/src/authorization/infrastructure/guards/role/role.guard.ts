import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request as ExpressRequest } from 'express';
import { Observable } from 'rxjs';
import { RoleEnum } from '@/types/RoleEnum';

export const AllowRoles = Reflector.createDecorator<RoleEnum[]>();

@Injectable()
export class RoleGuard implements CanActivate {
  @Inject()
  private readonly reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: ExpressRequest = context.switchToHttp().getRequest();
    const roles = this.reflector.getAllAndOverride<RoleEnum>(AllowRoles, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) return true;

    if (!req['user_role']) return false;
    return roles.includes(req['user_role'] as RoleEnum);
  }
}
