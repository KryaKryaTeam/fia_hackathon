import { Event } from './Event';

export interface IEventDispatcher {
  dispatchEvents: () => void;
  addEvent: (event: Event<unknown>) => void;
}
