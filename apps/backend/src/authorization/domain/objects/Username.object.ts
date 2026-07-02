import { ApiError, UserErrors } from '@/error/ApiError';

export class Username {
  private readonly _value: string;
  private constructor(value: string) {
    this._value = value;
  }

  public static generate(adjectives: string[], animals: string[]): Username {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const suffix = Math.floor(Math.random() * 1000);

    return new Username(`${adj}-${animal}-${suffix}`);
  }

  public static create(value: string): Username {
    if (value.length < 8 || value.length > 50)
      ApiError.throw(UserErrors.USERNAME_LENGTH_RESTRICTION);

    if (value.startsWith('_'))
      ApiError.throw(UserErrors.USERNAME_NOT_STARTS_WITH_);

    return new Username(value);
  }

  get value(): string {
    return this._value;
  }
}
