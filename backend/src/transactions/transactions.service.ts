import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Transaction } from './entities/transaction.entity';
import { User } from '../users/user.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository:
      Repository<Transaction>,
  ) {}

  async create(data: {
    user: User;
    gatewayTransactionId: string;
    externalReference: string;
    amount: number;
    type: 'PIX' | 'CREDIT_CARD' | 'WITHDRAWAL';
    status:
      | 'PENDING'
      | 'APPROVED'
      | 'DENIED'
      | 'EXPIRED'
      | 'CANCELLED';
  }) {
    const transaction =
      this.transactionsRepository.create(data);

    return this.transactionsRepository.save(
      transaction,
    );
  }
}