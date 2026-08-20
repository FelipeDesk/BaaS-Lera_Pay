import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginGatewayDto {
  @ApiProperty({
    example: '12345678901',
    description: 'CPF ou CNPJ da conta cadastrada no gateway',
  })
  @IsNotEmpty()
  @IsString()
  document: string;

  @ApiProperty({
    example: 'senha-recebida-do-gateway',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}