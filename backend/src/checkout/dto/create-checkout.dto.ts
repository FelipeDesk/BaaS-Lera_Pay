import { ApiProperty } from '@nestjs/swagger';

import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

export class CreateCheckoutDto {
  @ApiProperty({
    example: 15000,
    description:
      'Valor da cobrança em centavos. 15000 = R$ 150,00',
  })
  @IsInt()
  @Min(1)
  amount: number;

  @ApiProperty({
    example: 'Pedido #123',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    enum: ['PIX', 'CREDIT_CARD'],
    example: 'PIX',
  })
  @IsIn([
    'PIX',
    'CREDIT_CARD',
  ])
  paymentMethod:
    | 'PIX'
    | 'CREDIT_CARD';
}