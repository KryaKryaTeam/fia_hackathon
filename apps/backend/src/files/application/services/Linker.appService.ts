import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '@/authorization/domain/entities/User.entity';
import { ReposTokens } from '@/common/Tokens';
import { FileEntity } from '@/files/domain/entities/File.entity';
import { FileRelationEntity } from '@/files/domain/entities/FileRelation.entity';
import { RelationSlots } from '@/types/RelationSlots';
import type { IFileRelationsRepository } from '../bounds/IFileRelationsRepository';
import { RelationString } from '@/files/domain/objects/RelationSlots';
import { ApplicationEntity } from '@/application/domain/entities/Application.entity';

@Injectable()
export class LinkerApplicationService {
  @Inject(ReposTokens.FileRelationRepository)
  private readonly relationRepository: IFileRelationsRepository;

  private async unlinkAvatarFromUser(user: UserEntity) {
    await this.relationRepository.deleteRelationByUserAndScope(
      user,
      RelationString.define(RelationSlots.user.avatar),
    );
  }

  async linkAvatarToUser(file: FileEntity, user: UserEntity) {
    await this.unlinkAvatarFromUser(user);

    const relation = FileRelationEntity.create(file);

    relation.user = user;
    relation.slot = RelationSlots.user.avatar;

    await this.relationRepository.save(relation);
  }

  async linkPdfToApplication(file: FileEntity, application: ApplicationEntity) {
    const relation = FileRelationEntity.create(file);

    relation.application = application;
    relation.slot = RelationSlots.application.pdf;

    await this.relationRepository.save(relation);
  }
}
