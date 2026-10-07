require('dotenv').config();
const app = require('./app');
const prisma = require('./config/db');

const PORT = process.env.PORT || 5000;

// Database connection check & Server Start
async function startServer() {
  try {
    // Database connection verification
    await prisma.$connect();
    console.log('✅ Database connected successfully via Prisma!');

    // Start Express Server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 PharmaPlus Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error.message);
    process.exit(1);
  }
}

startServer();