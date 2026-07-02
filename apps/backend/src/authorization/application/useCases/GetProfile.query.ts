import { Inject } from '@nestjs/common';
import { IProfile } from '@/authorization/domain/entities/User.entity';
import { Query } from '@/common/application/Query';
import { ReposTokens } from '@/common/Tokens';
import type { IUserRepository } from '../bounds/IUserRepository';
import { ApiError, UserErrors } from '@/error/ApiError';

export class GetProfileQuery extends Query<{ user_id: string }, IProfile> {
  @Inject(ReposTokens.UserRepository) userRepository: IUserRepository;
  override async implementation(data: { user_id: string }): Promise<IProfile> {
    const user = await this.userRepository.findById(data.user_id);
    if (!user) ApiError.throw(UserErrors.USER_WITH_THIS_ID_UNDEFINED);

    return user.publicProfile;
  }
}
