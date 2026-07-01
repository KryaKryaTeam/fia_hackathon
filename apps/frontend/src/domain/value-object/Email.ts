import ValueObject from "./ValueObject";
import { Result, ValidationError } from "@/infrastructure/Result";
export default class Email extends ValueObject<string> {
  public constructor(value: string) {
    super(value);
  }

  get value(): string {
    return this._value;
  }

  static create(raw: string): Email {
    if (!raw || raw.trim().length === 0)
      throw new ValidationError("Email is required");

    const emailRegex = /^\s*[^\s@]+@[^\s@]+\.[^\s@]+\s*$/;
    if (!emailRegex.test(raw))
      throw new ValidationError("Invalid email format");

    return new Email(raw.toLowerCase().trim());
  }

  equals(other: ValueObject<string>): boolean {
    return other instanceof Email && this._value === other._value;
  }
}
