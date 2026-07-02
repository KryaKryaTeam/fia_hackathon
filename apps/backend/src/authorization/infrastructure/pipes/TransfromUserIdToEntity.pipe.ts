import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  Inject,
} from '@nestjs/common';
import { UserEntity } from '@/authorization/domain/entities/User.entity';
import type { IUserRepository } from '@/authorization/application/bounds/IUserRepository';
import { ReposTokens } from '@/common/Tokens';
import { ApiError, UserErrors } from '@/error/ApiError';

@Injectable()
export class TransfromUserIdtoEntity implements PipeTransform {
  constructor(
    @Inject(ReposTokens.UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.metatype !== UserEntity) {
      return value as unknown;
    }

    const userId =
      typeof value === 'string'
        ? value
        : (value as unknown as { id?: string })?.id;

    if (!userId) return null;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      ApiError.throw(UserErrors.USER_WITH_THIS_ID_UNDEFINED);
    }

    return user;
  }
}
