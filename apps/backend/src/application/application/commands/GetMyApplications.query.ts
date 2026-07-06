import { ApplicationEntity } from '@/application/domain/entities/Application.entity';
import { UserEntity } from '@/authorization/domain/entities/User.entity';
import { Query } from '@/common/application/Query';
import { ReposTokens } from '@/common/Tokens';
import { Inject } from '@nestjs/common';
import type { IApplicationRepository } from '../bounds/IApplicationRepository';

export interface GetMyApplicationQueryData {
  user: UserEntity;
}

export class GetMyApplicationQuery extends Query<
  GetMyApplicationQueryData,
  ApplicationEntity[]
> {
  @Inject(ReposTokens.ApplicationRepository)
  private readonly applicationRepository: IApplicationRepository;

  override async implementation(
    data: GetMyApplicationQueryData,
  ): Promise<ApplicationEntity[]> {
    return await this.applicationRepository.findByUserId(data.user.id);
  }
}
