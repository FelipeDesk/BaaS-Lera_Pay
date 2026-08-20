import { ApiProperty } from '@nestjs/swagger';

import {
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

export class CreateWithdrawalDto {
  @ApiProperty({
    example: 10000,
    description:
      'Valor em centavos. 10000 = R$ 100,00',
  })
  @IsInt()
  @Min(1)
  amount: number;

  @ApiProperty({
    example:
      '00020126580014br.gov.bcb.pix...',
  })
  @IsNotEmpty()
  @IsString()
  pixKey: string;

  @ApiProperty({
    example: 'Saque para conta pessoal',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: '12345678901',
  })
  @IsNotEmpty()
  @IsString()
  document: string;
}