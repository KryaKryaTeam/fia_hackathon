import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        appConfig,
        AvatarConfig,
        CookieConfig,
        GoogleConfig,
        JWTConfig,
        StorageConfig,
      ],
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),
    AuthorizationModule,
    CommonModule,
    FilesModule,
    MikroOrmModule.forRoot(config),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
