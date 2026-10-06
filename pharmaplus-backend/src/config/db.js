const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client'); // 👈 Standard Prisma Client Import

require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

module.exports = prisma;