import { Result, ValidationError } from "@/infrastructure/Result";
import ValueObject from "./ValueObject";

export default class AvatarURL extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }
  get value(): string {
    return this._value;
  }
  static generate(listOfAvalible: string[]) {
    return new AvatarURL(
      listOfAvalible[Math.floor(Math.random() * listOfAvalible.length)],
    );
  }
  static create(raw: string): AvatarURL {
    if (!raw.startsWith("http://") && !raw.startsWith("https://"))
      throw new ValidationError("Invalid URL format");

    return new AvatarURL(raw);
  }
  equals(other: ValueObject<string>): boolean {
    return other instanceof AvatarURL && this._value === other._value;
  }
}
