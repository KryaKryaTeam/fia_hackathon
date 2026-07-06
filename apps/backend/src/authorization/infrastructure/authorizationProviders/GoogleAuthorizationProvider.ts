import { AuthorizationProviderTypes } from '@/types/AuthorizationProvidersTypes';
import {
  BaseAuthorizationProvider,
  IHandshakeOutput,
} from './BaseAuthorizationProvider';
import { AuthProviderEntity } from '@/authorization/domain/entities/AuthProvider.entity';
import { randomUUID } from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { Injectable } from '@nestjs/common';
import { ApiError, UserErrors } from '@/error/ApiError';
import { AuthorizationProvider } from '../services/AuthorizationProviderService';

interface GoogleLoginData {
  token: string;
  code_verifier?: string;
}

@Injectable()
@AuthorizationProvider(AuthorizationProviderTypes.GOOGLE)
export class GoogleAuthorizationProvider extends BaseAuthorizationProvider<GoogleLoginData> {
  private _OAuthClient: OAuth2Client;
  private get OAuthClient() {
    if (!this._OAuthClient) {
      this._OAuthClient = new OAuth2Client({
        clientId: this.configurationService.getOrThrow('google.clientId'),
        clientSecret: this.configurationService.getOrThrow('google.secret'),
        redirectUri: this.configurationService.getOrThrow('google.redirectURI'),
      });
    }
    return this._OAuthClient;
  }

  protected type: AuthorizationProviderTypes =
    AuthorizationProviderTypes.GOOGLE;
  async validate(loginData: GoogleLoginData): Promise<boolean> {
    return new Promise((res) => res(loginData.token != null));
  }
  async handshake(loginData: GoogleLoginData): Promise<IHandshakeOutput> {
    try {
      let codeOrToken = loginData.token;
      if (
        codeOrToken &&
        !codeOrToken.includes('.') &&
        !codeOrToken.startsWith('eJ')
      ) {
        if (!loginData.code_verifier)
          throw new Error('No code_verifier property specified');
        const { tokens } = await this.OAuthClient.getToken({
          code: codeOrToken,
          codeVerifier: loginData.code_verifier,
        });
        if (!tokens.id_token) throw new Error('Cannot find id_token');
        codeOrToken = tokens.id_token;
      }

      const ticket = await this.OAuthClient.verifyIdToken({
        idToken: codeOrToken,
        audience: this.configurationService.getOrThrow('google.clientId'),
      });

      const payload = ticket.getPayload();

      if (!payload) {
        ApiError.throw(UserErrors.INVALID_LOGIN_DATA);
      }

      if (!payload.email_verified) {
        ApiError.throw(UserErrors.EMAIL_NOT_VERIFIED);
      }

      if (!payload.email || !payload.picture)
        ApiError.throw(UserErrors.INVALID_LOGIN_DATA);

      return {
        authorizationData: payload.sub,
        avatarURL: payload.picture,
        email: payload.email,
      };
    } catch (err) {
      console.error(
        'Detailed Google OAuth Error:',
        JSON.stringify(err, null, 2),
      );

      ApiError.throw(
        UserErrors.GOOGLE_AUTHORIZATION_FAILED,
        (err as Error).message,
      );
    }
  }
  createProvider(loginData: string): AuthProviderEntity {
    return new AuthProviderEntity({
      id: randomUUID(),
      providerId: loginData,
      type: AuthorizationProviderTypes.GOOGLE,
    });
  }
}
