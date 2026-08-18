import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { GatewayService } from './gateway.service';
import { RegisterGatewayDto } from './dto/register-gateway.dto';
import { LoginGatewayDto } from './dto/login-gateway.dto';

@Controller('gateway')
export class GatewayController {
  constructor(
    private readonly gatewayService: GatewayService,
  ) {}

  @Post('register')
  register(
    @Body() registerGatewayDto: RegisterGatewayDto,
  ) {
    return this.gatewayService.register(registerGatewayDto);
  }

  @Post('login')
  login(
    @Body() loginGatewayDto: LoginGatewayDto,
  ) {
    return this.gatewayService.login(loginGatewayDto);
  }
}