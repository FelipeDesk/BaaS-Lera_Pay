import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateCardPaymentDto {
  @IsInt()
  @Min(1)
  amount: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  externalReference: string;

  @IsNotEmpty()
  @IsString()
  cardNumber: string;

  @IsNotEmpty()
  @IsString()
  cardHolder: string;

  @IsNotEmpty()
  @IsString()
  expiryMonth: string;

  @IsNotEmpty()
  @IsString()
  expiryYear: string;

  @IsNotEmpty()
  @IsString()
  cvv: string;

  @IsInt()
  @Min(1)
  @Max(21)
  installments: number;
}