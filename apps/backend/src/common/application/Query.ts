import { Inject, Injectable } from '@nestjs/common';
import { BaseTokens } from '../Tokens';
import type { IDBContext } from './IDBcontext';
import type { IEventDispatcher } from '../domain/IEventDispatcher';

@Injectable()
export abstract class Query<Data, Result> {
  @Inject(BaseTokens.DBContext)
  protected DBContext: IDBContext;

  @Inject(BaseTokens.EventDispatcher)
  protected eventDispatcher: IEventDispatcher;

  async execute(data: Data): Promise<Result> {
    const result = await this.implementation(data);

    this.eventDispatcher.dispatchEvents();

    return result;
  }

  abstract implementation(data: Data): Promise<Result> | Result;
}
