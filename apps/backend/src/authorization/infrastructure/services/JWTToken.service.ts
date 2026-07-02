import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { IJWTTokenService } from '@/authorization/application/bounds/IJWTTokenService';
import type { IUserRepository } from '@/authorization/application/bounds/IUserRepository';
import { UserEntity } from '@/authorization/domain/entities/User.entity';
import { ReposTokens } from '@/common/Tokens';
import { IJWTPair } from '@/types/JWTPair';
import { IJWTPayload } from '@/types/JWTPayload';
import { ApiError, UserErrors } from '@/error/ApiError';

@Injectable()
export class JWTTokenService implements IJWTTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configurationService: ConfigService,

    @Inject(ReposTokens.UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  sign(payload: IJWTPayload): IJWTPair {
    const access = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: this.configurationService.getOrThrow<string>('jwt.access_secret'),
    });

    const refresh = this.jwtService.sign(payload, {
      expiresIn: '15d',
      secret:
        this.configurationService.getOrThrow<string>('jwt.refresh_secret'),
    });

    return { accessToken: access, refreshToken: refresh };
  }

  async refresh(refresh: string): Promise<IJWTPair> {
    const decode = this.jwtService.verify<IJWTPayload>(refresh, {
      secret:
        this.configurationService.getOrThrow<string>('jwt.refresh_secret'),
    });

    const updatedUser = await this.userRepository.findById(decode.sub);
    if (!updatedUser) ApiError.throw(UserErrors.REFRESH_TOKEN_IS_INVALID);

    return this.sign({
      sub: updatedUser.id,
      role: updatedUser.role,
    });
  }

  checkAccess(access: string): boolean {
    try {
      this.jwtService.verify<UserEntity>(access, {
        secret:
          this.configurationService.getOrThrow<string>('jwt.access_secret'),
      });
      return true;
    } catch {
      ApiError.throw(UserErrors.UNAUTHORIZED);
    }
  }

  decode(access: string): IJWTPayload {
    return this.jwtService.decode(access);
  }
}
