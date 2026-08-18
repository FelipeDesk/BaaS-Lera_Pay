import {
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

export class CreatePixDto {
  @IsInt()
  @Min(1)
  amount: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  payerDocument: string;

  @IsNotEmpty()
  @IsString()
  externalReference: string;
}