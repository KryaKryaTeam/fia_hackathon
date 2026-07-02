import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { BaseTokens } from '../Tokens';
import { EventHandler } from '../application/events/EventHandler';
import { EventType } from '../domain/EventType';
import type { IEventDispatcher } from '../domain/IEventDispatcher';

@Injectable()
export abstract class BaseHandler implements OnModuleInit {
  protected abstract readonly eventType: EventType;

  @Inject(BaseTokens.EventHandler)
  private readonly eventHandler: EventHandler;

  @Inject(BaseTokens.EventDispatcher)
  protected readonly eventDispatcher: IEventDispatcher;

  onModuleInit() {
    this.eventHandler.addListener(this.eventType, (...args) =>
      this.listener(...args),
    );
  }

  abstract implementation(...data: unknown[]): Promise<void> | void;
  private async listener(...data: unknown[]) {
    await this.implementation(data);
    this.eventDispatcher.dispatchEvents();
  }
}
