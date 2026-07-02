import { UserEntity } from '@/authorization/domain/entities/User.entity';
import { FileEntity } from '@/files/domain/entities/File.entity';
import { FileRelationEntity } from '@/files/domain/entities/FileRelation.entity';
import { RelationString } from '@/files/domain/objects/RelationSlots';

export interface IFileRelationsRepository {
  save(relation: FileRelationEntity): Promise<void>;
  deleteRelation(relation: FileRelationEntity): Promise<void>;
  deleteRelationByUserAndScope(
    user: UserEntity,
    slot: RelationString,
  ): Promise<void>;
  findRelationByFile(file: FileEntity): Promise<FileRelationEntity | null>;
  findFileByRelation(relation: FileRelationEntity): Promise<FileEntity | null>;
  findFileByUserAndScope(
    user: UserEntity,
    scope: RelationString,
  ): Promise<FileEntity | null>;
}
