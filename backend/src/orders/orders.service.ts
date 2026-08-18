import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from './entities/order.entity';
import { CheckoutLink } from '../checkout/entities/checkout-link.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  async createFromCheckout(
    checkout: CheckoutLink,
    gatewayTransactionId: string,
    status: Order['status'],
  ) {
    const order = this.ordersRepository.create({
      checkout,
      externalReference: checkout.externalReference,
      gatewayTransactionId,
      status,
    });

    return this.ordersRepository.save(order);
  }

  async findByExternalReference(
    externalReference: string,
  ) {
    return this.ordersRepository.findOne({
      where: {
        externalReference,
      },
      relations: {
        checkout: true,
      },
    });
  }

  async updateStatus(
    order: Order,
    status: Order['status'],
  ) {
    order.status = status;

    return this.ordersRepository.save(order);
  }
}