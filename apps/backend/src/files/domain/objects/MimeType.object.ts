import { ApiError, FileErrors } from '@/error/ApiError';

export class MimeType {
  private readonly _value: string | undefined;

  constructor(value: string | undefined) {
    if (value !== undefined && value === '') {
      ApiError.throw(FileErrors.MIME_TYPE_IS_UNDEFINED);
    }

    this._value = value;
  }

  get value() {
    return this._value;
  }

  get fileFormat() {
    if (this._value == undefined)
      ApiError.throw(FileErrors.MIME_TYPE_IS_UNDEFINED);
    return this._value.split('/')[1];
  }
}
