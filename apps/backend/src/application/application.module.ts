import { MapperTokens, ServiceTokens } from '@/common/Tokens';
import { forwardRef, Module, Provider } from '@nestjs/common';
import { GeoCoderService } from './infrastructure/services/GeoCoderService';
import { CreateApplicationCommand } from './application/commands/CreateApplication.command';
import { ApplicationMapper } from './application/mappers/Application.mapper';
import { ApplicationController } from './infrastructure/controllers/Application.controller';
import { GetMyApplicationQuery } from './application/commands/GetMyApplications.query';
import { MlService } from './infrastructure/services/MlService';
import { ApplicationSoket } from './infrastructure/gateway/websocket.gateway';
import { PDFGeneratorService } from './infrastructure/services/PDFGeneratorService';
import { FilesModule } from '@/files/files.module';
import { AuthorizationModule } from '@/authorization/authorization.module';
import { CompleteApplicationCommand } from './application/commands/CompleteApplication.command';

const providers: Provider[] = [
  { provide: ServiceTokens.GeoCoderService, useClass: GeoCoderService },
  { provide: MapperTokens.ApplicationMapper, useClass: ApplicationMapper },
  { provide: ServiceTokens.PDFGeneratorService, useClass: PDFGeneratorService },
  { provide: ServiceTokens.MlService, useClass: MlService },
  CompleteApplicationCommand,
  CreateApplicationCommand,
  GetMyApplicationQuery,
  MlService,
  ApplicationSoket,
];
@Module({
  providers,
  imports: [
    forwardRef(() => FilesModule),
    forwardRef(() => AuthorizationModule),
  ],
  exports: [...providers],
  controllers: [ApplicationController],
})
export class ApplicationModule {}
