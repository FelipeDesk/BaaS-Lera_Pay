import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { WebhookEvent } from './entities/webhook-event.entity';

import { OrdersModule } from '../orders/orders.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { CheckoutModule } from '../checkout/checkout.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WebhookEvent]),
    OrdersModule,
    TransactionsModule,
    CheckoutModule,
  ],
  controllers: [WebhooksController],
  providers: [WebhooksService],
  exports: [WebhooksService],
})
export class WebhooksModule {}