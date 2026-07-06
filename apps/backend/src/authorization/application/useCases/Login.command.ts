import { Inject, Injectable } from '@nestjs/common';
import { Command } from '@/common/application/Command';
import { AuthorizationProviderTypes } from '@/types/AuthorizationProvidersTypes';
import type { IAuthorizationProviderService } from '../bounds/IAuthorizationProviderService';
import { ServiceTokens } from '@/common/Tokens';
import type { IJWTTokenService } from '../bounds/IJWTTokenService';

interface LoginCommandProps {
  type: AuthorizationProviderTypes;
  loginData: unknown;
}

interface LoginCommandOutput {
  accessToken: string;
  refreshToken: string;
  userExists: boolean;
}

@Injectable()
export class LoginCommand extends Command<
  LoginCommandProps,
  LoginCommandOutput
> {
  @Inject(ServiceTokens.AuthorizationProviderService)
  private readonly authorizationProviderService: IAuthorizationProviderService;

  @Inject(ServiceTokens.JWTService)
  private readonly jwtService: IJWTTokenService;

  async implementation(data: LoginCommandProps): Promise<LoginCommandOutput> {
    const { user, existsUser } =
      await this.authorizationProviderService.authorize(
        data.type,
        data.loginData,
      );

    // await this.userRepository.save(user);

    const tokens = this.jwtService.sign({
      role: user.role,
      sub: user.id,
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      userExists: existsUser,
    };
  }
}
