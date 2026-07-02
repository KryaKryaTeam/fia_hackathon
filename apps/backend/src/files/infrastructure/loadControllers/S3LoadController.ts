import { FileEntity } from '@/files/domain/entities/File.entity';
import { Readable } from 'stream';
import { BaseLoadController } from './BaseLoadController';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { MimeType } from '@/files/domain/objects/MimeType.object';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { LoadController } from '../services/LoadFileService';
import { InternalFile } from '@/files/domain/objects/InternalFile.object';
import { FileTypeResult } from 'file-type';
import { Logger } from '@nestjs/common';

@LoadController('s3')
export class S3LoadController extends BaseLoadController {
  protected override logger = new Logger(S3LoadController.name);

  private get S3Client() {
    return new S3Client({
      credentials: {
        accessKeyId: this.configService.getOrThrow('storage.s3.id'),
        secretAccessKey: this.configService.getOrThrow('storage.s3.accessKey'),
      },
      region: this.configService.getOrThrow('storage.s3.region'),
    });
  }
  async _load(
    stream: Readable,
    mimeType: Promise<FileTypeResult | undefined>,
  ): Promise<FileEntity> {
    const mm = await mimeType;
    const file = FileEntity.create(null, new MimeType(mm?.mime));

    this.logger.log(`[S3] Starting upload to bucket. Mime: ${mm?.mime}`);

    const upload = new Upload({
      params: {
        Bucket: this.configService.getOrThrow('storage.s3.bucket'),
        Key: file.url,
        Body: stream,
        ContentType: mm!.mime,
      },
      client: this.S3Client,
      queueSize: 1,
      partSize: 5 * 1024 * 1024,
    });

    upload.on('httpUploadProgress', (progress) => {
      this.logger.debug(
        `[S3 PROGRESS] Loaded: ${progress.loaded} bytes for ${file.url}`,
      );
    });

    try {
      await upload.done();
      this.logger.log(`[S3 SUCCESS] Uploaded to S3: ${file.url}`);
    } catch (e) {
      this.logger.error(
        `[S3 ERROR] Failed to upload ${file.url}: ${(e as Error).message}`,
      );
      throw e;
    }

    return file;
  }
  async delete(file: FileEntity): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.configService.getOrThrow('storage.s3.bucket'),
      Key: file.url,
    });

    await this.S3Client.send(command);
  }
  async getLink(file: FileEntity | InternalFile): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.configService.getOrThrow('storage.s3.bucket'),
      Key: file.url,
    });
    return await getSignedUrl(this.S3Client, command, { expiresIn: 3600 });
  }
}
