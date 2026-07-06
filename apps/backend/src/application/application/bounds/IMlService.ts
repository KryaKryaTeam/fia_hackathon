import { ApplicationEntity } from '@/application/domain/entities/Application.entity';

export interface IMlService {
  sendToService(application: ApplicationEntity): Promise<void>;
}
