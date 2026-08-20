import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class PayCardDto {
  @ApiProperty({
    example: '4111111111111111',
  })
  @IsString()
  @IsNotEmpty()
  cardNumber: string;

  @ApiProperty({
    example: 'MARIA SILVA',
  })
  @IsString()
  @IsNotEmpty()
  cardHolder: string;

  @ApiProperty({
    example: '12',
  })
  @IsString()
  @IsNotEmpty()
  expiryMonth: string;

  @ApiProperty({
    example: '2030',
  })
  @IsString()
  @IsNotEmpty()
  expiryYear: string;

  @ApiProperty({
    example: '123',
  })
  @IsString()
  @IsNotEmpty()
  cvv: string;

  @ApiProperty({
    example: 3,
    minimum: 1,
    maximum: 21,
  })
  @IsInt()
  @Min(1)
  @Max(21)
  installments: number;
}