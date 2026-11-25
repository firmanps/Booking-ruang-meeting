//pnpm test -- bookings_concurrency.spec.ts
import { ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import 'dotenv/config';
import { PrismaService } from 'src/common/prisma.service';
import { BookingsService } from './bookings.service';

jest.mock('@nestjs/config', () => ({
  ConfigService: class ConfigServiceMock {
    getOrThrow(key: string) {
      const value = process.env[key];
      if (!value) throw new Error(`Missing test environment variable: ${key}`);
      return value;
    }
  },
}));

const CONCURRENCY = 20;

function futureSlot() {
  const start = new Date();
  start.setUTCDate(start.getUTCDate() + 7);
  start.setUTCHours(9 - 7, 0, 0, 0);

  const end = new Date(start.getTime() + 60 * 60 * 1000);

  return { startAt: start.toISOString(), endAt: end.toISOString() };
}

describe('BookingsService.create - booking concurrency integration', () => {
  let moduleRef: TestingModule;
  let prisma: PrismaService;
  let service: BookingsService;
  let userId: string;
  let roomId: string;

  beforeAll(async () => {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL belum diset untuk database test');
    }

    moduleRef = await Test.createTestingModule({
      providers: [
        BookingsService,
        PrismaService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: (key: string) => {
              const value = process.env[key];
              if (!value) {
                throw new Error(`Missing test environment variable: ${key}`);
              }
              return value;
            },
          },
        },
      ],
    }).compile();

    await moduleRef.init();

    prisma = moduleRef.get(PrismaService);
    service = moduleRef.get(BookingsService);

    const user = await prisma.users.create({
      data: {
        name: 'Concurrency Test Employee',
        email: `concurrency-${Date.now()}@test.local`,
        password: 'test-password',
        role: 'EMPLOYEE',
      },
      select: { id: true },
    });

    const room = await prisma.rooms.create({
      data: {
        name: `Concurrency Room ${Date.now()}`,
        capacity: 10,
        facilities: 'Projector, Whiteboard',
        locations: 'Test Floor',
        isActive: true,
      },
      select: { id: true },
    });

    userId = user.id;
    roomId = room.id;
  });

  afterAll(async () => {
    await prisma.bookings.deleteMany({ where: { roomId: roomId } });
    await prisma.rooms.delete({ where: { id: roomId } }).catch(() => undefined);
    await prisma.users.delete({ where: { id: userId } }).catch(() => undefined);
    await moduleRef.close();
  });

  it(`hanya satu dari ${CONCURRENCY} request bersamaan yang berhasil`, async () => {
    await prisma.bookings.deleteMany({
      where: { roomId: roomId },
    });

    const { startAt, endAt } = futureSlot();

    const results = await Promise.allSettled(
      Array.from({ length: CONCURRENCY }, (_, index) =>
        service.create(userId, {
          roomId,
          title: `Concurrent Test ${index + 1}`,
          startAt,
          endAt,
        }),
      ),
    );

    const successful = results.filter(
      (result) => result.status === 'fulfilled',
    );
    const failed = results.filter(
      (result): result is PromiseRejectedResult => result.status === 'rejected',
    );

    expect(successful).toHaveLength(1);
    expect(failed).toHaveLength(CONCURRENCY - 1);

    for (const result of failed) {
      expect(result.reason).toBeInstanceOf(ConflictException);
    }

    const confirmedCount = await prisma.bookings.count({
      where: {
        roomId: roomId,
        status: 'CONFIRMED',
        startAt: new Date(startAt),
        endAt: new Date(endAt),
      },
    });

    expect(confirmedCount).toBe(1);
  });
});
