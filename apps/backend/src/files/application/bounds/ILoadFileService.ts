import { FileEntity } from '@/files/domain/entities/File.entity';
import { InternalFile } from '@/files/domain/objects/InternalFile.object';
import { RelationString } from '@/files/domain/objects/RelationSlots';
import { Readable } from 'stream';

export interface ILoadFileService {
  loadFile(file: Readable, rel: RelationString): Promise<FileEntity>;
  deleteFile(file: FileEntity): Promise<void>;
  getLink(file: FileEntity | InternalFile): Promise<string> | string;
}
