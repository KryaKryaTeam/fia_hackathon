import { ApplicationSchema } from '@/schemas/Application.schema';
import { BaseRepository } from './BaseRepository';
import { IApplicationRepository } from '@/application/application/bounds/IApplicationRepository';
import { ApplicationEntity } from '@/application/domain/entities/Application.entity';
import { Inject } from '@nestjs/common';
import { MapperTokens } from '@/common/Tokens';
import { ApplicationMapper } from '@/application/application/mappers/Application.mapper';

export class ApplicationRepository
  extends BaseRepository<ApplicationSchema>
  implements IApplicationRepository
{
  protected override _entitySchema: new () => ApplicationSchema =
    ApplicationSchema;

  @Inject(MapperTokens.ApplicationMapper)
  private readonly applicationMapper: ApplicationMapper;
  async save(ent: ApplicationEntity): Promise<void> {
    const ent_ = this.applicationMapper.toSchema(ent);
    await this.repository.upsert(ent_);
  }
  async findById(id: string): Promise<ApplicationEntity> {
    const ent_ = await this.repository.findOneOrFail({ id });
    return this.applicationMapper.toEntity(ent_);
  }
  async findByUserId(userId: string): Promise<ApplicationEntity[]> {
    const ent_ = await this.repository.find({ user: { id: userId } });
    return ent_.map((e) => this.applicationMapper.toEntity(e));
  }
}
