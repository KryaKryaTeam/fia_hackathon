import {
  JsonSerializable,
  SerializableObject,
} from '../infrastructure/interceptors/JsonInterceptor';
import { Event } from './Event';
import { IEventDispatcher } from './IEventDispatcher';

export abstract class Entity implements JsonSerializable {
  protected readonly events: Event<unknown>[] = [];

  protected addEvent(event: Event<unknown>) {
    this.events.push(event);
  }

  public pullEvents(eventDispatcher: IEventDispatcher) {
    this.events.forEach((ev) => eventDispatcher.addEvent(ev));
    this.events.length = 0;
  }

  abstract toJSON(): SerializableObject;
}
