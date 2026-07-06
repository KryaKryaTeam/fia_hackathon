import { UserEntity } from '@/authorization/domain/entities/User.entity';
import { Mapper } from '@/common/infrastructure/Mapper';
import { UserSchema } from '@/schemas/User.schema';
import { AuthorizationProviderMapper } from './AuthorizationProviderMapper';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { MapperTokens } from '@/common/Tokens';
import { InternalFile } from '@/files/domain/objects/InternalFile.object';
import { RelationSlots } from '@/types/RelationSlots';
import { AddressObject } from '@/application/domain/objects/Address.object';

@Injectable({ scope: Scope.DEFAULT })
export class UserMapper extends Mapper<UserSchema, UserEntity> {
  constructor(
    @Inject(MapperTokens.AuthorizationProviderMapper)
    private AuthProviderMapper: AuthorizationProviderMapper,
  ) {
    super();
  }
  public toEntity(schema: UserSchema): UserEntity {
    return new UserEntity({
      id: schema.id,
      _role: schema.role,
      _authorizationProviders: schema.authorizationProviders?.map((schema) =>
        this.AuthProviderMapper.toEntity(schema),
      ),
      _avatarUrl: InternalFile.define<typeof RelationSlots.user.avatar>(
        schema.avatarUrl,
        'user:avatar',
        'user:avatar',
      ),
      email: schema.email,
      _additionalData: {
        fullName: schema.fullName,
        address: schema.address
          ? AddressObject.create(schema.address)
          : undefined,
        phone: schema.phone,
      },
    });
  }
  public toSchema(entity: UserEntity): UserSchema {
    const user = new UserSchema();
    user.id = entity.id;
    user.email = entity.email;
    user.avatarUrl = entity.avatarURL.value;
    user.authorizationProviders = entity.authorizationProviders?.map((ent) =>
      this.AuthProviderMapper.toSchema(ent),
    );
    user.address = entity.address?.value;
    user.phone = entity.phone;
    user.fullName = entity.fullName;
    user.role = entity.role;
    return user;
  }
}
