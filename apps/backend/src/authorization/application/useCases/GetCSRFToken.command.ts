import { Query } from '@/common/application/Query';
import { randomUUID } from 'crypto';

export class GetCSRFToken extends Query<null, string> {
  implementation(): string {
    const randomString = randomUUID();
    return randomString;
  }
}
