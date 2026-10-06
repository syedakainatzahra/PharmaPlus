const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Baaki ka code wahi rahega...

// Get Warehouse Medicines and Products Inventory
const getWarehouseInventory = async (req, res) => {
  try {
    const medicines = await prisma.medicine.findMany({
      include: { branch: true }
    });
    
    const products = await prisma.product.findMany({
      include: { branch: true, category: true }
    });

    res.status(200).json({
      success: true,
      totalMedicines: medicines.length,
      totalProducts: products.length,
      medicines,
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Warehouse Workers Details
const getWarehouseWorkers = async (req, res) => {
  try {
    const workers = await prisma.warehouseEmployee.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            status: true,
            employeeId: true
          }
        },
        warehouse: true
      }
    });

    res.status(200).json({
      success: true,
      count: workers.length,
      workers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Assign/Add Warehouse Worker
const addWarehouseWorker = async (req, res) => {
  try {
    const { userId, warehouseId, position } = req.body;

    const newWorker = await prisma.warehouseEmployee.create({
      data: {
        userId,
        warehouseId,
        position
      },
      include: {
        user: true,
        warehouse: true
      }
    });

    res.status(201).json({
      success: true,
      worker: newWorker
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getWarehouseInventory,
  getWarehouseWorkers,
  addWarehouseWorker
};