import { FileEntity } from '@/files/domain/entities/File.entity';

export interface IFileRepository {
  save(file: FileEntity): Promise<void>;
  deleteFilesWithNoRelation(): Promise<FileEntity[]>;
  findByUrl(url: string): Promise<FileEntity | null>;
}
