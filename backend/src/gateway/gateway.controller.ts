import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  Query
} from '@nestjs/common';

import { GatewayService } from './gateway.service';
import { RegisterGatewayDto } from './dto/register-gateway.dto';
import { LoginGatewayDto } from './dto/login-gateway.dto';
import { CreatePixDto } from './dto/create-pix.dto';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { CreateCardPaymentDto } from './dto/create-card-payment.dto';

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

  @Get('wallet/:userId')
    getWallet(
        @Param('userId', ParseIntPipe) userId: number,
    ) {
        return this.gatewayService.getWallet(userId);
    }

  @Get('transactions/:userId')
    getTransactions(
        @Param('userId', ParseIntPipe) userId: number,
        @Query('status') status?: string,
        @Query('type') type?: string,
        @Query('limit') limit?: string,
    ) {
        return this.gatewayService.getTransactions(
            userId,
            status,
            type,
            limit ? Number(limit) : undefined,
        );
    }
   
  @Post('pix/:userId')
    createPix(
        @Param('userId', ParseIntPipe) userId: number,
        @Body() createPixDto: CreatePixDto,
    ) {
        return this.gatewayService.createPix(
            userId,
            createPixDto,
        );
  }

  @Post('webhooks/:userId')
    createWebhook(
        @Param('userId', ParseIntPipe)
            userId: number,

        @Body()
            createWebhookDto: CreateWebhookDto,
    ) {
        return this.gatewayService.createWebhook(
            userId,
            createWebhookDto,
    );
  }

  @Get('fees')
    getFees(
        @Query('brand') brand?: string,
    ) {
        return this.gatewayService.getFees(brand);
  }

  @Post('card/:userId')
    createCardPayment(
        @Param('userId', ParseIntPipe)
            userId: number,

        @Body()
            createCardPaymentDto:
            CreateCardPaymentDto,
    ) {
        return this.gatewayService.createCardPayment(
            userId,
            createCardPaymentDto,
        );
    }
}

