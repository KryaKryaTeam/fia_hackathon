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
import type { Request as ExpressRequest } from 'express';

@Injectable()
export class ApplicationGuard implements CanActivate {
  private readonly redisClient: Redis;

  constructor(
    @Inject(RedisConfig.KEY)
    private readonly redisConfig: ConfigType<typeof RedisConfig>,
  ) {
    this.redisClient = new Redis({
      host: redisConfig.host,
      port: redisConfig.port,
      // ioredis doesn't actually have a `ttl` option
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: ExpressRequest = context.switchToHttp().getRequest();
    if (!request.user_id) return false;
    const key = `user:limit:${request.user_id}`;
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

    return true;
  }
}
