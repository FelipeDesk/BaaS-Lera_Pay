import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { CheckoutService } from './checkout.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { CreateCardPaymentDto } from '../gateway/dto/create-card-payment.dto';

@Controller('checkout-links')
export class CheckoutController {
  constructor(
    private readonly checkoutService: CheckoutService,
  ) {}

  @Post(':userId')
  create(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createCheckoutDto: CreateCheckoutDto,
  ) {
    return this.checkoutService.create(
      userId,
      createCheckoutDto,
    );
  }

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
}