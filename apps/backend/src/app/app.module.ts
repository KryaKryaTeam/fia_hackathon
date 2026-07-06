import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from '../config/app.config';
import { AuthorizationModule } from '@/authorization/authorization.module';
import { CommonModule } from '@/common/common.module';
import { FilesModule } from '@/files/files.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from '../mikro-orm.config';
import AvatarConfig from '@/config/Avatar.config';
import CookieConfig from '@/config/Cookie.config';
import GoogleConfig from '@/config/Google.config';
import JWTConfig from '@/config/JWT.config';
import StorageConfig from '@/config/Storage.config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import RedisConfig from '@/config/Redis.config';
import MapConfig from '@/config/Map.config';
import { ApplicationModule } from '@/application/application.module';
import { APP_FILTER } from '@nestjs/core';
import { ApiErrorExceptionsFilter } from '@/error/ApiError.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        appConfig,
        AvatarConfig,
        CookieConfig,
        GoogleConfig,
        RedisConfig,
        JWTConfig,
        StorageConfig,
        MapConfig,
      ],
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.getOrThrow('redis.host'),
            port: configService.getOrThrow('redis.port'),
          },
          ttl: configService.getOrThrow('redis.ttl'),
        }),
      }),
    }),
    AuthorizationModule,
    ApplicationModule,
    CommonModule,
    FilesModule,
    MikroOrmModule.forRoot(config),
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
