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

async function main() {
  const passwordHash = await bcrypt.hash('admin@example.com', 12);

  await prisma.users.upsert({
    where: { email: 'admin@example.com' },
    update: { role: Role.ADMIN },
    create: {
      name: 'Administrator',
      email: 'admin@example.com',
      password: passwordHash,
      role: Role.ADMIN,
    },
  });

  for (const employee of [
    { name: 'Employee Satu', email: 'employee1@example.com' },
    { name: 'Employee Dua', email: 'employee2@example.com' },
  ]) {
    await prisma.users.upsert({
      where: { email: employee.email },
      update: { role: Role.EMPLOYEE },
      create: {
        name: employee.name,
        email: employee.email,
        password: passwordHash,
        role: Role.EMPLOYEE,
      },
    });
  }

  const rooms = [
    ['Meeting Room A', 4, 'Proyektor, Whiteboard', 'Lantai 1'],
    ['Meeting Room B', 6, 'Proyektor, Conference Phone', 'Lantai 2'],
    ['Meeting Room C', 8, 'Proyektor, TV, Whiteboard', 'Lantai 2'],
    ['Meeting Room D', 12, 'Video Conference, Projector', 'Lantai 3'],
    ['Meeting Room E', 20, 'Stage, Video Conference, Projector', 'Lantai 4'],
  ] as const;

  for (const [name, capacity, facilities, locations] of rooms) {
    await prisma.rooms.upsert({
      where: { id: name },
      update: { name, capacity, facilities, locations, is_active: true },
      create: { id: name, name, capacity, facilities, locations },
    });
  }

  console.log('Seed data berhasil');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
