import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UserGuard } from './auth.guard';
import { LoggerService } from '@/logger/logger.service';
import { Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly loggerService: LoggerService,
  ) {}

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
  login(@Req() req: Request, @Body() dto: LoginDto) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown User Agent';
    this.loggerService.log(
      `[IP: ${ip}] : [User Agent: ${userAgent}] : /auth/login : user login attempt with username: ${dto.username}`,
    );
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
  register(@Req() req: Request, @Body() dto: RegisterDto) {
    const Ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown User Agent';
    this.loggerService.log(
      `[IP: ${Ip}] : [User Agent: ${userAgent}] : /auth/register : user registration attempt with username: ${dto.username}`,
    );
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
  getProfile(@Req() req: Request) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown User Agent';
    this.loggerService.log(
      `[IP: ${ip}] : [User Agent: ${userAgent}] : /auth/profile : user profile request`,
    );
    return this.authService.getProfile();
  }
}
