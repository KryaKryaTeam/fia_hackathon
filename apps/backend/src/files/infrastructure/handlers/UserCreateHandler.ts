import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UserEntity } from '@/authorization/domain/entities/User.entity';
import { EventHandler } from '@/common/application/events/EventHandler';
import { EventType } from '@/common/domain/EventType';
import { BaseTokens, ReposTokens, ServiceTokens } from '@/common/Tokens';
import type { IFileRepository } from '@/files/application/bounds/IFileRepository';
import { LinkerApplicationService } from '@/files/application/services/Linker.appService';
import { ApiError, FileErrors } from '@/error/ApiError';

@Injectable()
export class UserCreatedHandlerFile implements OnModuleInit {
  private readonly logger = new Logger(UserCreatedHandlerFile.name);
  constructor(
    @Inject(BaseTokens.EventHandler) private eventHandler: EventHandler,
    @Inject(ReposTokens.FileRepository)
    private readonly fileRepostory: IFileRepository,
    @Inject(ServiceTokens.FileLinkerService)
    private readonly linkerService: LinkerApplicationService,
  ) {}

  onModuleInit() {
    this.eventHandler.addListener(
      EventType.USER_CREATED,
      this.handle.bind(this),
    );
  }

  async handle(payload: UserEntity) {
    const file = await this.fileRepostory.findByUrl(payload.avatarURL.url);
    if (!file) ApiError.throw(FileErrors.FILE_WITH_THIS_ID_UNDEFINED);

    await this.linkerService.linkAvatarToUser(file, payload);
    this.logger.log('User avatar linked to user');
  }
}
