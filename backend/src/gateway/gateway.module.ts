import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';

import { GatewayService } from './gateway.service';
import { GatewayAccount } from './entities/gateway-account.entity';
import { GatewayController } from './gateway.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([GatewayAccount]),
    UsersModule,
    AuthModule,
  ],
  providers: [GatewayService],
  exports: [GatewayService],
  controllers: [GatewayController],
})
export class GatewayModule {}