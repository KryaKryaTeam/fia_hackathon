export default abstract class ValueObject<T> {
  protected constructor(protected readonly _value: T) {}

  abstract equals(other: ValueObject<T>): boolean;

  toString(): string {
    return String(this._value);
  }
}
