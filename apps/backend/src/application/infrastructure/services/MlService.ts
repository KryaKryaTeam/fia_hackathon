import { IMlService } from '@/application/application/bounds/IMlService';
import { ApplicationEntity } from '@/application/domain/entities/Application.entity';
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class MlService implements IMlService, OnModuleInit, OnModuleDestroy {
  public client: Redis;
  private readonly logger = new Logger(MlService.name);
  private subscriberClient: Redis;
  private isRunning = true;

  @Inject() configService: ConfigService;

  async addToStream(streamName: string, data: Record<string, string>) {
    const payload = Object.entries(data).flat();

    const jobId = await this.client.xadd(streamName, '*', ...payload);
    return jobId;
  }

  async sendToService(application: ApplicationEntity): Promise<void> {
    await this.addToStream('ml_tasks', {
      id: application.id,
      text: application.text,
      address: application.address.value,
      latitude: application.location.value.latitude.toString(),
      longitude: application.location.value.longitude.toString(),
      requester_id: application.requester.value.id,
      requester_email: application.requester.value.email,
      requester_fullName:
        application.requester.value.fullName || 'Вставити будь-який',
      requester_address:
        application.requester.value.address || 'Вставити будь-який',
      requester_phone:
        application.requester.value.phone || 'Вставити будь-який',
      createdAt: application.createdAt.toISOString(),
    });
  }

  private async listenToOutputStream() {
    const streamName = 'ml_results';
    let lastId = '$';

    this.logger.log(`Start listening for stream: ${streamName}`);

    while (this.isRunning) {
      try {
        const results = await this.subscriberClient.xread(
          'BLOCK',
          5000,
          'STREAMS',
          streamName,
          lastId,
        );

        if (results) {
          const messages = results[0][1];

          for (const [messageId, rawFields] of messages) {
            const data: Record<string, string> = {};
            for (let i = 0; i < rawFields.length; i += 2) {
              data[rawFields[i]] = rawFields[i + 1];
            }

            this.logger.log(`Get message ${messageId} from stream:`, data);

            lastId = messageId;
          }
        }
      } catch (error) {
        this.logger.error('Error while processing Redis queue:', error);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }

  onModuleInit() {
    this.client = new Redis({
      host: this.configService.getOrThrow('redis.host'),
      port: this.configService.getOrThrow('redis.port'),
    });
    this.subscriberClient = new Redis({
      host: this.configService.getOrThrow('redis.host'),
      port: this.configService.getOrThrow('redis.port'),
    });
    this.listenToOutputStream();
  }
  onModuleDestroy() {
    this.client.disconnect();
    this.isRunning = false;
    this.subscriberClient.disconnect();
  }
}
