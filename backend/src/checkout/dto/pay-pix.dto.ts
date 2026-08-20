import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class PayPixDto {
  @ApiProperty({
    example: '12345678901',
    description: 'CPF ou CNPJ do pagador',
  })
  @IsNotEmpty()
  @IsString()
  payerDocument: string;
}