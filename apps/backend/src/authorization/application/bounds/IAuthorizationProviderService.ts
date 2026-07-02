import { UserEntity } from '@/authorization/domain/entities/User.entity';
import { AuthorizationProviderTypes } from '@/types/AuthorizationProvidersTypes';

export interface IAuthorizationProviderService {
  authorize(
    type: AuthorizationProviderTypes,
    loginData: unknown,
  ): Promise<{ user: UserEntity; existsUser: boolean }>;
}
