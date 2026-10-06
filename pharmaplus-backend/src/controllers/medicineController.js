const prisma = require('../config/db');

// 1. Add New Medicine (Pharmacist / Admin)
const addMedicine = async (req, res) => {
  try {
    const { name, brand, category, price, stock, description } = req.body;

    const medicine = await prisma.medicine.create({
      data: {
        name,
        brand,
        category,
        price: parseFloat(price),
        stock: parseInt(stock),
        description,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Medicine added successfully!',
      medicine,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get All Medicines
const getAllMedicines = async (req, res) => {
  try {
    const medicines = await prisma.medicine.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, count: medicines.length, medicines });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Get Single Medicine by ID
const getMedicineById = async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await prisma.medicine.findUnique({ where: { id } });

    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    res.status(200).json({ success: true, medicine });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Update Medicine (Pharmacist / Admin)
const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, brand, category, price, stock, description } = req.body;

    const existingMedicine = await prisma.medicine.findUnique({ where: { id } });
    if (!existingMedicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    const updatedMedicine = await prisma.medicine.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(brand && { brand }),
        ...(category && { category }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(description && { description }),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Medicine updated successfully!',
      medicine: updatedMedicine,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Delete Medicine (Admin / Super Admin only)
const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    const existingMedicine = await prisma.medicine.findUnique({ where: { id } });
    if (!existingMedicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    await prisma.medicine.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Medicine deleted successfully!',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
};