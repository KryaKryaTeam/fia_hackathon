import { registerAs } from '@nestjs/config';

interface JWTConfig {
  access_secret: string;
  refresh_secret: string;
}

export default registerAs(
  'jwt',
  (): JWTConfig => ({
    access_secret: process.env.ACCESS_TOKEN_SECRET ?? '123456789',
    refresh_secret: process.env.REFRESH_TOKEN_SECRET ?? '12345689',
  }),
);
