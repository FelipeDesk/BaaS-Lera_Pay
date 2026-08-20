import { Injectable, UnauthorizedException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual, } from 'crypto';

import { WebhookEvent } from './entities/webhook-event.entity';
import { OrdersService } from '../orders/orders.service';
import { TransactionsService } from '../transactions/transactions.service';
import { CheckoutService } from '../checkout/checkout.service';
import { WithdrawalsService } from '../withdrawals/withdrawals.service';

@Injectable()
export class WebhooksService {
  constructor(
    @InjectRepository(WebhookEvent)
    private readonly webhookRepository: Repository<WebhookEvent>,

    private readonly ordersService: OrdersService,
    private readonly transactionsService: TransactionsService,
    private readonly checkoutService: CheckoutService,
    private readonly configService: ConfigService,
    private readonly withdrawalsService: WithdrawalsService,
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

  private async findExistingEvent(
    externalEventId: string,
  ) {
    return this.webhookRepository.findOne({
      where: {
        externalEventId,
      },
    });
  }

  private async processPaymentWebhook(
    expectedEvent: 'PAYMENT_PIX' | 'PAYMENT_CARD',
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

    const {
      event,
      status,
      transactionId,
      externalReference,
    } = payload;

    if (
      event !== expectedEvent ||
      !transactionId ||
      !externalReference
    ) {
      return {
        received: false,
        message: 'Payload de webhook inválido',
      };
    }

    const existingEvent =
      await this.findExistingEvent(
        transactionId,
      );

    if (existingEvent) {
      return {
        received: true,
        duplicated: true,
      };
    }

    const webhookEvent =
      this.webhookRepository.create({
        eventType: event,
        externalEventId: transactionId,
        payload,
        processed: false,
      });

    await this.webhookRepository.save(
      webhookEvent,
    );

    const order =
      await this.ordersService.findByExternalReference(
        externalReference,
      );

    const checkout =
      await this.checkoutService.findByExternalReference(
        externalReference,
      );

    const transaction =
      await this.transactionsService.findByExternalReference(
        externalReference,
      );

    const validStatuses = [
      'PENDING',
      'APPROVED',
      'DENIED',
      'EXPIRED',
      'CANCELLED',
    ] as const;

    if (
      validStatuses.includes(
        status as typeof validStatuses[number],
      )
    ) {
      if (order) {
        await this.ordersService.updateStatus(
          order,
          status,
        );
      }

      if (checkout) {
        await this.checkoutService.updateStatus(
          checkout,
          status,
        );
      }

      if (transaction) {
        await this.transactionsService.updateStatus(
          transaction,
          status,
        );
      }
    }

    webhookEvent.processed = true;

    await this.webhookRepository.save(
      webhookEvent,
    );

    console.log(
      `${event} processado: ${externalReference} - ${status}`,
    );

    return {
      received: true,
      processed: true,
    };
  }

  async processPix(
    payload: any,
    rawBody: Buffer | undefined,
    signature?: string,
  ) {
    return this.processPaymentWebhook(
      'PAYMENT_PIX',
      payload,
      rawBody,
      signature,
    );
  }

  async processCard(
    payload: any,
    rawBody: Buffer | undefined,
    signature?: string,
  ) {
    return this.processPaymentWebhook(
      'PAYMENT_CARD',
      payload,
      rawBody,
      signature,
    );
  }

  async processWithdrawal(
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

    const {
      event,
      status,
      transactionId,
      externalReference,
    } = payload;

    if (
      event !== 'WITHDRAWAL' ||
      !transactionId ||
      !externalReference
    ) {
      return {
        received: false,
        message: 'Payload de webhook inválido',
      };
    }

    const existingEvent =
      await this.findExistingEvent(
        transactionId,
      );

    if (existingEvent) {
      return {
        received: true,
        duplicated: true,
      };
    }

    const webhookEvent =
      this.webhookRepository.create({
        eventType: event,
        externalEventId: transactionId,
        payload,
        processed: false,
      });

    await this.webhookRepository.save(
      webhookEvent,
    );

    const withdrawal =
      await this.withdrawalsService.findByExternalReference(
        externalReference,
      );

    const validStatuses = [
      'PENDING',
      'APPROVED',
      'DENIED',
      'EXPIRED',
      'CANCELLED',
    ] as const;

    if (
      withdrawal &&
      validStatuses.includes(
        status as typeof validStatuses[number],
      )
    ) {
      await this.withdrawalsService.updateStatus(
        withdrawal,
        status,
      );
    }

    webhookEvent.processed = true;

    await this.webhookRepository.save(
      webhookEvent,
    );

    console.log(
      `Webhook WITHDRAWAL processado: ${externalReference} - ${status}`,
    );

    return {
      received: true,
      processed: true,
    };
  }
}