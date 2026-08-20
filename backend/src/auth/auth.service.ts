import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: LoginDto) {
    const user =
      await this.usersService.findByEmail(
        data.email,
      );

    if (!user) {
      throw new UnauthorizedException(
        'E-mail ou senha inválidos',
      );
    }

    const passwordValid =
      await bcrypt.compare(
        data.password,
        user.passwordHash,
      );

    if (!passwordValid) {
      throw new UnauthorizedException(
        'E-mail ou senha inválidos',
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken =
      await this.jwtService.signAsync(
        payload,
      );

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}