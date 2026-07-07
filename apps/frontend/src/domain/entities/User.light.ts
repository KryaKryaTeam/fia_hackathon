import AvatarURL from '../value-object/AvatarURL';
import Email from '../value-object/Email';
import { RoleEnum } from './RoleEnum';

export interface IUserFullName {
  value: string;
  firstName: string;
  lastName: string;
  surName: string;
}

export interface IUserEntityData {
  id: string;
  avatarURL: string;
  role: RoleEnum;
  email: string;
  fullName: string | undefined;
  address: string | undefined;
  phone: string | undefined;
}

export interface IUserConstructorProps {
  id: string;
  email: Email;
  avatarUrl: AvatarURL;
  fullName?: string | undefined;
  address?: string | undefined;
  phone?: string | undefined;
  role: string;
}

export interface IUserShortProfile {
  avatarUrl: string;
  role: RoleEnum;
}

export interface IUserAdditionalData {
  id: string;
  email: string;
  fullName: string | null;
  address: string | null;
  phone: string | null;
}

export default class User {
  public readonly id: string;
  public readonly email: string;
  private _avatarUrl: AvatarURL;
  private _role: RoleEnum;
  private _fullName: string | null;
  private _phone: string | null;
  private _address: string | null;

  constructor(partial: IUserConstructorProps) {
    this.id = partial.id;
    this.email = partial.email.value;
    this._avatarUrl = partial.avatarUrl;
    this._role = partial.role as RoleEnum;
    this._fullName = partial.fullName ?? null;
    this._phone = partial.phone ?? null;
    this._address = partial.address ?? null;
  }

  public static create(
    id: string,
    email: Email,
    avatarUrl: AvatarURL,
    {
      address,
      fullName,
      phone,
    }: { fullName?: string; phone?: string; address?: string },
  ) {
    return new User({
      id,
      email,
      avatarUrl,
      role: RoleEnum.USER,
      fullName,
      address,
      phone,
    });
  }

  setRoleTo(requester: User, role: RoleEnum) {
    if (!requester.hasRole(RoleEnum.ADMIN))
      throw new Error('Only admins can change roles');
    if (this.hasRole(role)) throw new Error('User already has this role');
    this._role = role;
  }

  hasRole(role: RoleEnum) {
    return role === this._role;
  }

  changeAvatarURL(avatar_url: AvatarURL) {
    this._avatarUrl = avatar_url;
  }

  clearAdditionData() {
    this._fullName = null;
  }

  public get avatarURL() {
    return this._avatarUrl;
  }

  public get role() {
    return this._role;
  }

  public get fullName() {
    return this._fullName;
  }

  public get isProfileFull() {
    if (!this._fullName) return false;
    if (!this._address) return false;
    if (!this._phone) return false;
    return true;
  }

  public get shortProfile(): IUserShortProfile {
    return {
      avatarUrl: this._avatarUrl.value,
      role: this._role,
    };
  }

  public get additionalData(): IUserAdditionalData {
    return {
      id: this.id,
      email: this.email,
      fullName: this.fullName,
      address: this._address,
      phone: this._phone,
    };
  }

  public toJSON(): IUserEntityData {
    return {
      id: this.id,
      email: this.email,
      avatarURL: this._avatarUrl.value,
      role: this._role,
      fullName: this._fullName!,
      address: this._address!,
      phone: this._phone!,
    };
  }
}
