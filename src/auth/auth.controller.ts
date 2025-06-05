import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UserGuard } from './auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 200,
    description: 'Returns the authentication token',
    schema: {
      properties: {
        message: { example: 'Message show here' },
        error: { example: null },
        data: {
          properties: {
            token: { example: 'your.jwt.token.here' },
          },
        },
      },
    },
  })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiResponse({
    status: 201,
    description: 'Returns the registration confirmation',
    schema: {
      properties: {
        message: { example: 'Message show here' },
        error: { example: null },
        data: {
          properties: {
            token: { example: 'your.jwt.token.here' },
          },
        },
      },
    },
  })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiBearerAuth('Token')
  @ApiResponse({
    status: 200,
    description: 'Returns the user profile',
    schema: {
      properties: {
        message: { example: 'Message show here' },
        error: { example: null },
        data: {
          properties: {
            id: { example: 1 },
            username: { example: 'john_wick' },
            fullname: { example: 'John Wick' },
            address: { example: 'Jl. Soekarno Hatta No.1234' },
          },
        },
      },
    },
  })
  @UseGuards(UserGuard)
  @Get('profile')
  getProfile() {
    return this.authService.getProfile();
  }
}
