import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PrismaService } from './prisma.service';
import { RolesGuard } from './roles.guard';
import { ZodValidationPipe } from './zod-validation.pipe';

@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: (config.get<string>('JWT_EXPIRES_IN') ||
            '1h') as NonNullable<JwtModuleOptions['signOptions']>['expiresIn'],
        },
      }),
    }),
  ],
  providers: [ZodValidationPipe, JwtAuthGuard, PrismaService, RolesGuard],
  exports: [
    JwtModule,
    ZodValidationPipe,
    JwtAuthGuard,
    PrismaService,
    RolesGuard,
  ],
})
export class CommonModule {}
