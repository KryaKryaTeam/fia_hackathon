import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
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
  ): Observable<any> | Promise<Observable<any>> {
    const pr = (data: unknown) => {
      return this.processData(data);
    };
    return next.handle().pipe(map(pr));
  }

  private async processData(data: unknown): Promise<unknown> {
    if (Array.isArray(data)) {
      return await Promise.all(data.map((i) => this.processData(i)));
    } else if (data !== null && typeof data === 'object') {
      if (data instanceof InternalFile) {
        return await this.fileLoadService.getLink(data);
      } else {
        if (Array.from(Object.keys(data)).length > 1) {
          await Promise.all(
            Object.keys(data).map(async (key) => {
              (data as unknown as Record<string, unknown>)[key] =
                await this.processData(
                  (data as unknown as Record<string, unknown>)[key],
                );
            }),
          );
        }
        return data;
      }
    }
    return data;
  }
}
