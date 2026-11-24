// pnpm exec prisma db seed
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';
import { PrismaClient, Role } from '../src/generated/prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not configured');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const users = [
  {
    name: 'Administrator',
    email: 'admin@example.com',
    role: Role.ADMIN,
  },
  {
    name: 'Employee Satu',
    email: 'employee1@example.com',
    role: Role.EMPLOYEE,
  },
  {
    name: 'Employee Dua',
    email: 'employee2@example.com',
    role: Role.EMPLOYEE,
  },
] as const;

const rooms = [
  {
    name: 'Meeting Room A',
    capacity: 4,
    facilities: 'Proyektor, Whiteboard',
    locations: 'Lantai 1',
  },
  {
    name: 'Meeting Room B',
    capacity: 6,
    facilities: 'Proyektor, Conference Phone',
    locations: 'Lantai 2',
  },
  {
    name: 'Meeting Room C',
    capacity: 8,
    facilities: 'Proyektor, TV, Whiteboard',
    locations: 'Lantai 2',
  },
  {
    name: 'Meeting Room D',
    capacity: 12,
    facilities: 'Video Conference, Projector',
    locations: 'Lantai 3',
  },
  {
    name: 'Meeting Room E',
    capacity: 20,
    facilities: 'Stage, Video Conference, Projector',
    locations: 'Lantai 4',
  },
] as const;

async function main() {
  for (const user of users) {
    const password = await bcrypt.hash(user.email, 12);

    await prisma.users.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password,
        role: user.role,
      },
      create: {
        name: user.name,
        email: user.email,
        password,
        role: user.role,
      },
    });
  }

  const existingSeedRooms = await prisma.rooms.findMany({
    where: { name: { in: rooms.map((room) => room.name) } },
  });
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  for (const room of existingSeedRooms) {
    if (!uuidPattern.test(room.id)) {
      await prisma.rooms.delete({ where: { id: room.id } });
    }
  }

  for (const room of rooms) {
    const existingRoom = await prisma.rooms.findFirst({
      where: { name: room.name },
      orderBy: { createdAt: 'asc' },
    });

    if (existingRoom) {
      await prisma.rooms.update({
        where: { id: existingRoom.id },
        data: {
          capacity: room.capacity,
          facilities: room.facilities,
          locations: room.locations,
          isActive: true,
        },
      });
    } else {
      await prisma.rooms.create({
        data: {
          name: room.name,
          capacity: room.capacity,
          facilities: room.facilities,
          locations: room.locations,
          isActive: true,
        },
      });
    }
  }

  console.log('Seed data berhasil');
  console.log('Password akun sama dengan email akun:');
  for (const user of users) {
    console.log(`${user.email} / ${user.email}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
