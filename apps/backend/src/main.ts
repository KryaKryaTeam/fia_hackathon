/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    credentials: true,
    origin: [process.env.ALLOWED_ORIGIN, 'http://localhost:3000'],
  } as CorsOptions);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: 'v1',
  });
  const port = process.env.PORT || 3000;

  const config = new DocumentBuilder()
    .setTitle('FIA_Hackhathon')
    .setDescription('The fia_hackhathon api documentation')
    .setVersion('v1')
    .addBearerAuth({ type: 'http' })
    .setLicense(
      'MIT',
      'https://github.com/KryaKryaTeam/fia_hackathon?tab=MIT-1-ov-file',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/reference',
    apiReference({ theme: 'purple', content: document, hideModels: true }),
  );

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
