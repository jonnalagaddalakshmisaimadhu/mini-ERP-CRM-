import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@minierp.com' },
    update: {},
    create: {
      email: 'admin@minierp.com',
      name: 'System Admin',
      passwordHash: adminPassword,
      role: 'ADMIN'
    }
  });

  const salesPassword = await bcrypt.hash('sales123', 10);
  await prisma.user.upsert({
    where: { email: 'sales@minierp.com' },
    update: {},
    create: {
      email: 'sales@minierp.com',
      name: 'Sales Rep',
      passwordHash: salesPassword,
      role: 'SALES'
    }
  });

  const whPassword = await bcrypt.hash('warehouse123', 10);
  await prisma.user.upsert({
    where: { email: 'warehouse@minierp.com' },
    update: {},
    create: {
      email: 'warehouse@minierp.com',
      name: 'Warehouse Manager',
      passwordHash: whPassword,
      role: 'WAREHOUSE'
    }
  });

  const accPassword = await bcrypt.hash('accounts123', 10);
  await prisma.user.upsert({
    where: { email: 'accounts@minierp.com' },
    update: {},
    create: {
      email: 'accounts@minierp.com',
      name: 'Accountant',
      passwordHash: accPassword,
      role: 'ACCOUNTS'
    }
  });

  console.log('Seeding complete. Admin user created: admin@minierp.com / admin123');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
