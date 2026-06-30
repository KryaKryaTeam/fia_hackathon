import { Event, IEventJSON } from '@/common/domain/Event';
import { FileEntity } from '../entities/File.entity';
import { EventType } from '@/common/domain/EventType';
import { RegisterEvent } from '@/common/domain/EventRegister';

@RegisterEvent
export class LoadFileEvent extends Event<{ ent: FileEntity }> {
  public EventType: EventType = EventType.LOAD_FILE;
  constructor(payload: { ent: FileEntity }) {
    super(payload);
  }
  load(data: IEventJSON<{ ent: FileEntity }>): Event<{ ent: FileEntity }> {
    return new LoadFileEvent({ ...data.payload });
  }
  toJSON(): IEventJSON<{ ent: FileEntity }> {
    return {
      eventType: this.EventType,
      payload: this.payload,
    };
  }
}
