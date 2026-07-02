import { PipeTransform } from '@nestjs/common';
import { RelationString } from '@/files/domain/objects/RelationSlots';
import { ApiError, FileErrors } from '@/error/ApiError';

export class RelationStringTransfromPipe implements PipeTransform {
  transform(value: any) {
    try {
      if (typeof value !== 'string') throw new Error('Meow!');
      return RelationString.define(value);
    } catch {
      ApiError.throw(FileErrors.INVALID_RELATION_FORMAT);
    }
  }
}
