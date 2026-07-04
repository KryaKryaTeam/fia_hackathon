import { Entity, ManyToOne, Property } from '@mikro-orm/decorators/legacy';
import { UserSchema } from './User.schema';
import type { Cascade, Ref } from '@mikro-orm/core';

@Entity({ tableName: 'application' })
export class ApplicationSchema {
  @Property({ type: 'uuid', primary: true })
  id: string;

  @Property({ type: 'string' })
  text: string;

  @Property({ type: 'float8' })
  longitude: number;

  @Property({ type: 'float8' })
  latitude: number;

  @Property({ type: 'string' })
  address: string;

  @Property({ type: 'timestamp', defaultRaw: 'now()', fieldName: 'created_at' })
  createdAt: Date = new Date();

  @ManyToOne(() => UserSchema, {
    deleteRule: 'cascade',
    eager: true,
    referenceColumnName: 'id',
  })
  user: Ref<UserSchema>;
}
