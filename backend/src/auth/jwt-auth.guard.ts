import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard
  implements CanActivate
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService:
      ConfigService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request =
      context.switchToHttp().getRequest();

    const authorization =
      request.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith('Bearer ')
    ) {
      throw new UnauthorizedException(
        'Token de autenticação obrigatório',
      );
    }

    const token =
      authorization.split(' ')[1];

    try {
      const payload =
        await this.jwtService.verifyAsync(
          token,
          {
            secret:
              this.configService.get<string>(
                'JWT_SECRET',
              ),
          },
        );

      request.user = payload;

      return true;
    } catch {
      throw new UnauthorizedException(
        'Token inválido ou expirado',
      );
    }
  }
}