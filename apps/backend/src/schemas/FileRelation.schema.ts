import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
} from '@mikro-orm/decorators/legacy';
import type { Ref } from '@mikro-orm/core';
import { FileSchema } from './File.schema';
import { UserSchema } from './User.schema';
import { ApplicationSchema } from './Application.schema';

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

  @Property({ type: 'string' })
  slot!: string;

  @ManyToOne(() => UserSchema, {
    fieldName: 'user_id',
    deleteRule: 'cascade',
    referenceColumnName: 'id',
    ref: true,
  })
  user!: Ref<UserSchema>;

  @ManyToOne(() => ApplicationSchema, {
    fieldName: 'application_id',
    deleteRule: 'cascade',
    referenceColumnName: 'id',
    ref: true,
  })
  application: Ref<ApplicationSchema>;

  @Property({ type: 'string', persist: false })
  get user_id(): string | undefined {
    return this.user?.id;
  }

  @Property({ type: 'string', persist: false })
  get application_id(): string | undefined {
    return this.application?.id;
  }
}
