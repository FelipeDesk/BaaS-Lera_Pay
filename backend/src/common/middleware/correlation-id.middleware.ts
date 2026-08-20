import {
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

import {
  Request,
  Response,
  NextFunction,
} from 'express';

import { randomUUID } from 'crypto';

@Injectable()
export class CorrelationIdMiddleware
  implements NestMiddleware
{
  use(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const correlationId =
      req.headers['x-correlation-id']?.toString() ||
      randomUUID();

    req.headers['x-correlation-id'] =
      correlationId;

    res.setHeader(
      'x-correlation-id',
      correlationId,
    );

    const startedAt = Date.now();

    res.on('finish', () => {
      const duration =
        Date.now() - startedAt;

      console.log(
        `[${correlationId}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`,
      );
    });

    next();
  }
}