import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';

import { WithdrawalsService } from './withdrawals.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
    @Post()
    createAuthenticated(
    @Req() req: any,
    @Body() createWithdrawalDto: CreateWithdrawalDto,
    ) {
    return this.withdrawalsService.create(
        req.user.sub,
        createWithdrawalDto,
    );
  }
}