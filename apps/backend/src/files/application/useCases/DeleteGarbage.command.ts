import { Inject } from '@nestjs/common';
import { Command } from '@/common/application/Command';
import type { IFileRepository } from '../bounds/IFileRepository';
import { ReposTokens, ServiceTokens } from '@/common/Tokens';
import type { ILoadFileService } from '../bounds/ILoadFileService';

interface DeleteGarbageCommandOutput {
  numberOfDeleted: number;
  failedToDelete: number;
}

export class DeleteGarbageCommand extends Command<
  void,
  DeleteGarbageCommandOutput
> {
  @Inject(ReposTokens.FileRepository)
  private readonly fileRepository: IFileRepository;

  @Inject(ServiceTokens.LoadFileService)
  private readonly loadFileService: ILoadFileService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async implementation(data: void): Promise<DeleteGarbageCommandOutput> {
    const urls = await this.fileRepository.deleteFilesWithNoRelation();

    let failedToDelete = 0;
    let deleted = 0;
    await Promise.all(
      urls.map(async (el) => {
        try {
          await this.loadFileService.deleteFile(el);
          deleted++;
        } catch {
          failedToDelete++;
        }
      }),
    );

    return {
      numberOfDeleted: deleted,
      failedToDelete: failedToDelete,
    };
  }
}
