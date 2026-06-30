import { IJWTPair } from '@/types/JWTPair';
import { IJWTPayload } from '@/types/JWTPayload';

export interface IJWTTokenService {
  sign(payload: IJWTPayload): IJWTPair;
  refresh(refresh: string): Promise<IJWTPair>;
  checkAccess(access: string): boolean;
  decode(access: string): IJWTPayload;
}
