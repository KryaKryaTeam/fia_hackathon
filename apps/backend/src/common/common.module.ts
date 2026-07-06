import { forwardRef, Global, Module, Provider } from '@nestjs/common';
import { BaseTokens, ReposTokens } from './Tokens';
import { EventDispatcher } from './application/events/EventDispatcher';
import { EventHandler } from './application/events/EventHandler';
import { DBContext } from './infrastructure/DBContext';
import { UserRepository } from './infrastructure/repositories/UserRepository';
import { AuthorizationProviderRepository } from './infrastructure/repositories/AuthorizationProviderRepository';
import { FileRepository } from './infrastructure/repositories/FileRepository';
import { FileRelationRepository } from './infrastructure/repositories/FileRelationRepository';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JsonInterceptor } from './infrastructure/interceptors/JsonInterceptor';
import { AuthorizationModule } from '@/authorization/authorization.module';
import { FilesModule } from '@/files/files.module';
import { ApplicationModule } from '@/application/application.module';
import { ApplicationRepository } from './infrastructure/repositories/ApplicationRepository';

const providers: Provider[] = [
  { provide: BaseTokens.EventDispatcher, useClass: EventDispatcher },
  { provide: BaseTokens.EventHandler, useClass: EventHandler },
  { provide: BaseTokens.DBContext, useClass: DBContext },
  { provide: ReposTokens.UserRepository, useClass: UserRepository },
  {
    provide: ReposTokens.AuthorizationProviderRepository,
    useClass: AuthorizationProviderRepository,
  },
  { provide: ReposTokens.FileRepository, useClass: FileRepository },
  {
    provide: ReposTokens.FileRelationRepository,
    useClass: FileRelationRepository,
  },
  {
    provide: ReposTokens.ApplicationRepository,
    useClass: ApplicationRepository,
  },
];

@Global()
@Module({
  providers: [
    ...providers,
    {
      provide: APP_INTERCEPTOR,
      useClass: JsonInterceptor,
    },
  ],
  exports: providers,
  imports: [
    forwardRef(() => AuthorizationModule),
    forwardRef(() => FilesModule),
    forwardRef(() => ApplicationModule),
  ],
})
export class CommonModule {}
