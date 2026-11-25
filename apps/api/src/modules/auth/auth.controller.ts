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

const COOKIE_NAME = 'accessToken';
const isProd = process.env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'lax' as const,
  path: '/',
  domain: isProd ? process.env.COOKIE_DOMAIN : undefined,
};

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
    const { accessToken, user } = await this.authService.login(body);
    response.cookie(COOKIE_NAME, accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 60 * 60 * 1000,
    });
    return {
      message: 'Login berhasil',
      user: user,
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);
    return { message: 'Logout berhasil' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() request: Request & { user: { sub: string } }) {
    return this.authService.me(request.user.sub);
  }
}
