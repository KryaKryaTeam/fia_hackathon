import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
} from '@mikro-orm/decorators/legacy';
import type { Ref } from '@mikro-orm/core';
import { FileSchema } from './File.schema';
import { UserSchema } from './User.schema';

@Entity({ tableName: 'file_relation' })
export class FileRelation {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @ManyToOne(() => FileSchema, {
    fieldName: 'file_url',
    deleteRule: 'cascade',
    ref: true,
  })
  file!: Ref<FileSchema>;

  @Property()
  slot!: string;

  @ManyToOne(() => UserSchema, {
    fieldName: 'user_id',
    deleteRule: 'cascade',
    ref: true,
  })
  user!: Ref<UserSchema>;

  @Property({ persist: false })
  get user_id(): string | undefined {
    return this.user?.id;
  }
}
