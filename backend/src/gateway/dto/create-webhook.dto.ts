import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateWebhookDto {
  @IsIn([
    'PAYMENT_PIX',
    'PAYMENT_CARD',
    'WITHDRAWAL',
  ])
  event:
    | 'PAYMENT_PIX'
    | 'PAYMENT_CARD'
    | 'WITHDRAWAL';

  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  secret?: string;
}