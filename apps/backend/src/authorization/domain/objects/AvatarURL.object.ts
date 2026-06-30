import { ApiError, FileErrors } from '@/error/ApiError';

export class AvatarURL {
  private _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static generate(listOfAvalible: string[]) {
    return new AvatarURL(
      listOfAvalible[Math.floor(Math.random() * listOfAvalible.length)],
    );
  }
  static create(value: string) {
    if (
      !value.startsWith('http://') &&
      !value.startsWith('https://') &&
      !value.startsWith('internal_file:')
    )
      ApiError.throw(FileErrors.INVALID_PREFIX);

    return new AvatarURL(value);
  }

  get value() {
    return this._value;
  }
}
