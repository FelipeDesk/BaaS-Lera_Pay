import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { RegisterGatewayDto } from './dto/register-gateway.dto';
import { LoginGatewayDto } from './dto/login-gateway.dto';

@Injectable()
export class GatewayService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl =
      this.configService.get<string>('GATEWAY_BASE_URL') ?? '';
  }

  async register(data: RegisterGatewayDto) {
    const response = await firstValueFrom(
      this.httpService.post(
        `${this.baseUrl}/users`,
        data,
      ),
    );

    return response.data;
  }

  async login(data: LoginGatewayDto) {
    const response = await firstValueFrom(
      this.httpService.post(
        `${this.baseUrl}/auth/login`,
        data,
      ),
    );

    return response.data;
  }
}