import { Entity } from '@/common/domain/Entity';
import { FileEntity } from './File.entity';
import { UserEntity } from '@/authorization/domain/entities/User.entity';
import { randomUUID } from 'crypto';
import { ApiError, FileErrors } from '@/error/ApiError';
import { RelationString } from '../objects/RelationSlots';
import { ApplicationEntity } from '@/application/domain/entities/Application.entity';

interface IFileRelationEntity {
  id: string;
  file: FileEntity;
  slot?: RelationString;
  user?: UserEntity;
  application?: ApplicationEntity;
}

export class FileRelationEntity extends Entity {
  public readonly id: string;
  private _file: FileEntity;
  private _slot?: RelationString;
  private _user?: UserEntity;
  private _application?: ApplicationEntity;

  private constructor(partial: IFileRelationEntity) {
    super();
    this.id = partial.id;
    this._slot = partial.slot;
    this._file = partial.file;
    this._user = partial.user;
    this._application = partial.application;
  }

  static load(partial: IFileRelationEntity) {
    return new FileRelationEntity(partial);
  }

  static create(file: FileEntity) {
    return new FileRelationEntity({ id: randomUUID(), file });
  }

  public set slot(value: RelationString | string) {
    let slot = value;

    if (typeof slot == 'string') slot = RelationString.define(slot);

    if (slot.value != this.file.slot.value)
      ApiError.throw(FileErrors.SLOT_MISMATCH);

    if (this._user && slot.family !== 'user')
      ApiError.throw(FileErrors.ENTITY_MISMATCH);

    if (this._application && slot.family !== 'application')
      ApiError.throw(FileErrors.ENTITY_MISMATCH);

    this._slot = slot;
  }

  public get slot(): string {
    if (!this._slot)
      ApiError.throw(FileErrors.INCOMPLETE_RELATION, 'Slot is not defined');
    return this._slot.value;
  }

  public set user(value: UserEntity) {
    if (this.relatedToEntity) ApiError.throw(FileErrors.RELATION_IMMUTABLE);

    this._user = value;
  }
  public get user(): UserEntity | undefined {
    return this._user;
  }

  public set application(value: ApplicationEntity) {
    if (this.relatedToEntity) ApiError.throw(FileErrors.RELATION_IMMUTABLE);

    this._application = value;
  }
  public get application(): ApplicationEntity | undefined {
    return this._application;
  }

  private get relatedToEntity() {
    if (typeof this._user !== 'undefined') return true;
    if (typeof this._application !== 'undefined') return true;
    return false;
  }

  public get file() {
    return this._file;
  }

  public get filed() {
    return this._slot && this.relatedToEntity;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      file: this.file,
      slot: this.slot,
      user: this.user?.id,
      application: this.application?.id,
    };
  }
}
