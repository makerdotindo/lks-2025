import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UserEntity } from '@/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly clsService: ClsService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { username: dto.username },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const token = this.generateToken(user);

    return {
      message: 'Login successful',
      error: null,
      data: {
        token,
      },
    };
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.userRepo.findOne({
      where: { username: dto.username },
    });

    if (existingUser) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newUser = this.userRepo.create({
      ...dto,
      password: hashedPassword,
    });

    await this.userRepo.save(newUser);

    const token = this.generateToken(newUser);

    return {
      message: 'User registered successfully',
      error: null,
      data: {
        token,
      },
    };
  }

  async getProfile() {
    const { id } = this.clsService.get<{ id: number }>('user');

    const user = await this.userRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return {
      message: `User with id ${id} found successfully`,
      error: null,
      data: user,
    };
  }

  private generateToken(user: UserEntity) {
    const payload = {
      id: user.id,
      username: user.username,
    };
    return this.jwtService.sign(payload);
  }
}
