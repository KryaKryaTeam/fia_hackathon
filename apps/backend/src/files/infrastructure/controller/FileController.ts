import {
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Post,
  Req,
  Version,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { Secure } from '@/authorization/infrastructure/guards/auth/auth.guard';
import busboy from 'busboy';
import type { Request as RequestExpress } from 'express';
import { UploadFileCommand } from '@/files/application/useCases/UploadFileCommand';
import { GetLinkQuery } from '@/files/application/useCases/GetLinkQuery';
import { RelationString } from '@/files/domain/objects/RelationSlots';
import { RelationStringTransfromPipe } from '../dto/RelationString.dto';
import { ApiError, FileErrors } from '@/error/ApiError';
import { FileDto } from '../dto/File.dto';

@Controller('file')
@Secure()
export class FileController {
  private readonly uploadFileCommand: UploadFileCommand;
  private readonly getLinkQuery: GetLinkQuery;

  private readonly logger: Logger = new Logger(FileController.name);

  @Post('/upload/:relationString')
  @Version('1')
  @ApiConsumes('multipart/form-data') // Вказуємо тип контенту
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          // Назва поля, яке очікується
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, type: FileDto })
  async uploadFile(
    @Req() req: RequestExpress,
    @Param('relationString', RelationStringTransfromPipe)
    relationString: RelationString,
  ) {
    const bb = busboy({
      headers: req.headers,
      limits: { files: 1 },
    });

    const pr = new Promise((resolve, reject) => {
      let fileProcessed = false;

      bb.on('file', (name, stream, info) => {
        fileProcessed = true;
        this.logger.log(
          `[BUSBOY] Started receiving file: ${info.filename} (${info.mimeType})`,
        );

        this.uploadFileCommand
          .execute({
            stream,
            relationString,
          })
          .then(({ file }) => {
            this.logger.log(`[SUCCESS] File processed: ${info.filename}`);
            resolve(file.toJSON());
          })
          .catch((err) => {
            this.logger.error(
              `[ERROR] Command execution failed: ${(err as Error).message}`,
            );
            reject(err as Error);
          });
      });

      bb.on('error', (err: Error) => reject(err));

      bb.on('finish', () => {
        this.logger.log('[BUSBOY] Finished parsing multipart form');
        if (!fileProcessed) {
          reject(ApiError.returnNew(FileErrors.FILE_UNPROCESSED));
        }
      });

      req.pipe(bb);
    });

    return await pr;
  }

  @Get('/link/:fileURL')
  @ApiResponse({
    status: 200,
    example: 'http://localhost:4000/static/meow.webp',
  })
  async getLink(@Param('fileURL') fileUrl: string) {
    return await this.getLinkQuery.execute({ fileUrl });
  }
}
