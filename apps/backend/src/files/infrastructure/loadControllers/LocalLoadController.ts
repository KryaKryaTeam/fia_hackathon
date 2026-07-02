import { FileEntity } from '@/files/domain/entities/File.entity';
import { Readable } from 'stream';
import { BaseLoadController } from './BaseLoadController';
import { MimeType } from '@/files/domain/objects/MimeType.object';
import fs, { existsSync, PathLike } from 'fs';
import fsPromises, { rename, unlink } from 'fs/promises';
import path from 'path';
import { pipeline } from 'stream/promises';
import { LoadController } from '../services/LoadFileService';
import { InternalFile } from '@/files/domain/objects/InternalFile.object';
import { OnModuleInit } from '@nestjs/common';
import { FileTypeResult } from 'file-type';
import { ApiError, StorageErrors } from '@/error/ApiError';

@LoadController('ls')
export class LocalLoadController
  extends BaseLoadController
  implements OnModuleInit
{
  async onModuleInit() {
    await fsPromises.mkdir(
      this.configService.getOrThrow('storage.ls.basePath'),
      { recursive: true },
    );
  }
  protected async _load(
    stream: Readable,
    mimeType: Promise<FileTypeResult | undefined>,
  ): Promise<FileEntity> {
    const temp = crypto.randomUUID();
    const fileTemp = path.join(
      this.configService.getOrThrow('storage.ls.basePath'),
      temp,
    );

    let filePath: PathLike | undefined;
    try {
      await pipeline(stream, fs.createWriteStream(fileTemp, { flags: 'wx' }));

      const mm = await mimeType;

      const file = FileEntity.create(null, new MimeType(mm?.mime));

      filePath = path.join(
        this.configService.getOrThrow('storage.ls.basePath'),
        file.url,
      );

      await rename(fileTemp, filePath);

      return file;
    } catch (err) {
      if (
        (err as { code: string }).code.startsWith('ENOENT') &&
        existsSync(fileTemp)
      )
        await unlink(fileTemp);

      if (
        (err as { code: string }).code.startsWith('ENOENT') &&
        typeof filePath !== 'undefined' &&
        existsSync(filePath)
      )
        await unlink(filePath);

      ApiError.throw(StorageErrors.OPERATION_FAILED);
    }
  }
  async delete(file: FileEntity): Promise<void> {
    const filePath = path.join(
      this.configService.getOrThrow('storage.ls.basePath'),
      file.url,
    );

    await fsPromises.unlink(filePath).catch((err) => {
      if ((err as { code: string }).code !== 'ENOENT') throw err;
    });
  }
  getLink(file: FileEntity | InternalFile): string {
    const url =
      this.configService.getOrThrow('server.baseUrl') +
      `v${this.configService.getOrThrow('server.version')}` +
      '/static/' +
      file.url;

    return url;
  }
}
