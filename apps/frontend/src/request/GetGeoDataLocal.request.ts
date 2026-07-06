import { inject, injectable } from 'inversify';
import { LocalRequest } from '@/infrastructure/LocalRequest';
import { TYPES } from '@/infrastructure/Container.types';
import { UserState } from '@/state/User.state';

export interface GeoCoords {
  latitude: number;
  longitude: number;
  accuracy: number;
}

@injectable()
export default class GetGeoDataLocalRequest extends LocalRequest<
  void,
  GeoCoords,
  GeoCoords
> {
  mockOutputData: GeoCoords | undefined = {
    latitude: 50.4501,
    longitude: 30.5234,
    accuracy: 10,
  };

  constructor(@inject(TYPES.UserState) userState: UserState) {
    super(userState);
  }

  mapData(): Promise<GeoCoords> {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Geolocation don`t support browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          resolve({ latitude, longitude, accuracy });
        },
        (error) => reject(new Error(error.message)),
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      );
    });
  }

  onSuccess(data: GeoCoords): GeoCoords {
    return data;
  }
}
