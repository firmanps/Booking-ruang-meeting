import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authorization = request.headers.authorization;

    const bearerToken = authorization?.startsWith('Bearer ')
      ? authorization.slice(7)
      : undefined;

    const cookieToken = request.headers.cookie
      ?.split(';')
      .map((item) => item.trim())
      .find((item) => item.startsWith('access_token='))
      ?.split('=')[1];

    const token = bearerToken || cookieToken;

    if (!token) {
      throw new UnauthorizedException('Belum login');
    }

    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
        role: 'EMPLOYEE' | 'ADMIN';
      }>(token);

      Object.assign(request, { user: payload });
      return true;
    } catch {
      throw new UnauthorizedException(
        'Token tidak valid atau sudah kedaluwarsa',
      );
    }
  }
}
