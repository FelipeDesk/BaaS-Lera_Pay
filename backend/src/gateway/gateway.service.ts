import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { RegisterGatewayDto } from './dto/register-gateway.dto';
import { LoginGatewayDto } from './dto/login-gateway.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GatewayAccount } from './entities/gateway-account.entity';
import { UsersService } from '../users/users.service';
import { CreatePixDto } from './dto/create-pix.dto';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { CreateCardPaymentDto } from './dto/create-card-payment.dto';

@Injectable()
export class GatewayService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,

    @InjectRepository(GatewayAccount)
    private readonly gatewayAccountRepository: Repository<GatewayAccount>,
  ) {
    this.baseUrl =
      this.configService.get<string>('GATEWAY_BASE_URL') ?? '';
  }

  async register(data: RegisterGatewayDto) {
    const response = await firstValueFrom(
      this.httpService.post(
        `${this.baseUrl}/users`,
        data,
      ),
    );

    return response.data;
  }

  async login(data: LoginGatewayDto) {
    const response = await this.httpService.axiosRef.post(
      `${this.baseUrl}/auth/login`,
      data,
    );

    const gatewayData = response.data;

    const user = await this.usersService.findByEmail(
      gatewayData.user.email,
    );

    if (!user) {
      throw new UnauthorizedException(
        'Usuário não encontrado na aplicação BaaS',
      );
    }

    let gatewayAccount =
      await this.gatewayAccountRepository.findOne({
        where: {
          user: {
            id: user.id,
          },
        },
        relations: {
          user: true,
        },
      });

    if (!gatewayAccount) {
      gatewayAccount = this.gatewayAccountRepository.create({
        user,
        gatewayUserId: String(gatewayData.user.id),
        document: gatewayData.user.document,
        codigoCliente: gatewayData.codigoCliente,
        chaveLoja: gatewayData.chaveLoja,
        accessToken: gatewayData.access_token,
      });
    } else {
      gatewayAccount.gatewayUserId = String(
        gatewayData.user.id,
      );

      gatewayAccount.document =
        gatewayData.user.document;

      gatewayAccount.codigoCliente =
        gatewayData.codigoCliente;

      gatewayAccount.chaveLoja =
        gatewayData.chaveLoja;

      gatewayAccount.accessToken =
        gatewayData.access_token;
    }

    await this.gatewayAccountRepository.save(
      gatewayAccount,
    );

    return {
      message: 'Gateway autenticado com sucesso',
      gatewayConnected: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async getWallet(userId: number) {
    const gatewayAccount =
      await this.gatewayAccountRepository.findOne({
        where: {
          user: {
            id: userId,
          },
        },
        relations: {
          user: true,
        },
      });

    if (!gatewayAccount) {
      throw new UnauthorizedException(
        'Conta do gateway não encontrada para este usuário',
      );
    }

    const response = await this.httpService.axiosRef.get(
      `${this.baseUrl}/wallet`,
      {
        headers: {
          Authorization: `Bearer ${gatewayAccount.accessToken}`,
        },
      },
    );

    return response.data;
  }

  async getTransactions(
    userId: number,
    status?: string,
    type?: string,
    limit?: number,
  ) {
    const gatewayAccount =
      await this.gatewayAccountRepository.findOne({
        where: {
          user: {
            id: userId,
          },
        },
        relations: {
          user: true,
        },
      });

    if (!gatewayAccount) {
      throw new UnauthorizedException(
        'Conta do gateway não encontrada para este usuário',
      );
    }

    const response = await this.httpService.axiosRef.get(
      `${this.baseUrl}/wallet/transactions`,
      {
        headers: {
          Authorization: `Bearer ${gatewayAccount.accessToken}`,
        },
        params: {
          status,
          type,
          limit,
        },
      },
    );

    return response.data;
  }

  async createPix(
    userId: number,
    data: CreatePixDto,
  ) {
    const gatewayAccount =
      await this.gatewayAccountRepository.findOne({
        where: {
          user: {
            id: userId,
          },
        },
        relations: {
          user: true,
        },
      });

    if (!gatewayAccount) {
      throw new UnauthorizedException(
        'Conta do gateway não encontrada para este usuário',
      );
    }

    const response = await this.httpService.axiosRef.post(
      `${this.baseUrl}/payments/pix`,
      data,
      {
        headers: {
          Authorization: `Bearer ${gatewayAccount.accessToken}`,
        },
      },
    );

    return response.data;
  }

  async createWebhook(
    userId: number,
    data: CreateWebhookDto,
  ) {
    const gatewayAccount =
      await this.gatewayAccountRepository.findOne({
        where: {
          user: {
            id: userId,
          },
        },
        relations: {
          user: true,
        },
      });

    if (!gatewayAccount) {
      throw new UnauthorizedException(
        'Conta do gateway não encontrada para este usuário',
      );
    }

    const response =
      await this.httpService.axiosRef.post(
        `${this.baseUrl}/webhooks`,
        data,
        {
          headers: {
            Authorization:
              `Bearer ${gatewayAccount.accessToken}`,
          },
        },
      );

    return response.data;
  }

  async getFees(brand?: string) {
    const response = await this.httpService.axiosRef.get(
      `${this.baseUrl}/fees`,
      {
        params: {
          brand,
        },
      },
    );

    return response.data;
  }

  private detectCardBrand(
    cardNumber: string,
  ): 'VISA' | 'MASTERCARD' | 'ELO' {
    const number = cardNumber.replace(/\D/g, '');

    if (number.startsWith('4')) {
      return 'VISA';
    }

    const firstTwo = Number(number.slice(0, 2));

    if (firstTwo >= 51 && firstTwo <= 55) {
      return 'MASTERCARD';
    }

    return 'ELO';
  }

  private async getFeeForInstallments(
    brand: 'VISA' | 'MASTERCARD' | 'ELO',
    installments: number,
  ) {
    const feesResponse =
      await this.getFees(brand);

    const fee = feesResponse.fees.find(
      (item: any) =>
        item.installments === installments,
    );

    if (!fee) {
      throw new Error(
        'Taxa não encontrada para essa bandeira e quantidade de parcelas',
      );
    }

    return fee;
  }

  async createCardPayment(
    userId: number,
    data: CreateCardPaymentDto,
  ) {
    const gatewayAccount =
      await this.gatewayAccountRepository.findOne({
        where: {
          user: {
            id: userId,
          },
        },
        relations: {
          user: true,
        },
      });

    if (!gatewayAccount) {
      throw new UnauthorizedException(
        'Conta do gateway não encontrada para este usuário',
      );
    }

    const brand =
      this.detectCardBrand(data.cardNumber);

    const fee =
      await this.getFeeForInstallments(
        brand,
        data.installments,
      );

    const response =
      await this.httpService.axiosRef.post(
        `${this.baseUrl}/payments/card`,
        {
          amount: data.amount,
          description: data.description,
          externalReference:
            data.externalReference,

          cardNumber: data.cardNumber,
          cardHolder: data.cardHolder,
          expiryMonth: data.expiryMonth,
          expiryYear: data.expiryYear,
          cvv: data.cvv,

          installments: data.installments,

          feePercent: fee.feePercent,
        },
        {
          headers: {
            Authorization:
              `Bearer ${gatewayAccount.accessToken}`,
          },
        },
      );

    return response.data;
  }

  async createWithdrawal(
    userId: number,
    data: {
      amount: number;
      pixKey: string;
      description: string;
      externalReference: string;
      document: string;
    },
  ) {
    const gatewayAccount =
      await this.gatewayAccountRepository.findOne({
        where: {
          user: {
            id: userId,
          },
        },
        relations: {
          user: true,
        },
      });

    if (!gatewayAccount) {
      throw new UnauthorizedException(
        'Conta do gateway não encontrada para este usuário',
      );
    }

    const response =
      await this.httpService.axiosRef.post(
        `${this.baseUrl}/withdrawals`,
        data,
        {
          headers: {
            Authorization:
              `Bearer ${gatewayAccount.accessToken}`,
          },
        },
      );

    return response.data;
  }

  async getWithdrawal(
    userId: number,
    withdrawalId: string,
  ) {
    const gatewayAccount =
      await this.gatewayAccountRepository.findOne({
        where: {
          user: {
            id: userId,
          },
        },
      });

    if (!gatewayAccount) {
      throw new UnauthorizedException(
        'Conta do gateway não encontrada',
      );
    }

    const response =
      await this.httpService.axiosRef.get(
        `${this.baseUrl}/withdrawals/${withdrawalId}`,
        {
          headers: {
            Authorization:
              `Bearer ${gatewayAccount.accessToken}`,
          },
        },
      );

    return response.data;
  }
}