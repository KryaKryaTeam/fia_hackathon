import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { IAuthProviderRepository } from '@/authorization/application/bounds/IAuthProviderRepository';
import type { IUserRepository } from '@/authorization/application/bounds/IUserRepository';
import { UserMapper } from '@/authorization/application/mappers/UserMapper';
import { FileErrors, ServiceErrors } from '@/error/ApiError';
import { AuthProviderEntity } from '@/authorization/domain/entities/AuthProvider.entity';
import { UserEntity } from '@/authorization/domain/entities/User.entity';
import { MapperTokens, ReposTokens, ServiceTokens } from '@/common/Tokens';
import { AuthorizationProviderTypes } from '@/types/AuthorizationProvidersTypes';
import { AuthorizationProviderService } from '../services/AuthorizationProviderService';
import type { ILoadFileService } from '@/files/application/bounds/ILoadFileService';
import { Readable } from 'stream';
import { InternalFile } from '@/files/domain/objects/InternalFile.object';
import { RelationSlots } from '@/types/RelationSlots';
import type { IFileRepository } from '@/files/application/bounds/IFileRepository';
import { FileEntity } from '@/files/domain/entities/File.entity';
import { RelationString } from '@/files/domain/objects/RelationSlots';
import { ApiError, UserErrors } from '@/error/ApiError';

export interface IHandshakeOutput {
  email: string;
  avatarURL: string;
  authorizationData: string; // providerId
}

@Injectable()
export abstract class BaseAuthorizationProvider<T> {
  protected abstract type: AuthorizationProviderTypes;

  @Inject(ReposTokens.UserRepository)
  protected userRepository: IUserRepository;

  @Inject(ReposTokens.AuthorizationProviderRepository)
  protected authProviderRepository: IAuthProviderRepository;

  @Inject(MapperTokens.UserMapper)
  protected userMapper: UserMapper;

  @Inject()
  protected configurationService: ConfigService;

  @Inject(ServiceTokens.AuthorizationProviderService)
  protected authorizartionProviderService: AuthorizationProviderService;

  @Inject(ServiceTokens.LoadFileService)
  private readonly loadFileService: ILoadFileService;

  @Inject(ReposTokens.FileRepository)
  private readonly fileRepostory: IFileRepository;

  async authorization(
    loginData: T,
  ): Promise<{ user: UserEntity; existsUser: boolean }> {
    if (!(await this.validate(loginData)))
      ApiError.throw(UserErrors.INVALID_LOGIN_DATA);

    const handshakeData = await this.handshake(loginData);

    console.log(handshakeData);

    let findUser = await this.userRepository.findByEmail(handshakeData.email);

    let existsUser: boolean;
    if (!findUser) {
      existsUser = false;

      let file: FileEntity;

      try {
        const response = await fetch(handshakeData.avatarURL, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept:
              'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*',
          },
        });

        if (!response.ok || !response.arrayBuffer)
          ApiError.throw(FileErrors.AVATAR_URL_UNAVAILABLE);
        const buffer = Buffer.from(await response.arrayBuffer());
        file = await this.loadFileService.loadFile(
          Readable.from(buffer),
          RelationString.define('user:avatar'),
        );

        await this.fileRepostory.save(file);
      } catch (err) {
        if ((err as { code: number | undefined }).code) throw err;
        ApiError.throw(ServiceErrors.MISCONFIGURED);
      }

      findUser = UserEntity.create(
        handshakeData.email,
        InternalFile.define<typeof RelationSlots.user.avatar>(
          `internal_file:${file.url}`,
          'user:avatar',
          'user:avatar',
        ),
      );

      const provider = this.createProvider(handshakeData.authorizationData);

      await findUser.linkProvider(provider, async (provider) => {
        return (
          (await this.authProviderRepository.findByProviderId(provider)) == null
        );
      });

      await this.userRepository.save(findUser);
    } else {
      existsUser = true;
      console.log('MEEEEEEEEEEEOW!!!');
      if (
        !findUser.hasAuthorizationProvider(this.type) ||
        !findUser.isAuthorizationDataCorrect(handshakeData.authorizationData)
      )
        ApiError.throw(UserErrors.UNAUTHORIZED);
    }
    return { user: findUser, existsUser };
  }

  abstract createProvider(loginData: string): AuthProviderEntity;
  abstract validate(loginData: T): Promise<boolean>;
  abstract handshake(loginData: T): Promise<IHandshakeOutput>;
}
