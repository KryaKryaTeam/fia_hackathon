import { Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileEntity } from '@/files/domain/entities/File.entity';
import { InternalFile } from '@/files/domain/objects/InternalFile.object';
import { PassThrough, Readable } from 'stream';
import { fileTypeFromBuffer, FileTypeResult } from 'file-type';
import { RelationString } from '@/files/domain/objects/RelationSlots';
import sharp from 'sharp';
import { ApiError, FileErrors } from '@/error/ApiError';
import path from 'path';
import os from 'os';
import { randomUUID } from 'crypto';
import fs from 'fs';
import { pipeline } from 'stream/promises';

export abstract class BaseLoadController {
  @Inject()
  protected readonly configService: ConfigService;

  protected readonly logger = new Logger('BaseLoadController');

  async load(stream: Readable, relationString: RelationString) {
    const config = relationString.config;

    // 1. Determine Output MIME & Format
    // If processing, we know the format (e.g., webp). If not, we peek at the input.
    let mimeType: FileTypeResult;
    const targetFormat = config.shouldBeProcessed ? 'webp' : null;

    if (config.shouldBeProcessed) {
      mimeType = { mime: 'image/webp', ext: 'webp' };
    } else {
      // Peek at the first 4100 bytes of the INPUT stream
      const firstChunk = await new Promise<Buffer>((resolve) => {
        stream.once('readable', () => {
          const chunk = (stream.read(4100) || stream.read()) as Buffer;
          resolve(chunk);
        });
      });
      if (firstChunk) stream.unshift(firstChunk); // Put it back for Sharp/PassThrough

      // We import fileTypeFromBuffer for this
      const detected = await fileTypeFromBuffer(firstChunk);
      if (
        !detected ||
        !config.allowedMimeTypes.includes(detected.mime as any)
      ) {
        throw ApiError.returnNew(FileErrors.MIME_TYPE_IS_UNDEFINED);
      }
      mimeType = detected;
    }

    // 2. Setup Transformer
    const transformer = config.shouldBeProcessed
      ? sharp()
          .toFormat(targetFormat as any)
          .webp({ quality: 80 })
          .resize({
            width: config.dimensions[0],
            height: config.dimensions[1],
            fit: 'contain',
            background: { r: 32, g: 32, b: 32, alpha: 1 },
          })
      : new PassThrough();

    // 3. Prepare Temp File & Pipeline
    const tempDir = path.join(os.tmpdir(), 'fia');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const tempFilePath = path.join(tempDir, `${randomUUID()}.temp`);
    const finalPass = new PassThrough();
    let size = 0;

    finalPass.on('data', (chunk) => {
      size += (chunk as { length: number }).length;
      if (size > config.maxSize) {
        stream.destroy();
        transformer.destroy();
        throw ApiError.returnNew(FileErrors.FILE_TOO_LARGE);
      }
    });

    // Execute the pipeline: Input -> Transformer -> Validation -> Disk
    // We use stream.pipe manually here because we need to handle the flow
    stream.pipe(transformer).pipe(finalPass);

    await pipeline(finalPass, fs.createWriteStream(tempFilePath));

    // 4. Upload from Disk to S3
    try {
      const file_ = await this._load(
        fs.createReadStream(tempFilePath),
        Promise.resolve(mimeType),
      );

      file_.size = size;
      file_.slot = relationString;
      return file_;
    } finally {
      // 5. Cleanup: Always delete the temp file
      fs.unlink(tempFilePath, (err) => {
        if (err)
          this.logger.error(`Failed to delete temp file: ${tempFilePath}`);
      });
    }
  }
  protected abstract _load(
    stream: Readable,
    mimeType: Promise<FileTypeResult | undefined>,
  ): Promise<FileEntity>;
  abstract delete(file: FileEntity): Promise<void> | void;
  abstract getLink(file: FileEntity | InternalFile): Promise<string> | string;
}
