import { ChangeRoleEvent } from '@/authorization/domain/events/ChangeRole.event';
import { EventType } from '@/common/domain/EventType';
import { RoleEnum } from '@/types/RoleEnum';

describe('ChangeRoleEvent', () => {
  const requester = { id: 'u1' } as any;
  const target = { id: 'u2' } as any;

  const payload = {
    requester,
    target,
    role: RoleEnum.ADMIN,
  };

  describe('construction', () => {
    it('should create event with correct type', () => {
      const event = new ChangeRoleEvent(payload);

      expect(event.EventType).toBe(EventType.CHANGE_ROLE);
      expect(event.payload).toBe(payload);
    });
  });

  describe('toJSON', () => {
    it('should serialize correctly', () => {
      const event = new ChangeRoleEvent(payload);

      expect(event.toJSON()).toEqual({
        eventType: EventType.CHANGE_ROLE,
        payload,
      });
    });
  });

  describe('load', () => {
    it('should reconstruct event from JSON', () => {
      const original = new ChangeRoleEvent(payload);

      const json = original.toJSON();
      const loaded = original.load(json);

      expect(loaded).toBeInstanceOf(ChangeRoleEvent);
      expect(loaded.payload).toBe(payload);
      expect(loaded.EventType).toBe(EventType.CHANGE_ROLE);
    });
  });
});
