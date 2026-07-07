import { Redis } from 'ioredis';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import RedisConfig from '@/config/Redis.config';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class ApplicationGuard implements CanActivate {
  @Inject(RedisConfig.KEY)
  private readonly redisConfig: ConfigType<typeof RedisConfig>;

  private readonly redisClient = new Redis({
    host: this.redisConfig.host,
    port: this.redisClient.port,
    ttl: this.redisClient.ttl,
  });

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> | Observable<boolean> {
    const key = `user:limit:${userId}`;
    const MAX_LIMIT_PER_WEEK = 10;
    const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;

    const currentRequests = await this.redisClient.incr(key);

    if (currentRequests === 1) {
      await this.redisClient.expire(key, ONE_WEEK_IN_SECONDS);
      return true;
    }

    if (currentRequests > MAX_LIMIT_PER_WEEK) {
      throw new HttpException(
        'Ви вичерпали свій щотижневий ліміт генерацій ШІ (макс. 10). Спробуйте наступного тижня!',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return false;
  }
}
