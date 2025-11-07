import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH || undefined });

const prisma = new PrismaClient();

async function main() {
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin123!';
  const demoPassword = process.env.SEED_DEMO_PASSWORD || 'Demo123!';

  const adminHash = await bcrypt.hash(adminPassword, 10);
  const demoHash = await bcrypt.hash(demoPassword, 10);

  await prisma.user.upsert({
    where: { email: 'admin@rotaperfeita.com' },
    update: { isActive: true, role: Role.ADMIN },
    create: {
      name: 'Admin',
      email: 'admin@rotaperfeita.com',
      passwordHash: adminHash,
      role: Role.ADMIN
    }
  });

  await prisma.user.upsert({
    where: { email: 'demo@rotaperfeita.com' },
    update: { isActive: true },
    create: {
      name: 'Usuário Demo',
      email: 'demo@rotaperfeita.com',
      passwordHash: demoHash,
      role: Role.USER
    }
  });

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
