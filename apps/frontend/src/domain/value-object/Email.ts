import ValueObject from './ValueObject';
export default class Email extends ValueObject<string> {
  public constructor(value: string) {
    super(value);
  }

  get value(): string {
    return this._value;
  }

  static create(raw: string): Email {
    if (!raw || raw.trim().length === 0) throw new Error('Email is required');

    const emailRegex = /^\s*[^\s@]+@[^\s@]+\.[^\s@]+\s*$/;
    if (!emailRegex.test(raw)) throw new Error('Invalid email format');

    return new Email(raw.toLowerCase().trim());
  }

  equals(other: ValueObject<string>): boolean {
    return other instanceof Email && this._value === other._value;
  }
}
