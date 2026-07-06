import { Injectable } from '@nestjs/common';
import { IDBContext } from '../application/IDBcontext';
import { EntityManager } from '@mikro-orm/postgresql'; // або @mikro-orm/core

@Injectable()
export class DBContext implements IDBContext {
  constructor(private readonly em: EntityManager) {}

  async startTransaction() {
    await this.em.begin();
  }

  async commitTransaction() {
    await this.em.flush();
    await this.em.commit();
  }

  async rollbackTransaction() {
    await this.em.rollback();
    await this.em.clear();
  }

  get manager(): EntityManager {
    return this.em;
  }

  async isolate(fun: () => Promise<void> | void): Promise<void> {
    await this.em.transactional(async (forkedEm) => {
      await fun();
    });
  }
}
