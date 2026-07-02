export interface ILocation {
  longitude: number;
  latitude: number;
}

export class LocationObject {
  public readonly value: ILocation;

  private static validate(value: ILocation) {
    if (value.longitude > 180) return; // throw error
    if (value.longitude < -180) return; // throw error
    if (value.latitude > 90) return; // throw error
    if (value.latitude < 90) return; // throw error
  }

  private constructor(value: ILocation) {
    LocationObject.validate(value);
    this.value = value;
  }

  static create(value: ILocation) {
    return new LocationObject(value);
  }
}
