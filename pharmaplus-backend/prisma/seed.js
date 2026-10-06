const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding real branch locations...');

  const branches = [
    {
      name: 'PharmaPlus ',
      code: 'ISB-01',
      location: 'Jinnah Avenue, Blue Area, Islamabad',
      phone: '+92-42-35876543',
      isActive: true,
      status: 'ACTIVE'
    },
    {
      name: 'PharmaPlus ',
      code: 'ISB-02',
      location: 'G-11 Markaz, Islamabad',
      phone: '+92-42-37123456',
      isActive: true,
      status: 'ACTIVE'
    },
    {
      name: 'PharmaPlus ',
      code: 'ISB-03',
      location: 'F-6/2, Islamabad',
      phone: '+92-51-2828282',
      isActive: true,
      status: 'ACTIVE'
    },
    {
      name: 'PharmaPlus ',
      code: 'ISB-04',
      location: 'Bahria Town, Islamabad',
      phone: '+92-51-5551234',
      isActive: true,
      status: 'ACTIVE'
    }
  ];

  for (const branch of branches) {
    await prisma.branch.upsert({
      where: { code: branch.code },
      update: {},
      create: branch
    });
  }

  console.log('✅ Real branch locations successfully seeded!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });