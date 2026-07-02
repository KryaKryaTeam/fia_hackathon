import { RoleEnum } from '../types/RoleEnum';
import {
  Entity,
  Property,
  Enum,
  OneToMany,
} from '@mikro-orm/decorators/legacy';
import { Cascade } from '@mikro-orm/core';
import { AuthorizationProvider } from './AuthorizationProvider.schema';

@Entity({ tableName: 'user' })
export class UserSchema {
  @Property({ type: 'uuid', primary: true })
  id: string;

  @Property({ type: 'string', unique: true })
  username: string;

  @Property({ type: 'string', unique: true })
  email: string;

  @Property({ type: 'string', name: 'avatar_url', default: 'https://....' })
  avatarUrl: string;

  // Additional data for autofill

  @Property({ type: 'string', name: 'first_name', nullable: true })
  firstName?: string;

  @Property({ type: 'string', name: 'last_name', nullable: true })
  lastName?: string;

  @Property({ type: 'string', name: 'sur_name', nullable: true })
  surName?: string;

  // Role
  @Enum({ items: () => RoleEnum, name: 'Role', default: RoleEnum.USER })
  role: RoleEnum;

  // Metadata
  @Property({
    name: 'created_at',
    type: 'timestamp',
    onCreate(entity, em) {
      entity.createdAt = new Date();
    },
  })
  createdAt: Date;

  @Property({
    name: 'updated_at',
    type: 'timestamp',
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
  })
  updatedAt!: Date;

  // Зв'язки
  @OneToMany(() => AuthorizationProvider, (provider) => provider.userId, {
    eager: true,
    cascade: [Cascade.ALL],
  })
  authorizationProviders!: AuthorizationProvider[];
}
