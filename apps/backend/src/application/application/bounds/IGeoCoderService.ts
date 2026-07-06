import { AddressObject } from '@/application/domain/objects/Address.object';
import { LocationObject } from '@/application/domain/objects/Location.object';

export interface IGeoCoderService {
  decodeAddress: (address: AddressObject) => Promise<LocationObject>;
  decodeLocation: (location: LocationObject) => Promise<AddressObject>;
}
