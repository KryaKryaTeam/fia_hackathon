import { Inject, Logger } from '@nestjs/common';
import { Event } from '@/common/domain/Event';
import { EventType } from '@/common/domain/EventType';
import type { IDBContext } from '../IDBcontext';
import { BaseTokens } from '@/common/Tokens';

type TEventCallback<T> = (payload: T) => void | Promise<void>;

export class EventHandler {
  private readonly logger = new Logger(EventHandler.name);
  @Inject(BaseTokens.DBContext)
  dbContext: IDBContext;

  private readonly eventMapping: Map<EventType, TEventCallback<unknown>[]> =
    new Map();

  async handle(event: Event<unknown>): Promise<void> {
    const callbacks = this.eventMapping.get(event.EventType) || [];
    this.logger.log(
      `Dispatching ${event.EventType} to ${callbacks.length} handlers`,
    );

    const promises = callbacks.map(async (call, index) => {
      this.logger.log(
        `Handling event ${event.EventType}:${index + 1}/${callbacks.length}`,
      );
      await this.dbContext.isolate(async () => {
        await call(event.payload);
      });

      this.logger.log(
        `Finish ${event.EventType}:${index + 1}/${callbacks.length}`,
      );
    });

    await Promise.all(promises).catch((err) =>
      this.logger.error(`Event failed: ${err}`),
    );

    this.logger.log(`All handlers for ${event.EventType} processed`);
  }
  addListener<T = unknown>(eventType: EventType, callback: TEventCallback<T>) {
    this.logger.log(`Event handler added for event: ${eventType}`);
    const arrayOfCallbacks = this.eventMapping.get(eventType) || [];
    arrayOfCallbacks.push(callback as TEventCallback<unknown>);
    this.eventMapping.set(eventType, arrayOfCallbacks);
  }
}
