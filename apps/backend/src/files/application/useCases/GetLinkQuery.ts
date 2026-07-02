import { Inject, Injectable } from '@nestjs/common';
import { Query } from '../../../common/application/Query';
import { ReposTokens, ServiceTokens } from '@/common/Tokens';
import type { ILoadFileService } from '../bounds/ILoadFileService';
import type { IFileRepository } from '../bounds/IFileRepository';
import { ApiError, FileErrors } from '@/error/ApiError';

interface CommandInput {
  fileUrl: string;
}

@Injectable()
export class GetLinkQuery extends Query<CommandInput, string> {
  @Inject(ServiceTokens.LoadFileService)
  private readonly loadFileService: ILoadFileService;

  @Inject(ReposTokens.FileRepository)
  private readonly fileRepository: IFileRepository;
  async implementation(data: CommandInput): Promise<string> {
    const file = await this.fileRepository.findByUrl(data.fileUrl);

    if (!file) ApiError.throw(FileErrors.FILE_WITH_THIS_ID_UNDEFINED);

    return await this.loadFileService.getLink(file);
  }
}
