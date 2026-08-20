import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

import { Withdrawal } from './entities/withdrawal.entity';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';

import { UsersService } from '../users/users.service';
import { GatewayService } from '../gateway/gateway.service';

@Injectable()
export class WithdrawalsService {
  constructor(
    @InjectRepository(Withdrawal)
    private readonly withdrawalsRepository:
      Repository<Withdrawal>,

    private readonly usersService: UsersService,
    private readonly gatewayService: GatewayService,
  ) {}

  async create(
    userId: number,
    data: CreateWithdrawalDto,
  ) {
    const user =
      await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException(
        'Usuário não encontrado',
      );
    }

    const externalReference =
      `WITHDRAWAL-${randomUUID()}`;

    const gatewayResponse =
      await this.gatewayService.createWithdrawal(
        userId,
        {
          amount: data.amount,
          pixKey: data.pixKey,
          description: data.description,
          document: data.document,
          externalReference,
        },
      );

    const withdrawal =
      this.withdrawalsRepository.create({
        user,
        externalReference,
        gatewayWithdrawalId:
          String(gatewayResponse.id),
        amount: data.amount,
        pixKey: data.pixKey,
        document: data.document,
        description: data.description,
        status: gatewayResponse.status,
      });

    await this.withdrawalsRepository.save(
      withdrawal,
    );

    return gatewayResponse;
  }

  async findByExternalReference(
    externalReference: string,
  ) {
    return this.withdrawalsRepository.findOne({
      where: {
        externalReference,
      },
    });
  }

  async updateStatus(
    withdrawal: Withdrawal,
    status: Withdrawal['status'],
  ) {
    withdrawal.status = status;

    return this.withdrawalsRepository.save(
      withdrawal,
    );
  }
}