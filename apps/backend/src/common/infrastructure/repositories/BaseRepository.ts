import { Inject, Injectable } from '@nestjs/common';
import type { IDBContext } from '@/common/application/IDBcontext';
import { BaseTokens } from '@/common/Tokens';
import {
  EntitySchema,
  EntityRepository,
  PlainObject,
} from '@mikro-orm/postgresql';

@Injectable()
export abstract class BaseRepository<Schema extends PlainObject> {
  protected abstract _entitySchema: new () => Schema;

  @Inject(BaseTokens.DBContext)
  protected readonly DBContext: IDBContext;

  protected get repository(): EntityRepository<Schema> {
    return this.DBContext.manager.getRepository(this._entitySchema);
  }
}
