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

  async isolate(
    fun: (forkedEm: EntityManager) => Promise<void> | void,
  ): Promise<void> {
    const forkedEm = this.em.fork();

    await forkedEm.transactional(async (txEm) => {
      await fun(txEm);
    });
  }
}
