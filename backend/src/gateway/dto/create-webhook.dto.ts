import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsUrl,
} from 'class-validator';

export class CreateWebhookDto {
  @ApiProperty({
    enum: [
      'PAYMENT_PIX',
      'PAYMENT_CARD',
      'WITHDRAWAL',
    ],
    example: 'PAYMENT_PIX',
  })
  @IsIn([
    'PAYMENT_PIX',
    'PAYMENT_CARD',
    'WITHDRAWAL',
  ])
  event:
    | 'PAYMENT_PIX'
    | 'PAYMENT_CARD'
    | 'WITHDRAWAL';

  @ApiProperty({
    example:
      'https://baas-lerapay-production.up.railway.app/webhooks/lera-box/pix',
  })
  @IsUrl()
  url: string;
}