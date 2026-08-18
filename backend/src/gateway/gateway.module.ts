import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GatewayService } from './gateway.service';
import { GatewayAccount } from './entities/gateway-account.entity';
import { GatewayController } from './gateway.controller';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([GatewayAccount]),
  ],
  providers: [GatewayService],
  exports: [GatewayService],
  controllers: [GatewayController],
})
export class GatewayModule {}