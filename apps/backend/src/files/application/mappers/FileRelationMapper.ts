import { Mapper } from '@/common/infrastructure/Mapper';
import { FileRelationEntity } from '@/files/domain/entities/FileRelation.entity';
import { FileRelation } from '@/schemas/FileRelation.schema';
import { FileMapper } from './FileMapper';
import { UserMapper } from '@/authorization/application/mappers/UserMapper';
import { RelationString } from '@/files/domain/objects/RelationSlots';
import { Injectable, Inject } from '@nestjs/common';
import { ApiError, FileErrors } from '@/error/ApiError';
import { MapperTokens } from '@/common/Tokens';
import { ref } from '@mikro-orm/core';

@Injectable()
export class FileRelationMapper extends Mapper<
  FileRelation,
  FileRelationEntity
> {
  constructor(
    @Inject(MapperTokens.UserMapper)
    private readonly userMapper: UserMapper,
    @Inject(MapperTokens.FileMapper)
    private readonly fileMapper: FileMapper,
  ) {
    super();
  }

  public toEntity(schema: FileRelation): FileRelationEntity {
    return FileRelationEntity.load({
      id: schema.id,
      file: this.fileMapper.toEntity(schema.file.unwrap()),
      slot: schema.slot ? RelationString.define(schema.slot) : undefined,
      user: schema.user
        ? this.userMapper.toEntity(schema.user.unwrap())
        : undefined,
    });
  }

  public toSchema(entity: FileRelationEntity): FileRelation {
    if (!entity.filed) ApiError.throw(FileErrors.INCOMPLETE_RELATION);

    const sch = new FileRelation();
    sch.id = entity.id;

    if (entity.file) {
      sch.file = ref(this.fileMapper.toSchema(entity.file));
    }

    if (entity.user) {
      sch.user = ref(this.userMapper.toSchema(entity.user));
    }

    sch.slot = entity.slot;

    return sch;
  }
}
