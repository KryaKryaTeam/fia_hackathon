import { ApiError, UserErrors } from '@/error/ApiError';
import { AuthorizationProviderTypes } from '@/types/AuthorizationProvidersTypes';

export interface IAuthProviderConstructorProps {
  id: string;
  type: AuthorizationProviderTypes;
  providerId: string | undefined;
}

export class AuthProviderEntity {
  public readonly id: string;
  public readonly type: AuthorizationProviderTypes;
  private providerId?: string;

  toJSON(): IAuthProviderConstructorProps {
    return {
      id: this.id,
      type: this.type,
      providerId: this.providerId,
    };
  }

  constructor(partial: IAuthProviderConstructorProps) {
    if (!partial.providerId) ApiError.throw(UserErrors.INCORRECT_PROVIDER_DATA);

    Object.assign(this, partial);
  }

  isType(type: AuthorizationProviderTypes) {
    return this.type == type;
  }

  isDataEqual(data: string) {
    return data == this.providerId;
  }

  setProviderId(id: string) {
    if (this.providerId && typeof this.providerId !== 'undefined')
      ApiError.throw(UserErrors.DENIED_BY_AUTH_PROVIDER);

    this.providerId = id;
  }

  getProviderId(): string {
    return this.providerId as string;
  }
}
