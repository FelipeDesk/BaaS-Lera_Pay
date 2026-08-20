import {
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

export class CreateWithdrawalDto {
  @IsInt()
  @Min(1)
  amount: number;

  @IsNotEmpty()
  @IsString()
  pixKey: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  document: string;
}