import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

export class CreateCheckoutDto {
  @IsInt()
  @Min(1)
  amount: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsIn(['PIX', 'CREDIT_CARD'])
  paymentMethod: 'PIX' | 'CREDIT_CARD';
}