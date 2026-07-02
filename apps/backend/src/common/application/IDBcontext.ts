import { EntityManager } from '@mikro-orm/postgresql';

export interface IDBContext {
  manager: EntityManager;
  startTransaction(): Promise<void>;
  rollbackTransaction(): Promise<void>;
  commitTransaction(): Promise<void>;
  isolate(fun: () => Promise<void> | void): Promise<void>;
}
