import { Event, IEventJSON } from '@/common/domain/Event';
import { UserEntity } from '../entities/User.entity';
import { RoleEnum } from '@/types/RoleEnum';
import { EventType } from '@/common/domain/EventType';

interface payload {
  requester: UserEntity;
  target: UserEntity;
  role: RoleEnum;
}

export class ChangeRoleEvent extends Event<payload> {
  public EventType: EventType = EventType.CHANGE_ROLE;
  constructor(payload: payload) {
    super(payload);
  }

  load(data: IEventJSON<payload>): Event<payload> {
    const ev = new ChangeRoleEvent(data.payload);
    return ev;
  }
  toJSON(): IEventJSON<payload> {
    return {
      eventType: EventType.CHANGE_ROLE,
      payload: this.payload,
    };
  }
}
