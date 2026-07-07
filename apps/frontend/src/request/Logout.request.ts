import {
  ISubRequestData,
  NetworkRequest,
} from '@/infrastructure/BaseNetworkRequest';
import { TYPES } from '@/infrastructure/Container.types';
import { HTTPMethod } from '@/infrastructure/type';
import URLEnum from '@/infrastructure/URLEnum';
import { UserState } from '@/state/User.state';
import { inject } from 'inversify';

export class LogoutRequest extends NetworkRequest<
  undefined,
  undefined,
  undefined
> {
  override name = 'logout';
  override method: HTTPMethod = 'PUT';
  override authorized = true;
  override withCSRF = false;

  constructor(@inject(TYPES.UserState) userState: UserState) {
    super(userState);
  }

  override mockOutputData: undefined;
  override mapData(data: undefined): ISubRequestData {
    return {
      init: {},
      url: URLEnum.LOGOUT,
    };
  }

  override onSuccess(data: undefined): undefined {}
}
