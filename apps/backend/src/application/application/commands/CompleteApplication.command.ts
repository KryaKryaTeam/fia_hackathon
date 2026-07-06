import { ApplicationSoket } from '@/application/infrastructure/gateway/websocket.gateway';
import { Command } from '@/common/application/Command';
import { Inject } from '@nestjs/common';
import type { IApplicationRepository } from '../bounds/IApplicationRepository';
import type { IPDFGeneratorService } from '../bounds/IPDFGeneratorService';
import { ReposTokens, ServiceTokens } from '@/common/Tokens';
import type { ILoadFileService } from '@/files/application/bounds/ILoadFileService';
import { RelationString } from '@/files/domain/objects/RelationSlots';
import type { IFileRepository } from '@/files/application/bounds/IFileRepository';

interface CompleteApplicationCommandData {
  applicationId: string;
  text: string;
}

export class CompleteApplicationCommand extends Command<
  CompleteApplicationCommandData,
  void
> {
  @Inject() socket: ApplicationSoket;
  @Inject(ReposTokens.ApplicationRepository)
  applicationRepo: IApplicationRepository;
  @Inject(ServiceTokens.PDFGeneratorService)
  pdfGenService: IPDFGeneratorService;
  @Inject(ServiceTokens.LoadFileService)
  loadFile: ILoadFileService;

  @Inject(ReposTokens.FileRepository)
  private readonly fileRepository: IFileRepository;

  override async implementation(
    data: CompleteApplicationCommandData,
  ): Promise<void> {
    const application = await this.applicationRepo.findById(data.applicationId);

    const stream = await this.pdfGenService.generate(data.text);
    const result = await this.loadFile.loadFile(
      stream,
      RelationString.define('application:pdf'),
    );

    await this.fileRepository.save(result);

    application.completeTask();
  }
}
