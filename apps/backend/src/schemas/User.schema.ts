import { RoleEnum } from '../types/RoleEnum';
import {
  Entity,
  Property,
  Enum,
  OneToMany,
} from '@mikro-orm/decorators/legacy';
import { Cascade, Ref } from '@mikro-orm/core';
import { AuthorizationProvider } from './AuthorizationProvider.schema';

@Entity({ tableName: 'user' })
export class UserSchema {
  @Property({ type: 'uuid', primary: true })
  id: string;

  @Property({ type: 'string', unique: true })
  email: string;

  @Property({ type: 'string', name: 'avatar_url', default: 'https://....' })
  avatarUrl: string;

  // Additional data for autofill

  @Property({ type: 'string', name: 'full_name', nullable: true })
  fullName?: string;

  @Property({ type: 'string', nullable: true })
  address?: string;

  @Property({ type: 'string', nullable: true })
  phone?: string;

  // Role
  @Enum({ items: () => RoleEnum, name: 'Role', default: RoleEnum.USER })
  role: RoleEnum;

  // Metadata
  @Property({
    name: 'created_at',
    type: 'timestamp',
    defaultRaw: 'now()',
  })
  createdAt: Date = new Date();

  @Property({
    name: 'updated_at',
    type: 'timestamp',
    defaultRaw: 'now()',
    onUpdate: () => new Date(),
  })
  updatedAt: Date = new Date();

  // Зв'язки
  @OneToMany(() => AuthorizationProvider, (provider) => provider.userId, {
    cascade: [Cascade.ALL],
  })
  authorizationProviders!: Ref<AuthorizationProvider>[];
}
