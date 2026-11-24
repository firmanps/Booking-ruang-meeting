import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from '@repo/shared/schemas/auth.schema';
import type { Response } from 'express';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { ZodValidationPipe } from 'src/common/zod-validation.pipe';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('register')
  register(@Body(new ZodValidationPipe(registerSchema)) body: RegisterInput) {
    return this.authService.register(body);
  }

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('login')
  async login(
    @Body(new ZodValidationPipe(loginSchema)) body: LoginInput,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(body);
    response.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 1000,
      ...(process.env.COOKIE_DOMAIN
        ? { domain: process.env.COOKIE_DOMAIN }
        : {}),
    });
    return {
      message: 'Login berhasil',
      user: result.user,
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    };
    response.clearCookie('accessToken', cookieOptions);
    // Hapus juga cookie lama yang mungkin tersimpan dengan path default /auth.
    response.clearCookie('accessToken', { ...cookieOptions, path: '/auth' });
    return { message: 'Logout berhasil' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() request: Request & { user: { sub: string } }) {
    return this.authService.me(request.user.sub);
  }
}
