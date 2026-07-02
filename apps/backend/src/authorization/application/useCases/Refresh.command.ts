import { Command } from '@/common/application/Command';
import { IJWTPair } from '@/types/JWTPair';
import type { IJWTTokenService } from '../bounds/IJWTTokenService';
import { Inject } from '@nestjs/common';
import { ServiceTokens } from '@/common/Tokens';
import { ApiError, UserErrors } from '@/error/ApiError';

export class RefreshCommand extends Command<string, IJWTPair> {
  @Inject(ServiceTokens.JWTService)
  private jwtTokenService: IJWTTokenService;

  async implementation(data: string): Promise<IJWTPair> {
    try {
      return await this.jwtTokenService.refresh(data);
    } catch {
      ApiError.throw(UserErrors.REFRESH_TOKEN_IS_INVALID);
    }
  }
}
