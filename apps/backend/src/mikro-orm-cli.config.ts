import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator, TSMigrationGenerator } from '@mikro-orm/migrations';
import { config } from 'dotenv';

config();

export default defineConfig({
  baseDir: process.cwd(),
  dbName: process.env.DB_NAME || 'my_database',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'secret',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  entities: ['./apps/backend/src/schemas/*.schema.{js,ts}'],
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: './apps/backend/src/migrations',
    pathTs: './apps/backend/src/migrations',
    glob: '!(*.d).{js,ts,cjs}',
    silent: false,
    transactional: true,
    disableForeignKeys: false,
    allOrNothing: true,
    dropTables: true,
    safe: false,
    snapshot: true,
    emit: 'ts',
    generator: TSMigrationGenerator,
    fileName: (timestamp: string, name?: string) =>
      `Migration${timestamp}${name ? '_' + name : ''}`,
  },

  extensions: [Migrator as any],

  discovery: {
    warnWhenNoEntities: false,
  },
});
