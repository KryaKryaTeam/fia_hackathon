export type EventConstructor = new (...args: any[]) => any;
const EVENT_REGISTRY = new Map<string, EventConstructor>();

export function RegisterEvent(target: EventConstructor) {
  EVENT_REGISTRY.set(target.name, target);
}

export function getEventClass(name: string): EventConstructor {
  return EVENT_REGISTRY.get(name) as EventConstructor;
}
