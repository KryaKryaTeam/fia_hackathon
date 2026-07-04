import {
  DynamicModule,
  ForwardReference,
  Module,
  Provider,
  Type,
} from '@nestjs/common';
import { globSync } from 'glob';
import { join } from 'path';
import { pathToFileURL } from 'url';

@Module({})
export class AutoScannerModule {
  /**
   * Сканує вказану директорію на наявність команд та квері
   * @param moduleDir __dirname модуля, який викликає сканування
   */
  static async forFeatureAsync(
    moduleDir: string,
    imports: Array<
      Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
    > = [],
  ): Promise<DynamicModule> {
    const pattern = join(moduleDir, 'application/**/*.{command,query}.{ts,js}');
    const files = globSync(pattern);

    const promises = files.map(async (file) => {
      const fileUrl = pathToFileURL(file).href;
      const moduleExports = await import(fileUrl);

      return Object.values(moduleExports).filter(
        (exp) => typeof exp === 'function',
      ) as Provider[];
    });

    const nestedProviders = await Promise.all(promises);

    const providers: Provider[] = nestedProviders.flat();

    return {
      module: AutoScannerModule,
      imports: imports,
      providers,
      exports: providers,
    };
  }
}
