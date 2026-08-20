import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { CheckoutService } from './checkout.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { PayCardDto } from './dto/pay-card.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PayPixDto } from './dto/pay-pix.dto';

@ApiTags('Checkout')
@Controller('checkout-links')
export class CheckoutController {
  constructor(
    private readonly checkoutService: CheckoutService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':checkoutId/pix')
  payWithPix(
    @Req() req: any,

    @Param('checkoutId', ParseIntPipe)
    checkoutId: number,

    @Body()
    pixData: PayPixDto,
  ) {
    return this.checkoutService.payWithPix(
      checkoutId,
      req.user.sub,
      pixData.payerDocument,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':checkoutId/card')
  payWithCard(
    @Req() req: any,

    @Param('checkoutId', ParseIntPipe)
    checkoutId: number,

    @Body()
    cardData: PayCardDto,
  ) {
    return this.checkoutService.payWithCard(
      checkoutId,
      req.user.sub,
      cardData,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  createAuthenticated(
    @Req() req: any,
    @Body() createCheckoutDto: CreateCheckoutDto,
  ) {
    return this.checkoutService.create(
      req.user.sub,
      createCheckoutDto,
    );
  }
}