import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { WithdrawalsService } from './withdrawals.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Withdrawals')
@Controller('withdrawals')
export class WithdrawalsController {
  constructor(
    private readonly withdrawalsService:
      WithdrawalsService,
  ) {}

  @ApiBearerAuth()
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