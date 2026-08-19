import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

import { CheckoutLink } from './entities/checkout-link.entity';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { UsersService } from '../users/users.service';
import { GatewayService } from '../gateway/gateway.service';
import { OrdersService } from '../orders/orders.service';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class CheckoutService {
  constructor(
    @InjectRepository(CheckoutLink)
    private readonly checkoutRepository:
      Repository<CheckoutLink>,

    private readonly usersService: UsersService,
    private readonly gatewayService: GatewayService,
    private readonly ordersService: OrdersService,
    private readonly transactionsService: TransactionsService,
  ) {}

  async create(
    userId: number,
    data: CreateCheckoutDto,
  ) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException(
        'Usuário não encontrado',
      );
    }

    const externalReference =
      `CHECKOUT-${randomUUID()}`;

    const checkout =
      this.checkoutRepository.create({
        user,
        amount: data.amount,
        description: data.description,
        paymentMethod: data.paymentMethod,
        externalReference,
        status: 'PENDING',
        feePercent: null,
        gatewayTransactionId: null,
        expiresAt: null,
      });

    return this.checkoutRepository.save(checkout);
  }

  async payWithPix(
    checkoutId: number,
    payerDocument: string,
    ) {
    const checkout =
        await this.checkoutRepository.findOne({
        where: {
            id: checkoutId,
        },
        relations: {
            user: true,
        },
        });

    if (!checkout) {
        throw new NotFoundException(
        'Checkout não encontrado',
        );
    }

    const pixResponse =
        await this.gatewayService.createPix(
        checkout.user.id,
        {
            amount: checkout.amount,
            description: checkout.description,
            payerDocument,
            externalReference:
            checkout.externalReference,
        },
        );

    checkout.status = pixResponse.status;

    checkout.gatewayTransactionId =
        String(pixResponse.id);

    await this.checkoutRepository.save(checkout);

    await this.ordersService.createFromCheckout(
      checkout,
      String(pixResponse.id),
      pixResponse.status,
    );

    await this.transactionsService.create({
      user: checkout.user,
      gatewayTransactionId: String(pixResponse.id),
      externalReference: checkout.externalReference,
      amount: checkout.amount,
      type: 'PIX',
      status: pixResponse.status,
    });

    return pixResponse;
  }

  async findByExternalReference(
    externalReference: string,
  ) {
    return this.checkoutRepository.findOne({
      where: {
        externalReference,
      },
    });
  }

  async updateStatus(
    checkout: CheckoutLink,
    status: CheckoutLink['status'],
  ) {
    checkout.status = status;

    return this.checkoutRepository.save(
      checkout,
    );
  }
}