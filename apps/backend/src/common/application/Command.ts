import { Inject, Injectable } from '@nestjs/common';
import type { IDBContext } from './IDBcontext';
import { BaseTokens } from '../Tokens';
import type { IEventDispatcher } from '../domain/IEventDispatcher';

@Injectable()
export abstract class Command<Data, Result> {
  @Inject(BaseTokens.DBContext)
  protected DBContext: IDBContext;

  @Inject(BaseTokens.EventDispatcher)
  protected eventDispatcher: IEventDispatcher;

  async execute(data: Data): Promise<Result> {
    await this.DBContext.startTransaction();

    try {
      const result = await this.implementation(data);
      await this.DBContext.commitTransaction();

      this.eventDispatcher.dispatchEvents();

      return result;
    } catch (err) {
      console.log(err);
      await this.DBContext.rollbackTransaction();
      throw err;
    }
  }
  abstract implementation(data: Data): Promise<Result> | Result;
}
