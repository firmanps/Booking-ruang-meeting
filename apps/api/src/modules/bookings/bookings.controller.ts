import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  createBookingSchema,
  type CreateBookingInput,
} from '@repo/shared/schemas/bookings.schema';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { Roles } from 'src/common/roles.decorator';
import { RolesGuard } from 'src/common/roles.guard';
import { ZodValidationPipe } from 'src/common/zod-validation.pipe';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EMPLOYEE')
  @Post()
  create(
    @Req() request: Request & { user: { sub: string } },
    @Body(new ZodValidationPipe(createBookingSchema))
    body: CreateBookingInput,
  ) {
    return this.bookingsService.create(request.user.sub, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  getAllBookings() {
    return this.bookingsService.getAllBookings();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  cancel(
    @Param('id') id: string,
    @Req()
    request: Request & { user: { sub: string; role: 'EMPLOYEE' | 'ADMIN' } },
  ) {
    return this.bookingsService.cancel(id, request.user.sub, request.user.role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EMPLOYEE')
  @Get('me')
  getMyBookings(@Req() request: Request & { user: { sub: string } }) {
    return this.bookingsService.getMyBookings(request.user.sub);
  }
}
