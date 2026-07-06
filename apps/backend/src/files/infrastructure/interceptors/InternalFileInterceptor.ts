import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, from, switchMap } from 'rxjs';
import { ServiceTokens } from '@/common/Tokens';
import type { ILoadFileService } from '@/files/application/bounds/ILoadFileService';
import { InternalFile } from '@/files/domain/objects/InternalFile.object';

@Injectable()
export class InternalFileInterceptor implements NestInterceptor {
  constructor(
    @Inject(ServiceTokens.LoadFileService)
    private readonly fileLoadService: ILoadFileService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next
      .handle()
      .pipe(switchMap((data) => from(this.processData(data))));
  }

  private async processData(data: unknown): Promise<unknown> {
    if (Array.isArray(data)) {
      return await Promise.all(data.map((i) => this.processData(i)));
    }

    if (data !== null && typeof data === 'object') {
      if (data instanceof InternalFile) {
        return await this.fileLoadService.getLink(data);
      }

      const result: Record<string, unknown> = {};
      const keys = Object.keys(data);

      await Promise.all(
        keys.map(async (key) => {
          const currentVal = (data as Record<string, unknown>)[key];
          result[key] = await this.processData(currentVal);
        }),
      );

      return result;
    }

    return data;
  }
}
