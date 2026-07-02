import { Inject, Injectable } from '@nestjs/common';
import { Event } from '@/common/domain/Event';
import { IEventDispatcher } from '@/common/domain/IEventDispatcher';
import { BaseTokens } from '@/common/Tokens';
import type { EventHandler } from './EventHandler';

@Injectable()
export class EventDispatcher implements IEventDispatcher {
  @Inject(BaseTokens.EventHandler)
  private eventHandler: EventHandler;

  private eventList: Event<unknown>[] = [];
  addEvent(event: Event<unknown>) {
    this.eventList.push(event);
  }

  dispatchEvents() {
    this.eventList.forEach((el) => {
      setImmediate(() => {
        this.dispatchEvent(el).catch(() => {});
      });
    });
    this.eventList = [];
  }

  getEventsCount() {
    return this.eventList.length;
  }

  private async dispatchEvent(event: Event<unknown>) {
    await this.eventHandler.handle(event);
  }
}

export const createMockEventDispatcher = () => ({
  addEvent: () => {},
  dispatchEvents: () => {},
  getEventsCount: () => {
    return 0;
  },
});
