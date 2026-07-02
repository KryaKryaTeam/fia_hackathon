import { BaseRepository } from './BaseRepository';
import { IFileRelationsRepository } from '@/files/application/bounds/IFileRelationsRepository';
import { FileRelationEntity } from '@/files/domain/entities/FileRelation.entity';
import { FileEntity } from '@/files/domain/entities/File.entity';
import { Inject } from '@nestjs/common';
import { MapperTokens } from '@/common/Tokens';
import { FileRelationMapper } from '@/files/application/mappers/FileRelationMapper';
import { UserEntity } from '@/authorization/domain/entities/User.entity';
import { RelationString } from '@/files/domain/objects/RelationSlots';
import { FileMapper } from '@/files/application/mappers/FileMapper';
import { FileRelation } from '@/schemas/FileRelation.schema';

export class FileRelationRepository
  extends BaseRepository<FileRelation>
  implements IFileRelationsRepository
{
  protected _entitySchema: new () => FileRelation = FileRelation;

  @Inject(MapperTokens.FileRelationMapper)
  private readonly fileRelationMapper: FileRelationMapper;

  @Inject(MapperTokens.FileMapper)
  private readonly fileMapper: FileMapper;

  async save(relation: FileRelationEntity): Promise<void> {
    const schema = this.fileRelationMapper.toSchema(relation);

    await this.repository.upsert(schema);
  }

  async deleteRelation(relation: FileRelationEntity): Promise<void> {
    await this.repository.nativeDelete(relation.id);
  }

  async findRelationByFile(
    file: FileEntity,
  ): Promise<FileRelationEntity | null> {
    const relation = await this.repository.findOne(
      {
        file: { url: file.url },
      },
      { populate: ['file', 'user'] },
    );

    return relation ? this.fileRelationMapper.toEntity(relation) : null;
  }

  async findFileByUserAndScope(
    user: UserEntity,
    scope: RelationString,
  ): Promise<FileEntity | null> {
    const relation = await this.repository.findOne(
      {
        user_id: user.id,
        slot: scope.value,
      },
      { populate: ['file'] },
    );

    return relation ? this.fileRelationMapper.toEntity(relation).file : null;
  }

  async findFileByRelation(
    relation: FileRelationEntity,
  ): Promise<FileEntity | null> {
    const result = await this.repository.findOne(
      {
        file: { url: relation.file.url },
      },
      { populate: ['file'] },
    );

    if (!result) return null;

    return this.fileMapper.toEntity(result.file.unwrap());
  }

  async deleteRelationByUserAndScope(
    user: UserEntity,
    scope: RelationString,
  ): Promise<void> {
    await this.repository.nativeDelete({
      user_id: user.id,
      slot: scope.value,
    });
  }
}
