import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

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
      'https://seu-dominio.com/webhooks/lera-box/pix',
  })
  @IsUrl()
  url: string;

  @ApiPropertyOptional({
    example: 'meu-segredo-webhook',
  })
  @IsOptional()
  @IsString()
  secret?: string;
}