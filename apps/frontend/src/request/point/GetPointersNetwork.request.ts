import {
  ISubRequestData,
  NetworkRequest,
} from '../../infrastructure/BaseNetworkRequest';
import { HTTPMethod } from '../../infrastructure/type';
import URLEnum from '../../infrastructure/URLEnum';
export interface Pointer {
  id: string;
  location_hint: string;
  count: number;
  normalized: number;
}
const mockPointers: Pointer[] = [
  {
    id: '871e6e7acffffff',
    location_hint: 'Київ, центр (Хрещатик / Майдан)',
    count: 4800,
    normalized: 1.0,
  },
  {
    id: '891e6384a2fffff',
    location_hint: 'Київ, Поділ',
    count: 3200,
    normalized: 0.67,
  },
  {
    id: '891e6384a03ffff',
    location_hint: 'Львів, Старе Місто (Площа Ринок)',
    count: 4100,
    normalized: 0.85,
  },
  {
    id: '871e5dc8dffffff',
    location_hint: 'Одеса, Приморський бульвар / Опера',
    count: 2900,
    normalized: 0.6,
  },
  {
    id: '871196404ffffff',
    location_hint: 'Харків, Площа Свободи',
    count: 2100,
    normalized: 0.44,
  },
  {
    id: '881e6bd86bfffff',
    location_hint: 'Дніпро, Набережна / центр',
    count: 1800,
    normalized: 0.38,
  },
  {
    id: '881f1224d3fffff',
    location_hint: 'Київ, Гідропарк',
    count: 450,
    normalized: 0.09,
  },
];
export default class GetPointersNetworkRequest extends NetworkRequest<
  void,
  Pointer[],
  Pointer[]
> {
  withCSRF = false;
  authorized = false;
  method: HTTPMethod = 'GET';
  mockOutputData: Pointer[] = [...mockPointers];
  mapData(data: void): ISubRequestData {
    return {
      url: new URL(URLEnum.POINTERS),
      init: {},
    };
  }
  onSuccess(data: Pointer[]): Pointer[] {
    return data;
  }
}
