import { forwardRef, Module, Provider } from '@nestjs/common';
import { MapperTokens, ServiceTokens } from '@/common/Tokens';
import { AuthorizationProviderMapper } from './application/mappers/AuthorizationProviderMapper';
import { UserMapper } from './application/mappers/UserMapper';
import { AuthorizationProviderService } from './infrastructure/services/AuthorizationProviderService';
import {
  APP_GUARD,
  APP_PIPE,
  DiscoveryModule,
  DiscoveryService,
} from '@nestjs/core';
import { GoogleAuthorizationProvider } from './infrastructure/authorizationProviders/GoogleAuthorizationProvider';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { JWTTokenService } from './infrastructure/services/JWTToken.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './infrastructure/guards/auth/auth.guard';
import { RoleGuard } from './infrastructure/guards/role/role.guard';
import { UserController } from './infrastructure/controllers/user.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { FilesModule } from '@/files/files.module';
import { TransfromUserIdtoEntity } from './infrastructure/pipes/TransfromUserIdToEntity.pipe';
import { AutoScannerModule } from '@/common/utils/AutoScanModule';

const providers: Provider[] = [
  {
    provide: MapperTokens.AuthorizationProviderMapper,
    useClass: AuthorizationProviderMapper,
  },
  {
    provide: MapperTokens.UserMapper,
    useClass: UserMapper,
  },
  {
    provide: ServiceTokens.AuthorizationProviderService,
    useClass: AuthorizationProviderService,
  },
  {
    provide: ServiceTokens.JWTService,
    useClass: JWTTokenService,
  },
  DiscoveryService,
  GoogleAuthorizationProvider,
  {
    provide: ServiceTokens.JWTService,
    useClass: JWTTokenService,
  },
];

@Module({
  providers: [
    ...providers,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    {
      provide: APP_PIPE,
      useClass: TransfromUserIdtoEntity,
    },
  ],
  imports: [
    AutoScannerModule.forFeature(__dirname, [
      forwardRef(() => FilesModule),
      DiscoveryModule,
      JwtModule.register({}),
      CacheModule.register(),
      forwardRef(() => AuthorizationModule),
    ]),
    DiscoveryModule,
    JwtModule.register({}),
    CacheModule.register(),
    forwardRef(() => FilesModule),
  ],
  exports: [...providers],
  controllers: [AuthController, UserController],
})
export class AuthorizationModule {}
