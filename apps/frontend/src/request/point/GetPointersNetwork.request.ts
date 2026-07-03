import {
  ISubRequestData,
  NetworkRequest,
} from '../../infrastructure/BaseNetworkRequest';
import { HTTPMethod } from '../../infrastructure/type';
import URLEnum from '../../infrastructure/URLEnum';
interface Pointer {
  id: string;
  location_hint: string;
  count: number;
  normalized: number;
}
const mockPointers: Pointer[] = [
  {
    id: '872ec18d6ffffff',
    location_hint: 'Київ, центр (Хрещатик / Майдан)',
    count: 4800,
    normalized: 1.0,
  },
  {
    id: '872ec112effffff',
    location_hint: 'Київ, Поділ',
    count: 3200,
    normalized: 0.67,
  },
  {
    id: '872a9dd2cffffff',
    location_hint: 'Львів, Старе Місто (Площа Ринок)',
    count: 4100,
    normalized: 0.85,
  },
  {
    id: '872a906aaffffff',
    location_hint: 'Одеса, Приморський бульвар / Опера',
    count: 2900,
    normalized: 0.6,
  },
  {
    id: '872ebd020ffffff',
    location_hint: 'Харків, Площа Свободи',
    count: 2100,
    normalized: 0.44,
  },
  {
    id: '872eb4b25ffffff',
    location_hint: 'Дніпро, Набережна / центр',
    count: 1800,
    normalized: 0.38,
  },
  {
    id: '872ec1852ffffff',
    location_hint: 'Київ, Гідропарк',
    count: 450,
    normalized: 0.09,
  },
];
export default class GetPointersNetworkRequest extends NetworkRequest<
  null,
  Pointer[],
  Pointer[]
> {
  withCSRF = false;
  authorized = false;
  method: HTTPMethod = 'GET';
  mockOutputData: Pointer[] = [...mockPointers];
  showProgressInToast = false;
  mapData(data: null): ISubRequestData {
    return {
      url: new URL(URLEnum.POINTERS),
      init: {},
    };
  }
  onSuccess(data: Pointer[]): Pointer[] {
    return data;
  }
}
