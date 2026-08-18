import { IsNotEmpty, IsString } from 'class-validator';

export class LoginGatewayDto {
  @IsNotEmpty()
  @IsString()
  document: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}