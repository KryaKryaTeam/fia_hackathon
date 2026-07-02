import { IAuthProviderRepository } from '@/authorization/application/bounds/IAuthProviderRepository';
import { BaseRepository } from './BaseRepository';
import { AuthProviderEntity } from '@/authorization/domain/entities/AuthProvider.entity';
import { AuthorizationProvider } from '@/schemas/AuthorizationProvider.schema';
import { Inject, Injectable } from '@nestjs/common';
import { MapperTokens } from '@/common/Tokens';
import { AuthorizationProviderMapper } from '@/authorization/application/mappers/AuthorizationProviderMapper';

@Injectable()
export class AuthorizationProviderRepository
  extends BaseRepository<AuthorizationProvider>
  implements IAuthProviderRepository
{
  @Inject(MapperTokens.AuthorizationProviderMapper)
  private authProviderMapper: AuthorizationProviderMapper;

  protected _entitySchema = AuthorizationProvider;

  async save(provider: AuthProviderEntity): Promise<void> {
    const schemaData = this.authProviderMapper.toSchema(provider);

    await this.repository.upsert(schemaData);
  }

  async findBelongToUser(userId: string): Promise<AuthProviderEntity[] | null> {
    const res = await this.repository.find({
      userId: userId,
    });

    if (!res || res.length === 0) return null;

    return res.map((schema) => this.authProviderMapper.toEntity(schema));
  }

  async findById(providerId: string): Promise<AuthProviderEntity | null> {
    const res = await this.repository.findOne({ id: providerId });
    if (!res) return null;

    return this.authProviderMapper.toEntity(res);
  }

  async findByProviderId(
    providerId: string,
  ): Promise<AuthProviderEntity | null> {
    const res = await this.repository.findOne({ providerId });

    if (!res) return null;

    return this.authProviderMapper.toEntity(res);
  }
}
