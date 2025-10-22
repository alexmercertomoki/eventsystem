import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 创建超级管理员
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const superAdmin = await prisma.admin.upsert({
    where: { email: 'admin@eventsystem.com' },
    update: {},
    create: {
      email: 'admin@eventsystem.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  console.log('✅ Super admin created:', {
    email: superAdmin.email,
    name: superAdmin.name,
    role: superAdmin.role,
  });

  console.log('\n📝 Login credentials:');
  console.log('Email: admin@eventsystem.com');
  console.log('Password: admin123');
  console.log('\n🌱 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
