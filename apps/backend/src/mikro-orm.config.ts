import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator, TSMigrationGenerator } from '@mikro-orm/migrations';
import { config } from 'dotenv';
import { globSync } from 'glob';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isRuntime = __dirname.includes('dist');

async function loadEntities() {
  const searchFolder = isRuntime ? __dirname : join(__dirname);
  const extensionPattern = isRuntime ? '**/*.schema.js' : '**/*.schema.ts';

  const pattern = join(searchFolder, extensionPattern);
  const files = globSync(pattern);

  const entities = [];

  for (const file of files) {
    const fileUrl = pathToFileURL(file).href;
    const moduleExports = await import(fileUrl);

    const classes = Object.values(moduleExports).filter(
      (exp) => typeof exp === 'function',
    );
    entities.push(...classes);
  }

  return entities;
}

const loadedEntities = await loadEntities();

export default defineConfig({
  baseDir: process.cwd(),
  dbName: process.env.DB_NAME || 'my_database',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'secret',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  entities: loadedEntities,
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: join(__dirname, 'migrations'),
    pathTs: join(__dirname, 'migrations'),

    glob: isRuntime ? '!(*.d).{js,cjs}' : '!(*.d).{ts,js}',
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
