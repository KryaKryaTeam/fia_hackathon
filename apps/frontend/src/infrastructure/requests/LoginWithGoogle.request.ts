import URLEnum from '../URLEnum';
import { HTTPMethod } from '../type';
import { UserState } from '../../state/User.state';
import { inject } from 'inversify';
import { ISubRequestData, NetworkRequest } from '../BaseNetworkRequest';
import { TYPES } from '../Container.types';

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
