import { action, makeObservable, observable } from 'mobx';

export enum LocationType {
  address = 'address',
  location = 'location',
}

export class TicketState {
  @observable locationType: LocationType = LocationType.location;
  @observable location: { long: number; lat: number } | undefined;
  @observable address: string | undefined;

  @action chooseLocation(location: { long: number; lat: number }) {
    this.location = location;
    this.locationType = LocationType.location;
  }

  @action chooseAddress(address: string) {
    this.address = address;
    this.locationType = LocationType.address;
  }
  constructor() {
    makeObservable(this);
  }
}
