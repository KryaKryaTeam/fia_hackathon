/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
export type SerializableObject = Record<string, unknown> | object;

export interface JsonSerializable {
  toJSON(): SerializableObject;
}

@Injectable()
export class JsonInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map((data: unknown) => this.serialize(data)));
  }

  private serialize(data: unknown): unknown {
    if (Array.isArray(data)) {
      return data.map((item) => this.serialize(item));
    }

    if (this.isJsonSerializable(data)) {
      return data.toJSON();
    }

    return data;
  }

  private isJsonSerializable(obj: unknown): obj is JsonSerializable {
    return (
      obj !== null &&
      typeof obj === 'object' &&
      'toJSON' in obj &&
      typeof (obj as JsonSerializable).toJSON === 'function'
    );
  }
}
