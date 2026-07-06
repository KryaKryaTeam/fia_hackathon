import { IGeoCoderService } from '@/application/application/bounds/IGeoCoderService';
import { AddressObject } from '@/application/domain/objects/Address.object';
import { LocationObject } from '@/application/domain/objects/Location.object';
import { Inject } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

export class GeoCoderService implements IGeoCoderService {
  @Inject(CACHE_MANAGER) private readonly cacheService: Cache;
  @Inject() private readonly configService: ConfigService;

  async decodeAddress(address: AddressObject) {
    const cache: number[] | undefined = await this.cacheService.get(
      `geocoder_${address.value}_address`,
    );
    if (cache)
      return LocationObject.create({ longitude: cache[0], latitude: cache[1] });

    try {
      const res = await axios.get(
        `https://us1.locationiq.com/v1/search?key=${this.configService.getOrThrow('map.apiKey')}&q=${encodeURI(address.value)}&format=json&`,
      );
      if (!res.data || res.data.length === 0)
        throw new Error('Address not found');

      const lon: number = parseFloat(res.data[0].lon);
      const lat: number = parseFloat(res.data[0].lat);

      await this.cacheService.set(`geocoder_${address.value}_address`, [
        lon,
        lat,
      ]);

      return LocationObject.create({ latitude: lat, longitude: lon });
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
  async decodeLocation(location: LocationObject) {
    const cache: string | undefined = await this.cacheService.get(
      `geocoder_${location.value.latitude}_${location.value.longitude}_location`,
    );
    if (cache) return AddressObject.create(cache);

    try {
      const res = await axios.get(
        `https://us1.locationiq.com/v1/reverse?key=${this.configService.getOrThrow('map.apiKey')}&lat=${location.value.latitude}&lon=${location.value.longitude}&format=json&`,
      );

      if (res.status !== 200) throw new Error('');

      const data: string = res.data.display_name;

      await this.cacheService.set(
        `geocoder_${location.value.latitude}_${location.value.longitude}_location`,
        data,
      );

      return AddressObject.create(data);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
}
