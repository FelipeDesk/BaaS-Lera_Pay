import { Injectable, UnauthorizedException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WebhookEvent } from './entities/webhook-event.entity';
import { OrdersService } from '../orders/orders.service';
import { TransactionsService } from '../transactions/transactions.service';
import { CheckoutService } from '../checkout/checkout.service';
import { ConfigService } from '@nestjs/config';

import {
  createHmac,
  timingSafeEqual,
} from 'crypto';

@Injectable()
export class WebhooksService {
  constructor(
    @InjectRepository(WebhookEvent)
    private readonly webhookRepository:
      Repository<WebhookEvent>,

    private readonly ordersService: OrdersService,
    private readonly transactionsService: TransactionsService,
    private readonly checkoutService: CheckoutService,
    private readonly configService: ConfigService,
  ) {}

  private validateSignature(
    rawBody: Buffer | undefined,
    signature?: string,
    ): boolean {
    const secret =
        this.configService.get<string>(
        'LERA_WEBHOOK_SECRET',
        );

    if (!secret) {
        return true;
    }

    if (!signature || !rawBody) {
        return false;
    }

    const expectedSignature = createHmac(
        'sha256',
        secret,
    )
        .update(rawBody)
        .digest('hex');

    const receivedBuffer = Buffer.from(
        signature,
        'utf8',
    );

    const expectedBuffer = Buffer.from(
        expectedSignature,
        'utf8',
    );

    if (
        receivedBuffer.length !==
        expectedBuffer.length
    ) {
        return false;
    }

    return timingSafeEqual(
        receivedBuffer,
        expectedBuffer,
    );
  }

  async processPix(
    payload: any,
    rawBody: Buffer | undefined,
    signature?: string,
    ) {
    const signatureValid =
        this.validateSignature(
        rawBody,
        signature,
        );

    if (!signatureValid) {
        throw new UnauthorizedException(
        'Assinatura do webhook inválida',
        );
    }

    console.log(
        'PAYMENT_PIX WEBHOOK:',
        JSON.stringify(payload, null, 2),
    );

    return {
        received: true,
    };
  }
}