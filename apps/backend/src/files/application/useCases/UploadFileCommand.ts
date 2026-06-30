import { Inject } from '@nestjs/common';
import { Command } from '@/common/application/Command';
import { ReposTokens, ServiceTokens } from '@/common/Tokens';
import { FileEntity } from '@/files/domain/entities/File.entity';
import { Readable } from 'node:stream';
import type { ILoadFileService } from '../bounds/ILoadFileService';
import type { IFileRepository } from '../bounds/IFileRepository';
import { RelationString } from '@/files/domain/objects/RelationSlots';

interface CommandInput {
  stream: Readable;
  relationString: RelationString;
}
interface CommandOutput {
  file: FileEntity;
}

export class UploadFileCommand extends Command<CommandInput, CommandOutput> {
  @Inject(ServiceTokens.LoadFileService)
  private readonly loadFileService: ILoadFileService;

  @Inject(ReposTokens.FileRepository)
  private readonly fileRepository: IFileRepository;

  async implementation(data: CommandInput): Promise<CommandOutput> {
    const result = await this.loadFileService.loadFile(
      data.stream,
      data.relationString,
    );

    await this.fileRepository.save(result);

    return { file: result };
  }
}
