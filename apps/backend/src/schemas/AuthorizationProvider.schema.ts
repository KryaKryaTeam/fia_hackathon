import { AuthorizationProviderTypes } from '../types/AuthorizationProvidersTypes';
import {
  Entity,
  Property,
  Enum,
  ManyToOne,
} from '@mikro-orm/decorators/legacy';
import type { Ref } from '@mikro-orm/core';
import { UserSchema } from './User.schema';

@Entity({ tableName: 'authorization_provider' })
export class AuthorizationProvider {
  @Property({ primary: true, type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @Enum({
    items: () => AuthorizationProviderTypes,
    name: 'type',
  })
  type!: AuthorizationProviderTypes;

  @Property({ type: 'string', nullable: true })
  providerId?: string;

  @ManyToOne(() => UserSchema, {
    fieldName: 'user_id',
    deleteRule: 'cascade',
    referenceColumnName: 'id',
    ref: true,
  })
  userId!: Ref<UserSchema>;
}
