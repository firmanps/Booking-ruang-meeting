import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { CreateBookingInput } from '@repo/shared/schemas/bookings.schema';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllBookings() {
    const bookings = await this.prisma.bookings.findMany({
      orderBy: { start_at: 'asc' },
      select: {
        id: true,
        title: true,
        start_at: true,
        end_at: true,
        status: true,
        cancelled_at: true,
        cancelled_by: true,
        created_at: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        rooms: {
          select: {
            id: true,
            name: true,
            capacity: true,
            locations: true,
          },
        },
      },
    });

    return { bookings };
  }

  async getMyBookings(userId: string) {
    const bookings = await this.prisma.bookings.findMany({
      where: { user_id: userId },
      orderBy: { start_at: 'asc' },
      select: {
        id: true,
        title: true,
        start_at: true,
        end_at: true,
        status: true,
        cancelled_at: true,
        cancelled_by: true,
        created_at: true,
        rooms: {
          select: {
            id: true,
            name: true,
            capacity: true,
            locations: true,
          },
        },
      },
    });

    return { bookings };
  }

  async cancel(bookingId: string, userId: string, role: 'EMPLOYEE' | 'ADMIN') {
    const booking = await this.prisma.bookings.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        user_id: true,
        status: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking tidak ditemukan');
    }

    if (role !== 'ADMIN' && booking.user_id !== userId) {
      throw new ForbiddenException('Anda tidak boleh membatalkan booking ini');
    }

    if (booking.status === 'CANCELLED') {
      throw new BadRequestException('Booking sudah dibatalkan');
    }

    const cancelled = await this.prisma.bookings.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
        cancelled_at: new Date(),
        cancelled_by: userId,
      },
      select: {
        id: true,
        title: true,
        status: true,
        cancelled_at: true,
        cancelled_by: true,
      },
    });

    return {
      message: 'Booking berhasil dibatalkan',
      booking: cancelled,
    };
  }

  async create(userId: string, data: CreateBookingInput) {
    const startAt = new Date(data.startAt);
    const endAt = new Date(data.endAt);

    if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
      throw new BadRequestException('Format waktu tidak valid');
    }

    if (endAt <= startAt) {
      throw new BadRequestException('endAt harus setelah startAt');
    }

    const durationMinutes = (endAt.getTime() - startAt.getTime()) / 60_000;
    if (durationMinutes < 30 || durationMinutes > 240) {
      throw new BadRequestException(
        'Durasi booking harus 30 menit sampai 4 jam',
      );
    }

    if (startAt <= new Date()) {
      throw new BadRequestException('Booking tidak boleh dibuat di masa lalu');
    }

    const startJakarta = new Date(startAt.getTime() + 7 * 60 * 60 * 1000);
    const endJakarta = new Date(endAt.getTime() + 7 * 60 * 60 * 1000);

    const startMinutes =
      startJakarta.getUTCHours() * 60 + startJakarta.getUTCMinutes();
    const endMinutes =
      endJakarta.getUTCHours() * 60 + endJakarta.getUTCMinutes();

    if (
      startMinutes < 8 * 60 ||
      endMinutes > 18 * 60 ||
      startJakarta.toISOString().slice(0, 10) !==
        endJakarta.toISOString().slice(0, 10)
    ) {
      throw new BadRequestException(
        'Booking harus di dalam jam kerja 08.00-18.00',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(
        'SELECT pg_advisory_xact_lock(hashtext($1))',
        data.roomId,
      );

      const room = await tx.rooms.findUnique({
        where: { id: data.roomId },
        select: { id: true, is_active: true },
      });

      if (!room) {
        throw new NotFoundException('Ruangan tidak ditemukan');
      }

      if (!room.is_active) {
        throw new BadRequestException('Ruangan tidak aktif');
      }

      const overlap = await tx.bookings.findFirst({
        where: {
          room_id: data.roomId,
          status: 'CONFIRMED',
          start_at: { lt: endAt },
          end_at: { gt: startAt },
        },
        select: { id: true },
      });

      if (overlap) {
        throw new ConflictException(
          'Waktu booking bentrok dengan booking lain',
        );
      }

      return tx.bookings.create({
        data: {
          room_id: data.roomId,
          user_id: userId,
          title: data.title,
          start_at: startAt,
          end_at: endAt,
          status: 'CONFIRMED',
        },
        select: {
          id: true,
          room_id: true,
          user_id: true,
          title: true,
          start_at: true,
          end_at: true,
          status: true,
          created_at: true,
        },
      });
    });
  }
}
