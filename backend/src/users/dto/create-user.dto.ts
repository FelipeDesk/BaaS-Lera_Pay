import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Felipe Santiago',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'usuario@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '12345678',
    minLength: 8,
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}