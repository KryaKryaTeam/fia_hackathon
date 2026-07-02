import {
  Entity,
  Property,
  OneToMany,
  PrimaryKey,
} from '@mikro-orm/decorators/legacy';
import { Collection } from '@mikro-orm/core';
import { FileRelation } from './FileRelation.schema';

@Entity({ tableName: 'file' })
export class FileSchema {
  @PrimaryKey({ type: 'string' })
  url!: string;

  @Property({ type: 'string' })
  mimeType!: string;

  @Property({ type: 'int' })
  size!: number;

  @Property({ type: 'string' })
  slot!: string;

  @OneToMany(() => FileRelation, (rel) => rel.file)
  relations = new Collection<FileRelation>(this);
}
