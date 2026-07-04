import { Entity } from '@/common/domain/Entity';
import { randomUUID } from 'crypto';
import { ILocation, LocationObject } from '../objects/Location.object';
import {
  ApplicationRequesterObject,
  IApplicationRequester,
} from '../objects/Requester.object';
import { AddressObject } from '../objects/Address.object';

export interface ApplicationJSON {
  id: string;
  text: string;
  location: ILocation;
  address: string;
  requester: IApplicationRequester;
  createdAt: Date;
}

export interface IApplication {
  id: string;
  text: string;
  location: LocationObject;
  address: AddressObject;
  requester: ApplicationRequesterObject;
  createdAt: Date;
}

export interface ApplicationCreateData {
  text: string;
  location: LocationObject; // service before should transcript address to location
  address: AddressObject; // or transcript location to address
  requester: ApplicationRequesterObject;
}

export class ApplicationEntity extends Entity {
  public readonly id: string;
  public readonly text: string;
  public readonly location: LocationObject;
  public readonly address: AddressObject;
  public readonly requester: ApplicationRequesterObject;
  public readonly createdAt: Date;

  private constructor(data: IApplication) {
    super();
    Object.assign(this, data);
  }

  static validate(data: IApplication) {
    // validation logic
  }

  static create(createData: ApplicationCreateData) {
    const data = {
      ...createData,
      id: randomUUID(),
      createdAt: new Date(),
    };

    this.validate(data);
    return new ApplicationEntity(data);
  }
  static load(loadData: ApplicationJSON) {
    const data: IApplication = {
      ...loadData,
      address: AddressObject.create(loadData.address),
      location: LocationObject.create(loadData.location),
      requester: ApplicationRequesterObject.create(loadData.requester),
    };

    this.validate(data);
    return new ApplicationEntity(data);
  }

  override toJSON(): ApplicationJSON {
    return {
      id: this.id,
      address: this.address.value,
      createdAt: this.createdAt,
      location: this.location.value,
      requester: this.requester.value,
      text: this.text,
    };
  }
}
