import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export const UserId = createParamDecorator(
  (data, context: ExecutionContext) => {
    const req: Request = context.switchToHttp().getRequest();

    return req['user_id'] as string;
  },
);
