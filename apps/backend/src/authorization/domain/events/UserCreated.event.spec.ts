import { UserCreated } from '@/authorization/domain/events/UserCreated.event';
import { EventType } from '@/common/domain/EventType';

describe('UserCreated', () => {
  const user = { id: 'u1', name: 'test' } as any;

  describe('construction', () => {
    it('should create event with correct type', () => {
      const event = new UserCreated(user);

      expect(event.EventType).toBe(EventType.USER_CREATED);
      expect(event.payload).toBe(user);
    });
  });

  describe('toJSON', () => {
    it('should serialize correctly', () => {
      const event = new UserCreated(user);

      expect(event.toJSON()).toEqual({
        eventType: EventType.USER_CREATED,
        payload: user,
      });
    });
  });

  describe('load', () => {
    it('should reconstruct event from JSON', () => {
      const original = new UserCreated(user);

      const json = original.toJSON();
      const loaded = original.load(json);

      expect(loaded).toBeInstanceOf(UserCreated);
      expect(loaded.payload).toBe(user);
      expect(loaded.EventType).toBe(EventType.USER_CREATED);
    });
  });
});
