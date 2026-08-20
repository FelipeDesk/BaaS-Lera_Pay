import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { WithdrawalsService } from './withdrawals.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';

@Controller('withdrawals')
export class WithdrawalsController {
  constructor(
    private readonly withdrawalsService:
      WithdrawalsService,
  ) {}

  @Post(':userId')
  create(
    @Param('userId', ParseIntPipe)
    userId: number,

    @Body()
    createWithdrawalDto: CreateWithdrawalDto,
  ) {
    return this.withdrawalsService.create(
      userId,
      createWithdrawalDto,
    );
  }
}