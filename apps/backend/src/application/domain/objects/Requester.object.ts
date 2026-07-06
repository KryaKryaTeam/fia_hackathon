import { UserEntity } from '@/authorization/domain/entities/User.entity';

export interface IApplicationRequester {
  id: string;
  email: string;
  fullName?: string;
  address?: string;
  phone?: string;
}

export class ApplicationRequesterObject {
  public readonly value: IApplicationRequester;

  public equals(other: ApplicationRequesterObject): boolean {
    if (other === null || other === undefined) return false;
    return JSON.stringify(this.value) === JSON.stringify(other.value);
  }

  private validate(value: IApplicationRequester) {
    if (!value.id) throw new Error('ID заявника є обовʼязковим');
    if (!value.email) throw new Error('Email заявника є обовʼязковим');
  }

  private constructor(value: IApplicationRequester) {
    this.validate(value);

    this.value = Object.freeze({ ...value });
  }

  static create(value: IApplicationRequester) {
    return new ApplicationRequesterObject(value);
  }
  static createFromUser(user: UserEntity) {
    return new ApplicationRequesterObject({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      address: user.address?.value,
      phone: user.phone,
    });
  }
}
