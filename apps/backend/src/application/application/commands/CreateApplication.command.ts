import { ApplicationEntity } from '@/application/domain/entities/Application.entity';
import { UserEntity } from '@/authorization/domain/entities/User.entity';
import { Command } from '@/common/application/Command';
import { ReposTokens, ServiceTokens } from '@/common/Tokens';
import { Inject } from '@nestjs/common';
import type { IGeoCoderService } from '../bounds/IGeoCoderService';
import { LocationObject } from '@/application/domain/objects/Location.object';
import { AddressObject } from '@/application/domain/objects/Address.object';
import { ApplicationRequesterObject } from '@/application/domain/objects/Requester.object';
import type { IApplicationRepository } from '../bounds/IApplicationRepository';
import type { IMlService } from '../bounds/IMlService';

export enum LocationType {
  address = 'address',
  location = 'location',
}

export interface CreateApplicationCommandData {
  user: UserEntity;
  locationType: LocationType;
  text: string;
  location?: LocationObject;
  address?: AddressObject;
}

export interface CreateApplicationCommandResult {
  application: ApplicationEntity;
}

export class CreateApplicationCommand extends Command<
  CreateApplicationCommandData,
  CreateApplicationCommandResult
> {
  @Inject(ServiceTokens.GeoCoderService)
  private readonly geoCoderSerive: IGeoCoderService;

  @Inject(ReposTokens.ApplicationRepository)
  private readonly applicationRepository: IApplicationRepository;

  @Inject(ServiceTokens.MlService) private readonly mlService: IMlService;

  override async implementation(
    data: CreateApplicationCommandData,
  ): Promise<CreateApplicationCommandResult> {
    switch (data.locationType) {
      case LocationType.address: {
        if (!data.address) throw new Error();
        data.location = await this.geoCoderSerive.decodeAddress(data.address);
        break;
      }
      case LocationType.location: {
        if (!data.location) throw new Error();
        data.address = await this.geoCoderSerive.decodeLocation(data.location);
        break;
      }
    }

    const requester = ApplicationRequesterObject.createFromUser(data.user);

    const application = ApplicationEntity.create({
      text: data.text,
      address: data.address,
      location: data.location,
      requester,
    });

    await this.applicationRepository.save(application);

    await this.mlService.sendToService(application);

    return { application };
  }
}
