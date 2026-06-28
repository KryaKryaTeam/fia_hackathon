import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from '../config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      envFilePath: ['.env.local', '.env'],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
