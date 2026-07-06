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
import { ApiError, DomainErrors, UserErrors } from '@/error/ApiError';

export interface IUserAdditionalData {
  firstName?: string;
  lastName?: string;
  surName?: string;
}

interface IUserEntityConstructorProps {
  id: string;
  email: string;
  _avatarUrl: InternalFile<'user:avatar'>;
  _additionalData?: IUserAdditionalData;
  _role: string;
  _authorizationProviders: AuthProviderEntity[];
}

export interface IUserForAdminList {
  id: string;
  email: string;
  avatarUrl: InternalFile<'user:avatar'>;
  role: RoleEnum;
}

export interface IProfile {
  id: string;
  email: string;
  fullName?: {
    value: string;
    firstName?: string;
    lastName?: string;
    surName?: string;
  };
  avatarURL: InternalFile<'user:avatar'>;
  role: RoleEnum;
}

export interface IUserEntityJSON {
  id: string;
  email: string;
  avatarURL: string;
  role: RoleEnum;
  firstName: string;
  lastName: string;
  surName: string;
  authorizationProvider: IAuthProviderConstructorProps[];
  events: IEventJSON<unknown>[];
}

export class UserEntity extends Entity {
  public readonly id: string;
  public readonly email: string;
  private _avatarUrl: InternalFile<typeof RelationSlots.user.avatar>;
  private _additionalData: IUserAdditionalData = {};
  private _role: RoleEnum;
  private _authorizationProviders: AuthProviderEntity[] = [];

  constructor(partial: IUserEntityConstructorProps) {
    super();
    Object.assign(this, partial);
  }

  public static create(
    email: string,
    avatarUrl: InternalFile<typeof RelationSlots.user.avatar>,
  ) {
    const id = randomUUID();

    const ent = new UserEntity({
      email,
      id: id,
      _role: RoleEnum.USER,
      _authorizationProviders: [],
      _avatarUrl: avatarUrl,
    });

    ent.addEvent(
      new UserCreated(
        new UserEntity({
          email,
          id: id,
          _role: RoleEnum.USER,
          _authorizationProviders: [],
          _avatarUrl: avatarUrl,
        }),
      ),
    );

    return ent;
  }

  static load(plain: IUserEntityJSON): UserEntity {
    const ent = new UserEntity({
      id: plain.id,
      email: plain.email,
      _avatarUrl: InternalFile.define<typeof RelationSlots.user.avatar>(
        plain.avatarURL,
        'user:avatar',
        'user:avatar',
      ),
      _role: plain.role,
      _authorizationProviders: plain.authorizationProvider.map(
        (el) => new AuthProviderEntity(el),
      ),
      _additionalData: {
        firstName: plain.firstName,
        lastName: plain.lastName,
        surName: plain.surName,
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
      email: 'fakeuser@example.com',
      avatarURL: 'fake-avatar-url',
      firstName: 'John',
      lastName: 'Doe',
      surName: 'Smith',
      role: RoleEnum.USER,
      authorizationProvider: [],
      events: [],
    };

    return UserEntity.load(fakeData);
  }

  toJSON(): IUserEntityJSON {
    return {
      id: this.id,
      email: this.email,
      avatarURL: this._avatarUrl.value,
      role: this._role,
      firstName: this._additionalData.firstName || '',
      lastName: this._additionalData.lastName || '',
      surName: this._additionalData.surName || '',
      authorizationProvider: this._authorizationProviders.map((p) =>
        p.toJSON(),
      ),
      events: this.events.map((ev) => ({
        eventType: ev.constructor.name,
        payload: ev,
      })),
    };
  }

  async linkProvider(
    provider: AuthProviderEntity,
    checkProviderUnique: (providerId: string) => Promise<boolean>,
  ) {
    if (this._authorizationProviders?.find((ent) => ent.isType(provider.type)))
      ApiError.throw(UserErrors.PROVIDERS_DUPLICATION);

    if (!(await checkProviderUnique(provider.getProviderId())))
      ApiError.throw(DomainErrors.DUPLICATION);

    this._authorizationProviders.push(provider);
  }

  hasRole(role: RoleEnum) {
    return role == this._role;
  }

  setRoleTo(requester: UserEntity, role: RoleEnum) {
    if (!requester.hasRole(RoleEnum.ADMIN))
      ApiError.throw(UserErrors.USER_ROLE_CANT_BE_CHANGED);

    if (this.hasRole(role)) ApiError.throw(DomainErrors.NO_CHANGE);

    this._role = role;
  }

  changeAvatarURL(avatar_url: InternalFile<typeof RelationSlots.user.avatar>) {
    this._avatarUrl = avatar_url;
  }

  public get avatarURL() {
    return this._avatarUrl;
  }

  public get role() {
    return this._role;
  }

  public get isProfileFull() {
    if (!this._additionalData.firstName || !this._additionalData.lastName)
      return false;

    return true;
  }

  public get additionalData() {
    return this._additionalData;
  }

  public set additionalData(data: IUserAdditionalData) {
    this._additionalData.firstName =
      data.firstName ?? this._additionalData.firstName;
    this._additionalData.lastName =
      data.lastName ?? this._additionalData.lastName;
    this._additionalData.surName = data.surName ?? this._additionalData.surName;
  }

  public get authorizationProviders() {
    return this._authorizationProviders;
  }

  public get publicProfile(): IProfile {
    return {
      id: this.id,
      email: this.email,
      avatarURL: InternalFile.define<typeof RelationSlots.user.avatar>(
        this.avatarURL.value,
        'user:avatar',
        'user:avatar',
      ),
      role: this.role,
    };
  }

  get forAdminList(): IUserForAdminList {
    return {
      id: this.id,
      avatarUrl: this.avatarURL,
      email: this.email,
      role: this.role,
    };
  }

  public get fullName() {
    const { firstName, lastName, surName } = this._additionalData;

    return [firstName, lastName, surName].filter(Boolean).join(' ');
  }

  public isAuthorizationDataCorrect(data: string) {
    return (
      this.authorizationProviders.findIndex((provider) =>
        provider.isDataEqual(data),
      ) !== -1
    );
  }

  public hasAuthorizationProvider(type: AuthorizationProviderTypes) {
    return (
      this.authorizationProviders.findIndex((provider) =>
        provider.isType(type),
      ) !== -1
    );
  }

  __forceSetRole(role: RoleEnum) {
    this._role = role;
  }
}
