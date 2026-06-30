import {
  DynamicModule,
  ForwardReference,
  Module,
  Provider,
  Type,
} from '@nestjs/common';
import { globSync } from 'glob';
import { join } from 'path';

@Module({})
export class AutoScannerModule {
  /**
   * Сканує вказану директорію на наявність команд та квері
   * @param moduleDir __dirname модуля, який викликає сканування
   */
  static forFeature(
    moduleDir: string,
    imports: Array<
      Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
    > = [],
  ): DynamicModule {
    const pattern = join(moduleDir, 'application/**/*.{command,query}.{ts,js}');
    const files = globSync(pattern);

    const discoveredProviders: Provider[] = files.flatMap((file) => {
      const moduleExports = require(file);

      return Object.values(moduleExports).filter(
        (exp) => typeof exp === 'function',
      ) as Provider[];
    });

    return {
      module: AutoScannerModule,
      imports: imports,
      providers: discoveredProviders,
      exports: discoveredProviders,
    };
  }
}
