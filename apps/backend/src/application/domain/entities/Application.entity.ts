import { Entity } from '@/common/domain/Entity';
import { randomUUID } from 'crypto';
import { ILocation, LocationObject } from '../objects/Location.object';
import {
  ApplicationRequesterObject,
  IApplicationRequester,
} from '../objects/Requester.object';
import { AddressObject } from '../objects/Address.object';
import { InternalFile } from '@/files/domain/objects/InternalFile.object';

export interface ApplicationJSON {
  id: string;
  text: string;
  location: ILocation;
  address: string;
  requester: IApplicationRequester;
  createdAt: Date;
  status: ApplicationStatus;
}

export interface IApplication {
  id: string;
  text: string;
  location: LocationObject;
  address: AddressObject;
  requester: ApplicationRequesterObject;
  createdAt: Date;
  status: ApplicationStatus;
}

export interface ApplicationCreateData {
  text: string;
  location: LocationObject; // service before should transcript address to location
  address: AddressObject; // or transcript location to address
  requester: ApplicationRequesterObject;
}

export enum ApplicationStatus {
  waiting = 'waiting',
  processed = 'proccesed',
}

export class ApplicationEntity extends Entity {
  public readonly id: string;
  public readonly text: string;
  public readonly location: LocationObject;
  public readonly address: AddressObject;
  public readonly requester: ApplicationRequesterObject;
  public readonly createdAt: Date;
  private status_: ApplicationStatus = ApplicationStatus.waiting;

  private pdfFile: InternalFile<'application:pdf'> | undefined;
  private categories: string[];

  get status() {
    return this.status_;
  }

  completeTask() {
    this.status_ = ApplicationStatus.processed;
  }

  private constructor(data: IApplication) {
    super();
    this.id = data.id;
    this.text = data.text;
    this.location = data.location;
    this.address = data.address;
    this.requester = data.requester;
    this.createdAt = data.createdAt;
    this.status_ = data.status;
  }

  static validate(data: IApplication) {
    // validation logic
  }

  static create(createData: ApplicationCreateData) {
    const data = {
      ...createData,
      id: randomUUID(),
      createdAt: new Date(),
      status: ApplicationStatus.waiting,
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
      status: this.status,
    };
  }
}
