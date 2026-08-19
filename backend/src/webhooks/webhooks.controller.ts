import {
  Controller,
  Headers,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';

import { Request } from 'express';

import { WebhooksService } from './webhooks.service';

@Controller('webhooks/lera-box')
export class WebhooksController {
  constructor(
    private readonly webhooksService: WebhooksService,
  ) {}

  @Post('pix')
  handlePix(
    @Req() req: Request & { rawBody?: Buffer },
    @Headers('x-lera-box-signature')
    signature?: string,
  ) {
    return this.webhooksService.processPix(
      req.body,
      req.rawBody,
      signature,
    );
  }

  @Post('card')
  handleCard(
    @Req() req: Request & { rawBody?: Buffer },
    @Headers('x-lera-box-signature')
    signature?: string,
  ) {
    return this.webhooksService.processCard(
      req.body,
      req.rawBody,
      signature,
    );
  }
}