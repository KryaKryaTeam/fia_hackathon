import { Injectable } from '@nestjs/common';
import { AuthProviderEntity } from '@/authorization/domain/entities/AuthProvider.entity';
import { Mapper } from '@/common/infrastructure/Mapper';
import { AuthorizationProvider } from '@/schemas/AuthorizationProvider.schema';

@Injectable()
export class AuthorizationProviderMapper extends Mapper<
  AuthorizationProvider,
  AuthProviderEntity
> {
  public toEntity(schema: AuthorizationProvider): AuthProviderEntity {
    const providerId: string | undefined = schema.providerId;

    return new AuthProviderEntity({
      id: schema.id,
      type: schema.type,
      providerId: providerId!,
    });
  }
  public toSchema(entity: AuthProviderEntity): AuthorizationProvider {
    const provider = new AuthorizationProvider();

    provider.providerId = entity.getProviderId();
    provider.type = entity.type;
    provider.id = entity.id;

    return provider;
  }
}
