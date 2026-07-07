import {
  ISubRequestData,
  NetworkRequest,
} from '@/infrastructure/BaseNetworkRequest';
import { TYPES } from '@/infrastructure/Container.types';
import { HTTPMethod } from '@/infrastructure/type';
import URLEnum from '@/infrastructure/URLEnum';
import { LocationType } from '@/state/Ticket.state';
import { UserState } from '@/state/User.state';
import { inject } from 'inversify';

export interface CreateApplicationInput {
  locationType: LocationType;
  text: string;
  location?: {
    long: number;
    lat: number;
  };
  address?: string;
}

export interface CreateApplicationResponse {
  application: {
    id: string;
    text: string;
    location: {
      long: number;
      lat: number;
    };
    address: string;
    requester: {
      id: string;
      email: string;
      fullName: string;
      address: string;
      phone: string;
    };
    createdAt: string;
    status: 'waiting' | 'processed';
  };
}

export class CreateApplicationRequest extends NetworkRequest<
  CreateApplicationInput,
  CreateApplicationResponse,
  CreateApplicationResponse
> {
  override authorized = true;
  override withCSRF = false;

  public override cacheKey(data: CreateApplicationInput): unknown[] {
    return [`CreateApplication_${data.locationType}_${Date.now()}`];
  }

  constructor(@inject(TYPES.UserState) userState: UserState) {
    super(userState);
  }

  override mockOutputData: CreateApplicationResponse | undefined;
  override method: HTTPMethod = 'POST';
  override name = 'CreateApplication';
  protected override showProgressInToast = true;

  override mapData(data: CreateApplicationInput): ISubRequestData {
    return {
      init: {
        body: data as unknown as Record<string, unknown>,
      },
      url: URLEnum.CREATE_APPLICATION,
    };
  }

  override onSuccess(
    data: CreateApplicationResponse,
  ): CreateApplicationResponse {
    return data;
  }
}
