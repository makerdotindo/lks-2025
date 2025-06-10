import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';

@Injectable()
export class APIGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const adminPassword = request.headers['x-api-key'];
    const adminPasswordEnv = this.configService.getOrThrow<string>('API_KEY');

    if (adminPassword && adminPassword === adminPasswordEnv) {
      return true;
    } else {
      throw new UnauthorizedException({
        message: 'Access denied',
        error: 'Unauthorized',
        data: null,
      });
    }
  }
}

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly clsService: ClsService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException({
        message: 'Invalid or missing token',
        error: 'Unauthorized',
        data: null,
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify<{ id: number; username: string }>(
        token,
      );
      this.clsService.set('user', decoded);
      return true;
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Invalid or expired token',
        error: 'Unauthorized',
        data: null,
      });
    }
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const adminPassword = request.headers['x-admin-password'];
    const adminPasswordEnv =
      this.configService.getOrThrow<string>('API_ADMIN_PASSWORD');

    if (adminPassword && adminPassword === adminPasswordEnv) {
      return true;
    } else {
      throw new UnauthorizedException({
        message: 'Admin access denied',
        error: 'Unauthorized',
        data: null,
      });
    }
  }
}
