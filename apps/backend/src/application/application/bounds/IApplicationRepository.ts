import { ApplicationEntity } from '@/application/domain/entities/Application.entity';

export interface IApplicationRepository {
  save(ent: ApplicationEntity): Promise<void>;
  findById(id: string): Promise<ApplicationEntity>;
  findByUserId(userId: string): Promise<ApplicationEntity[]>;
}
