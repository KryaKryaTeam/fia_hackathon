import { defineConfig } from '@mikro-orm/postgresql';
import { config } from 'dotenv';
import { globSync } from 'fs';
import path from 'path';
config();

const entityFiles = globSync(path.join(__dirname, '/**/*.entity.js'));

const entities = entityFiles.flatMap((file) => {
  const moduleExports = require(file);

  return Object.values(moduleExports).filter((val) => {
    // Перевіряємо, чи це клас і чи має він метадані (хоча б назву)
    return typeof val === 'function' && val.name && val.name !== 'BaseEntity';
  });
});

// Тимчасово додайте цей лог, щоб побачити в консолі Docker/Nodemon, що саме знайшлося
console.log(
  '📌 Discovered entities for MikroORM:',
  entities.map((e) => (e as any).name),
);
export default defineConfig({
  dbName: process.env.DB_NAME || 'my_database',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'secret',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  entities: entities as any,
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
  },
  discovery: {
    warnWhenNoEntities: false,
  },
});
