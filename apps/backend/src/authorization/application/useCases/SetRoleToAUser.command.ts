import { Inject } from '@nestjs/common';
import { UserEntity } from '@/authorization/domain/entities/User.entity';
import { Command } from '@/common/application/Command';
import { ReposTokens } from '@/common/Tokens';
import type { IUserRepository } from '../bounds/IUserRepository';
import { RoleEnum } from '@/types/RoleEnum';
import { ApiError, UserErrors } from '@/error/ApiError';

interface SetRoleToAUserCommandInput {
  userToChangeId: string;
  actor: UserEntity;
  role: RoleEnum;
}

export class SetRoleToAUserCommand extends Command<
  SetRoleToAUserCommandInput,
  void
> {
  @Inject(ReposTokens.UserRepository)
  private readonly userRepository: IUserRepository;
  async implementation(data: SetRoleToAUserCommandInput): Promise<void> {
    const user = await this.userRepository.findById(data.userToChangeId);

    if (!user) ApiError.throw(UserErrors.USER_WITH_THIS_ID_UNDEFINED);

    user.setRoleTo(data.actor, data.role);
    user.pullEvents(this.eventDispatcher);

    await this.userRepository.save(user);
  }
}
