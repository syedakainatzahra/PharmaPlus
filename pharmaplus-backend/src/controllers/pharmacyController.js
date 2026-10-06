const prisma = require('../config/db');

// 1. Get All Medicines & Inventory Stats
const getInventory = async (req, res) => {
  try {
    const medicines = await prisma.medicine.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const totalMedicines = medicines.length;
    const lowStockCount = medicines.filter((m) => m.stock < 10).length;

    res.status(200).json({
      success: true,
      stats: { totalMedicines, lowStockCount },
      medicines,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Add New Medicine to Inventory
const addMedicine = async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;

    const newMedicine = await prisma.medicine.create({
      data: {
        name,
        category,
        price: parseFloat(price),
        stock: parseInt(stock),
      },
    });

    res.status(201).json({
      success: true,
      message: 'Medicine inventory mein add ho gayi!',
      medicine: newMedicine,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Update Medicine Stock
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    const updated = await prisma.medicine.update({
      where: { id },
      data: { stock: parseInt(stock) },
    });

    res.status(200).json({
      success: true,
      message: 'Stock update ho gaya!',
      medicine: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getInventory, addMedicine, updateStock };