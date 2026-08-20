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
import { CreateCardPaymentDto } from '../gateway/dto/create-card-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Checkout')
@Controller('checkout-links')
export class CheckoutController {
  constructor(
    private readonly checkoutService: CheckoutService,
  ) {}

  @Post(':checkoutId/pix')
  payWithPix(
    @Param('checkoutId', ParseIntPipe) checkoutId: number,
    @Body('payerDocument') payerDocument: string,
  ) {
    return this.checkoutService.payWithPix(
      checkoutId,
      payerDocument,
    );
  }

  @Post(':checkoutId/card')
  payWithCard(
    @Param('checkoutId', ParseIntPipe)
    checkoutId: number,

    @Body()
    cardData: Omit<
      CreateCardPaymentDto,
      'amount' | 'description' | 'externalReference'
    >,
  ) {
    return this.checkoutService.payWithCard(
      checkoutId,
      cardData,
    );
  }

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