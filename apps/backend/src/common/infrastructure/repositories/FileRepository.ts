import { BaseRepository } from './BaseRepository';
import { IFileRepository } from '@/files/application/bounds/IFileRepository';
import { FileEntity } from '@/files/domain/entities/File.entity';
import { Inject, Injectable } from '@nestjs/common';
import { MapperTokens } from '@/common/Tokens';
import { FileMapper } from '@/files/application/mappers/FileMapper';
import { FileSchema } from '@/schemas/File.schema';
import { FileRelation } from '@/schemas/FileRelation.schema';

@Injectable()
export class FileRepository
  extends BaseRepository<FileSchema>
  implements IFileRepository
{
  protected _entitySchema = FileSchema;

  @Inject(MapperTokens.FileMapper)
  private readonly fileMapper: FileMapper;

  async save(file: FileEntity): Promise<void> {
    const schemaData = this.fileMapper.toSchema(file);
    await this.repository.upsert(schemaData);
  }

  async findByUrl(url: string): Promise<FileEntity | null> {
    const result = await this.repository.findOne({ url });
    if (!result) return null;

    return this.fileMapper.toEntity(result);
  }

  async deleteFilesWithNoRelation(): Promise<FileEntity[]> {
    const qb = this.repository.createQueryBuilder('file');
    const em = this.repository.getEntityManager();

    const subQuery = em
      .createQueryBuilder(FileRelation, 'rel')
      .select('rel.file.url')
      .getQuery();

    const orphans = await qb
      .select('*')
      .where({
        url: subQuery,
      })
      .getResult();

    if (orphans.length === 0) return [];

    const fileEntities = orphans.map((el) => this.fileMapper.toEntity(el));
    const urls = fileEntities.map((el) => el.url);

    await this.repository.nativeDelete({ url: { $in: urls } });

    return fileEntities;
  }
}
