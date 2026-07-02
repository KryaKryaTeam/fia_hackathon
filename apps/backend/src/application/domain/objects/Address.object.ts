export class AddressObject {
  public readonly value: string;

  private static validate(value: string) {
    if (value.length < 10) return; // should return error
    if (value.startsWith('Україна')) return; //should return error
  }

  private constructor(value: string) {
    AddressObject.validate(value.trim());
    this.value = value.trim();
  }

  static create(value: string) {
    return new AddressObject(value);
  }
}
