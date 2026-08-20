import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export enum PersonType {
  PF = 'PF',
  PJ = 'PJ',
}

export class RegisterGatewayDto {
  @ApiProperty({
    enum: ['PF', 'PJ'],
    example: 'PF',
  })
  @IsNotEmpty()
  @IsString()
  personType: PersonType;

  @ApiProperty({
    example: 'Felipe Santiago',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'Felipe Santiago',
  })
  @IsOptional()
  @IsString()
  tradingName?: string;

  @ApiProperty({
    example: 'usuario@email.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '11999999999',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    example: '12345678901',
  })
  @IsNotEmpty()
  @IsString()
  document: string;

  @ApiProperty({
    example: '01001000',
  })
  @IsNotEmpty()
  @IsString()
  zipCode: string;

  @ApiProperty({
    example: 'Praça da Sé',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    example: '100',
  })
  @IsNotEmpty()
  @IsString()
  number: string;

  @ApiPropertyOptional({
    example: 'Apto 10',
  })
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiProperty({
    example: 'Sé',
  })
  @IsNotEmpty()
  @IsString()
  neighborhood: string;

  @ApiProperty({
    example: 'São Paulo',
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    example: 'SP',
  })
  @IsNotEmpty()
  @IsString()
  state: string;
}