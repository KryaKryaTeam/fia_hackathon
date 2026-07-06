import { MapperTokens, ServiceTokens } from '@/common/Tokens';
import { Module, Provider } from '@nestjs/common';
import { GeoCoderService } from './infrastructure/services/GeoCoderService';
import { CreateApplicationCommand } from './application/commands/CreateApplication.command';
import { ApplicationMapper } from './application/mappers/Application.mapper';
import { ApplicationController } from './infrastructure/controllers/Application.controller';
import { GetMyApplicationQuery } from './application/commands/GetMyApplications.query';
import { MlService } from './infrastructure/services/MlService';
import { ApplicationSoket } from './infrastructure/gateway/websocket.gateway';
import { PDFGeneratorService } from './infrastructure/services/PDFGeneratorService';
import { FilesModule } from '@/files/files.module';

const providers: Provider[] = [
  { provide: ServiceTokens.GeoCoderService, useClass: GeoCoderService },
  { provide: MapperTokens.ApplicationMapper, useClass: ApplicationMapper },
  { provide: ServiceTokens.PDFGeneratorService, useClass: PDFGeneratorService },
  CreateApplicationCommand,
  GetMyApplicationQuery,
  MlService,
  ApplicationSoket,
];
@Module({
  providers,
  imports: [FilesModule],
  exports: [...providers],
  controllers: [ApplicationController],
})
export class ApplicationModule {}
