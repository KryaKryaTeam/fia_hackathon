import { Inject } from '@nestjs/common';
import { IUserAdditionalData } from '@/authorization/domain/entities/User.entity';
import { Command } from '@/common/application/Command';
import { ReposTokens } from '@/common/Tokens';
import type { IUserRepository } from '../bounds/IUserRepository';
import { PropsWithUserId } from '@/types/PropsWithUserId';
import { ApiError, UserErrors } from '@/error/ApiError';

export class UpdateAdditionalDataCommand extends Command<
  PropsWithUserId<{ data: IUserAdditionalData }>,
  void
> {
  @Inject(ReposTokens.UserRepository)
  private userRepository: IUserRepository;

  async implementation(data: {
    data: IUserAdditionalData;
    id: string;
  }): Promise<void> {
    const user = await this.userRepository.findById(data.id);

    if (!user) ApiError.throw(UserErrors.USER_WITH_THIS_ID_UNDEFINED);

    user.additionalData = data.data;
    await this.userRepository.save(user);
  }
}
