import { RoleEnum } from './RoleEnum';

export interface IJWTPayload {
  iat?: number;
  sub: string;
  role: RoleEnum;
}
