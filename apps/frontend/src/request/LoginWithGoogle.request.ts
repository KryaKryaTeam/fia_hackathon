import URLEnum from '../infrastructure/URLEnum';
import { HTTPMethod } from '../infrastructure/type';
import { UserState } from '../state/User.state';
import { inject } from 'inversify';
import {
  ISubRequestData,
  NetworkRequest,
} from '../infrastructure/BaseNetworkRequest';
import { TYPES } from '../infrastructure/Container.types';

interface LoginWithGoogleInput {
  code: string;
}
interface LoginWithGoogleOutput {
  accessToken: string;
  userExistsBefore: boolean;
}

export class RequestLoginWithGoogle extends NetworkRequest<
  LoginWithGoogleInput,
  boolean,
  LoginWithGoogleOutput
> {
  override name: string = 'LoginWithGoogle';
  authorized = false;
  withCSRF = true;
  method: HTTPMethod = 'POST';
  mockOutputData: LoginWithGoogleOutput = {
    accessToken: '1234567890',
    userExistsBefore: true,
  };
  constructor(@inject(TYPES.UserState) userState: UserState) {
    super(userState);
  }

  mapData(data: LoginWithGoogleInput): ISubRequestData {
    return {
      init: {
        body: JSON.stringify({
          code: data.code,
        }),
      },
      url: new URL(URLEnum.LOGIN),
    };
  }

  onSuccess(data: LoginWithGoogleOutput): boolean | Promise<boolean> {
    this.setAuth(data.accessToken);

    return data.userExistsBefore;
  }
}
