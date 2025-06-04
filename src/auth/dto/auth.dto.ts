import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ type: 'string', example: 'john_wick' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ type: 'string', example: 'password1234' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterDto {
  @ApiProperty({ type: 'string', example: 'john_wick' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ type: 'string', example: 'John Wick' })
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @ApiProperty({ type: 'string', example: 'Jl. Soekarno Hatta No.1234' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ type: 'string', example: 'password1234' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    type: 'string',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT token for authenticated user',
  })
  token: string;
}

export class RegisterResponseDto {
  @ApiProperty({
    type: 'string',
    example: 'User registered successfully',
    description: 'Message indicating successful registration',
  })
  message: string;

  @ApiProperty({
    type: 'number',
    example: 1,
    description: 'ID of the newly registered user',
  })
  userId: number;
}
