import { RoleEnum } from '@/types/RoleEnum';
import {
  AuthProviderEntity,
  IAuthProviderConstructorProps,
} from './AuthProvider.entity';
import { AuthorizationProviderTypes } from '@/types/AuthorizationProvidersTypes';
import { randomUUID } from 'crypto';
import { Entity } from '@/common/domain/Entity';
import { UserCreated } from '../events/UserCreated.event';
import { IEventJSON } from '@/common/domain/Event';
import { getEventClass } from '@/common/domain/EventRegister';
import { InternalFile } from '@/files/domain/objects/InternalFile.object';
import { RelationSlots } from '@/types/RelationSlots';

export interface IUserAdditionalData {
  fullName: string;
  phone: string;
  address: string;
}

interface IUserEntityConstructorProps {
  id: string;
  _additionalData?: IUserAdditionalData;
}

export interface IUserForAdminList {
  id: string;
  email: string;
  avatarUrl: InternalFile<'user:avatar'>;
  role: RoleEnum;
}

export interface IUserEntityJSON {
  id: string;
  fullName: string;
  address: string;
  phone: string;
  events: IEventJSON<unknown>[];
}

export class UserEntity extends Entity {
  public readonly id: string;
  private _additionalData: IUserAdditionalData = {
    fullName: '',
    phone: '',
    address: '',
  };

  constructor(partial: IUserEntityConstructorProps) {
    super();
    Object.assign(this, partial);
  }

  public static create(
    email: string,
    avatarUrl: InternalFile<typeof RelationSlots.user.avatar>,
  ) {
    const id = randomUUID();

    const ent = new UserEntity({ id });

    ent.addEvent(new UserCreated(new UserEntity({ id })));

    return ent;
  }

  static load(plain: IUserEntityJSON): UserEntity {
    const ent = new UserEntity({
      id: plain.id,
      _additionalData: {
        fullName: plain.fullName,
        phone: plain.phone,
        address: plain.address,
      },
    });

    if (plain.events && Array.isArray(plain.events)) {
      plain.events.forEach((eventJson) => {
        const EventClass = getEventClass(eventJson.eventType);
        if (EventClass) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const eventInstance = Object.create(EventClass.prototype);
          Object.assign(eventInstance, eventJson.payload);
          ent.addEvent(eventInstance);
        }
      });
    }

    return ent;
  }

  static createFake(): UserEntity {
    const fakeData: IUserEntityJSON = {
      id: randomUUID(),
      fullName: 'John Doe Smith',
      address: 'Somewhere in the universe',
      phone: '+380 96 228 67 52',
      events: [],
    };

    return UserEntity.load(fakeData);
  }

  toJSON(): IUserEntityJSON {
    return {
      id: this.id,
      fullName: this._additionalData.fullName || '',
      address: this._additionalData.address || '',
      phone: this._additionalData.phone || '',
      events: this.events.map((ev) => ({
        eventType: ev.constructor.name,
        payload: ev,
      })),
    };
  }

  // async linkProvider(
  //   provider: AuthProviderEntity,
  //   checkProviderUnique: (providerId: string) => Promise<boolean>,
  // ) {
  //   if (this._authorizationProviders?.find((ent) => ent.isType(provider.type)))
  //     ApiError.throw(UserErrors.PROVIDERS_DUPLICATION);

  //   if (!(await checkProviderUnique(provider.getProviderId())))
  //     ApiError.throw(DomainErrors.DUPLICATION);

  //   this._authorizationProviders.push(provider);
  // }

  public get isProfileFull() {
    if (
      !this._additionalData.fullName ||
      !this._additionalData.address ||
      !this._additionalData.phone
    )
      return false;

    return true;
  }

  public get additionalData() {
    return this._additionalData;
  }

  public set additionalData(data: IUserAdditionalData) {
    this._additionalData.fullName =
      data.fullName ?? this._additionalData.fullName;
    this._additionalData.phone = data.phone ?? this._additionalData.phone;
    this._additionalData.address = data.address ?? this._additionalData.address;
  }

  // get forAdminList(): IUserForAdminList {
  //   return {
  //     id: this.id,
  //     avatarUrl: this.avatarURL,
  //     email: this.email,
  //     role: this.role,
  //   };
  // }

  public get fullName() {
    return this._additionalData.fullName ?? null
  }
}
