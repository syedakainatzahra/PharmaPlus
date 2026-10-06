const prisma = require('../config/db'); // Apni db config ka path check kar lein

const logAction = async (userId, action, details) => {
  try {
    await prisma.auditLog.create({
      data: { userId, action, details },
    });
  } catch (error) {
    console.error('Audit Log Error:', error);
  }
};

module.exports = { logAction };