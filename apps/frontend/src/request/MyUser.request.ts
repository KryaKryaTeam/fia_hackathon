import User from '@/domain/entities/User.light';
import AvatarURL from '@/domain/value-object/AvatarURL';
import Email from '@/domain/value-object/Email';
import {
  ISubRequestData,
  NetworkRequest,
} from '@/infrastructure/BaseNetworkRequest';
import { TYPES } from '@/infrastructure/Container.types';
import { HTTPMethod } from '@/infrastructure/type';
import URLEnum from '@/infrastructure/URLEnum';
import { UserState } from '@/state/User.state';
import { inject } from 'inversify';

export class MyUserRequest extends NetworkRequest<
  undefined,
  {
    id: string;
    email: string;
    avatarURL: string;
    role: string;
    fullName?: string;
    phone?: string;
    address?: string;
  },
  {
    id: string;
    email: string;
    avatarURL: string;
    role: string;
    fullName?: string;
    phone?: string;
    address?: string;
  }
> {
  override name = 'my_user';
  override method: HTTPMethod = 'GET';
  override authorized = true;
  override withCSRF = false;

  constructor(@inject(TYPES.UserState) userState: UserState) {
    super(userState);
  }

  override mockOutputData:
    | { id: string; email: string; avatarURL: string; role: string }
    | undefined;

  override mapData(data: undefined): ISubRequestData {
    return {
      init: {},
      url: URLEnum.ME,
    };
  }

  override onSuccess(data: {
    id: string;
    email: string;
    avatarURL: string;
    role: string;
    fullName: string;
    phone: string;
    address: string;
  }): {
    id: string;
    email: string;
    avatarURL: string;
    role: string;
    fullName?: string;
    phone?: string;
    address?: string;
  } {
    console.log(data);
    this.userState.setUser(
      User.create(
        data.id,
        Email.create(data.email),
        AvatarURL.create(data.avatarURL),
        { address: data.address, fullName: data.fullName, phone: data.phone },
      ),
    );
    return data;
  }
}
