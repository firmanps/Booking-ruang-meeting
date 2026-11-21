import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
