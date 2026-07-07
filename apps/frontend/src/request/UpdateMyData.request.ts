import {
  ISubRequestData,
  NetworkRequest,
} from '@/infrastructure/BaseNetworkRequest';
import { TYPES } from '@/infrastructure/Container.types';
import { HTTPMethod } from '@/infrastructure/type';
import URLEnum from '@/infrastructure/URLEnum';
import { UserState } from '@/state/User.state';
import { inject } from 'inversify';

export class UpdateMyDataRequest extends NetworkRequest<
  {
    address: string;
    fullName: string;
    phone: string;
  },
  void,
  void
> {
  override authorized = true;
  override withCSRF = false;
  public override cacheKey(data: {
    address: string;
    fullName: string;
    phone: string;
  }): unknown[] {
    return [`UpdateMyData${data.address}_${data.fullName}_${data.phone}`];
  }

  constructor(@inject(TYPES.UserState) userState: UserState) {
    super(userState);
  }
  override mockOutputData: void | undefined;
  override method: HTTPMethod = 'PATCH';
  override name = 'UpdateMyData';
  protected override showProgressInToast = true;
  override mapData(data: {
    address: string;
    fullName: string;
    phone: string;
  }): ISubRequestData {
    return {
      init: {
        body: data,
      },
      url: URLEnum.UPDATE_DATA,
    };
  }

  override onSuccess(data: void): void | Promise<void> {}
}
