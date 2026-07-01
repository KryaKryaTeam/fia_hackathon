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
  fullName: IUserFullName;
}

export interface IUserConstructorProps {
  id: string;
  email: Email;
  avatarUrl: AvatarURL;
  fullName?: IUserFullName;
  role: string;
}

export interface IUserShortProfile {
  avatarUrl: string;
  role: RoleEnum;
}

export interface IUserAdditionalData {
  id: string;
  email: string;
  fullName: IUserFullName | null;
}

export default class User {
  public readonly id: string;
  public readonly email: string;
  private _avatarUrl: AvatarURL;
  private _role: RoleEnum;
  private _fullName: IUserFullName | null;

  constructor(partial: IUserConstructorProps) {
    this.id = partial.id;
    this.email = partial.email.value;
    this._avatarUrl = partial.avatarUrl;
    this._role = partial.role as RoleEnum;
    this._fullName = partial.fullName ?? null;
  }

  public static create(id: string, email: Email, avatarUrl: AvatarURL) {
    return new User({
      id,
      email,
      avatarUrl,
      role: RoleEnum.USER,
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

  updateFullName(fullName: {
    firstName: string;
    lastName: string;
    surName: string;
  }) {
    if (this._fullName && fullName) {
      this._fullName.firstName = fullName.firstName;
      this._fullName.lastName = fullName.lastName;
      this._fullName.surName = fullName.surName;
      this._fullName.value =
        fullName.firstName.trim() +
        fullName.lastName.trim() +
        fullName.surName.trim();
    }
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
    };
  }

  public toJSON(): IUserEntityData {
    return {
      id: this.id,
      email: this.email,
      avatarURL: this._avatarUrl.value,
      role: this._role,
      fullName: this._fullName!,
    };
  }
}
