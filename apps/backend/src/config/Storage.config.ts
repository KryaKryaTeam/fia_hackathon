import { registerAs } from '@nestjs/config';
import { ServeStaticModuleOptions } from '@nestjs/serve-static';
import path from 'path';

export default registerAs('storage', () => ({
  controller: process.env.STORAGE_CONTROLLER || 'ls',
  limit: Number(process.env.STORAGE_LIMIT) || 64 * 1024 * 1024,
  concurrency: Number(process.env.STORAGE_CONCURRENCY) || 1,
  cache: process.env.STORAGE_CACHE == 'TRUE' || false,
  s3: {
    id: process.env.S3_ID,
    accessKey: process.env.S3_ACCESS_KEY,
    region: process.env.S3_REGION,
    bucket: process.env.S3_BUCKET,
  },
  ls: {
    basePath: process.env.BASE_PATH || path.join(process.cwd(), 'uploads'),
  },
}));

export const ServeStaticConfig: () => ServeStaticModuleOptions = () => ({
  rootPath: process.env.BASE_PATH || path.join(process.cwd(), 'uploads'),
  serveRoot: '/v' + process.env.VERSION + '/static/',
  serveStaticOptions: { index: false },
});
