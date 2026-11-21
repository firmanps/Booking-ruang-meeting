import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  CreateRoomInput,
  RoomsQueryInput,
  UpdateRoomInput,
} from '@repo/shared/schemas/rooms.schema';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async addRoom(data: CreateRoomInput) {
    const room = await this.prisma.rooms.create({
      data,
      select: {
        id: true,
        name: true,
        capacity: true,
        facilities: true,
        locations: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    return {
      message: 'Ruangan berhasil ditambahkan',
      room,
    };
  }

  async updateRoom(id: string, data: UpdateRoomInput, adminId: string) {
    const existingRoom = await this.prisma.rooms.findUnique({
      where: { id },
    });

    if (!existingRoom) {
      throw new NotFoundException('Ruangan tidak ditemukan');
    }

    return this.prisma.$transaction(async (tx) => {
      const room = await tx.rooms.update({
        where: { id },
        data,
        select: {
          id: true,
          name: true,
          capacity: true,
          facilities: true,
          locations: true,
          is_active: true,
          created_at: true,
          updated_at: true,
        },
      });

      let cancelledBookingsCount = 0;

      if (data.is_active === false) {
        const now = new Date();

        const cancelled = await tx.bookings.updateMany({
          where: {
            room_id: id,
            status: 'CONFIRMED',
            end_at: { gt: now },
          },
          data: {
            status: 'CANCELLED',
            cancelled_at: now,
            cancelled_by: adminId,
          },
        });

        cancelledBookingsCount = cancelled.count;
      }

      return {
        message:
          cancelledBookingsCount > 0
            ? `Ruangan berhasil diperbarui dan ${cancelledBookingsCount} booking dibatalkan`
            : 'Ruangan berhasil diperbarui',
        room,
        cancelled_bookings_count: cancelledBookingsCount,
      };
    });
  }

  async getRooms(query: RoomsQueryInput) {
    const rooms = await this.prisma.rooms.findMany({
      where: {
        ...(query.is_active !== undefined
          ? { is_active: query.is_active }
          : {}),
        ...(query.minCapacity ? { capacity: { gte: query.minCapacity } } : {}),
      },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        capacity: true,
        facilities: true,
        locations: true,
        is_active: true,
      },
    });

    return { rooms };
  }

  async getRoomById(id: string) {
    const room = await this.prisma.rooms.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        capacity: true,
        facilities: true,
        locations: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!room) {
      throw new NotFoundException('Ruangan tidak ditemukan');
    }

    return { room };
  }

  async getRoomAvailability(id: string, date: string) {
    const [year, month, day] = date.split('-').map(Number);
    const validDate = new Date(Date.UTC(year, month - 1, day));

    if (
      validDate.getUTCFullYear() !== year ||
      validDate.getUTCMonth() !== month - 1 ||
      validDate.getUTCDate() !== day
    ) {
      throw new BadRequestException('Tanggal tidak valid');
    }

    const room = await this.prisma.rooms.findFirst({
      where: { id, is_active: true },
      select: {
        id: true,
        name: true,
        capacity: true,
        facilities: true,
        locations: true,
        is_active: true,
      },
    });

    if (!room) {
      throw new NotFoundException('Ruangan tidak ditemukan');
    }

    const start = new Date(`${date}T00:00:00+07:00`);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const bookings = await this.prisma.bookings.findMany({
      where: {
        room_id: id,
        status: 'CONFIRMED',
        start_at: { lt: end },
        end_at: { gt: start },
      },
      orderBy: { start_at: 'asc' },
      select: {
        id: true,
        title: true,
        start_at: true,
        end_at: true,
      },
    });

    return {
      room,
      date,
      timezone: 'Asia/Jakarta',
      bookings,
    };
  }

  async deleteRoom(id: string) {
    const room = await this.prisma.rooms.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!room) {
      throw new NotFoundException('Ruangan tidak ditemukan');
    }

    await this.prisma.rooms.delete({
      where: { id: room.id },
    });

    return {
      message: 'Ruangan berhasil dihapus',
    };
  }
}
