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
import cookieParser from 'cookie-parser';
import { MikroORM } from '@mikro-orm/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    credentials: true,
    origin: [
      process.env.ALLOWED_ORIGIN,
      'http://localhost:3000',
      'http://192.168.31.30:3000',
    ],
  } as CorsOptions);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: 'v1',
  });
  app.use(cookieParser());
  const port = process.env.PORT || 3000;

  const config = new DocumentBuilder()
    .setTitle('FIA_Hackhathon')
    .setDescription('The fia_hackhathon api documentation')
    .setVersion('v1')
    .addBearerAuth({ type: 'http' })
    .addOAuth2(
      {
        type: 'oauth2',
        description:
          'Авторизація через Google OAuth (Scalar -> Google -> Ваш бекенд)',
        flows: {
          authorizationCode: {
            authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
            tokenUrl: '/api/v1/auth/login?provider=GOOGLE',
            scopes: {
              'https://www.googleapis.com/auth/userinfo.email': 'Access email',
              'https://www.googleapis.com/auth/userinfo.profile':
                'Access profile',
              openid: 'Get openId',
            },
          },
        },
      },
      'GoogleOAuth',
    )
    .setLicense(
      'MIT',
      'https://github.com/KryaKryaTeam/fia_hackathon?tab=MIT-1-ov-file',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/reference',
    apiReference({
      theme: 'purple',
      content: document,
      hideModels: true,
      authentication: {
        preferredSecurityScheme: 'GoogleOAuth',
        securitySchemes: {
          GoogleOAuth: {
            flows: {
              authorizationCode: {
                selectedScopes: [
                  'https://www.googleapis.com/auth/userinfo.email',
                  'https://www.googleapis.com/auth/userinfo.profile',
                  'openid',
                ],
                'x-scalar-client-id':
                  process.env.GOOGLE_CLIENT_ID ||
                  'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
                'x-scalar-security-query': {
                  prompt: 'consent',
                },
              },
            },
          },
        },
      },
    }),
  );

  Logger.log(`🚀 Start migrator`);

  const nestOrm = app.get(MikroORM);
  await nestOrm.migrator.up();

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
