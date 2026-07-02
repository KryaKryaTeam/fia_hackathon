import { AuthProviderEntity } from '@/authorization/domain/entities/AuthProvider.entity';

export interface IAuthProviderRepository {
  save(provider: AuthProviderEntity): Promise<void>;
  findById(providerId: string): Promise<AuthProviderEntity | null>;
  findByProviderId(providerId: string): Promise<AuthProviderEntity | null>;
  findBelongToUser(userId: string): Promise<AuthProviderEntity[] | null>;
}
