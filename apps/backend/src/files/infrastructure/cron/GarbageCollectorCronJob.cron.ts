import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DeleteGarbageCommand } from '@/files/application/useCases/DeleteGarbage.command';

@Injectable()
export class GarbageCollectorCronJobService {
  private readonly deleteGarbageCommand: DeleteGarbageCommand;

  private readonly logger = new Logger('Garbage collector');

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async collectGarbageTrigger() {
    this.logger.log('Start to collecting garbage');

    const data = await this.deleteGarbageCommand.execute();

    this.logger.log(`Files deleted: ${data.numberOfDeleted}`);
    this.logger.log(`Files failed to delete: ${data.failedToDelete}`);
  }
}
