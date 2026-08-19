import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { CheckoutLink } from './entities/checkout-link.entity';
import { UsersModule } from '../users/users.module';
import { GatewayModule } from '../gateway/gateway.module';
import { OrdersModule } from '../orders/orders.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CheckoutLink]),
    UsersModule,
    GatewayModule,
    OrdersModule,
    TransactionsModule,
  ],
  controllers: [CheckoutController],
  providers: [CheckoutService],
  exports: [CheckoutService],
})
export class CheckoutModule {}