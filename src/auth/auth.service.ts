import { Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  async login(dto: LoginDto) {
    return 'This action logs in a user';
  }

  async register(dto: RegisterDto) {
    return 'This action registers a new user';
  }
}
