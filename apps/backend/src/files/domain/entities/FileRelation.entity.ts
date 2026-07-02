import { Entity } from '@/common/domain/Entity';
import { FileEntity } from './File.entity';
import { UserEntity } from '@/authorization/domain/entities/User.entity';
import { randomUUID } from 'crypto';
import { ApiError, FileErrors } from '@/error/ApiError';
import { RelationString } from '../objects/RelationSlots';

interface IFileRelationEntity {
  id: string;
  file: FileEntity;
  slot?: RelationString;
  user?: UserEntity;
}

export class FileRelationEntity extends Entity {
  public readonly id: string;
  private _file: FileEntity;
  private _slot?: RelationString;
  private _user?: UserEntity;

  private constructor(partial: IFileRelationEntity) {
    super();
    this.id = partial.id;
    this._slot = partial.slot;
    this._file = partial.file;
    this._user = partial.user;
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

  private get relatedToEntity() {
    if (typeof this._user !== 'undefined') return true;
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
    };
  }
}
