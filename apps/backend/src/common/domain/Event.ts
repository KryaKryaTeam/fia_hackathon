import { EventType } from './EventType';

export interface IEventJSON<T> {
  eventType: string;
  payload: T;
}

export abstract class Event<T> {
  public readonly payload: T;
  public abstract readonly EventType: EventType;

  constructor(payload: T) {
    this.payload = Object.freeze(payload);
  }

  abstract load(data: IEventJSON<T>): Event<T>;
  abstract toJSON(): IEventJSON<T>;
}
