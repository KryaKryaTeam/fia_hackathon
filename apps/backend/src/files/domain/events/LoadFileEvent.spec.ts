import { LoadFileEvent } from '@/files/domain/events/LoadFileEvent';
import { EventType } from '@/common/domain/EventType';
import { FileEntity } from '@/files/domain/entities/File.entity';

describe('LoadFileEvent', () => {
  const file = {
    url: 'file.png',
  } as FileEntity;

  it('should create event with payload', () => {
    const event = new LoadFileEvent({ ent: file });

    expect(event.payload).toEqual({ ent: file });
    expect(event.EventType).toBe(EventType.LOAD_FILE);
  });

  it('should serialize to JSON correctly', () => {
    const event = new LoadFileEvent({ ent: file });

    const json = event.toJSON();

    expect(json).toEqual({
      eventType: EventType.LOAD_FILE,
      payload: { ent: file },
    });
  });

  it('should load event from JSON', () => {
    const original = new LoadFileEvent({ ent: file });

    const json = original.toJSON();

    const restored = new LoadFileEvent({ ent: file }).load(json as any);

    expect(restored).toBeInstanceOf(LoadFileEvent);
    expect(restored.payload).toEqual({ ent: file });
  });
});
