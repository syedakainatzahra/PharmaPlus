const prisma = require('../config/db');

// Get Single Branch Overview / Stats
const getBranchStats = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user || !user.branchId) {
      return res.status(400).json({ success: false, message: 'Aap kisi branch se linked nahi hain!' });
    }

    const branchId = user.branchId;

    const [branchDetails, doctorsCount, pharmacistsCount, totalPrescriptions, totalMedicines] = await Promise.all([
      prisma.branch.findUnique({ where: { id: branchId } }),
      prisma.user.count({ where: { branchId, role: 'DOCTOR' } }),
      prisma.user.count({ where: { branchId, role: 'PHARMACIST' } }),
      prisma.prescription.count({ where: { branchId } }),
      prisma.medicine.count({ where: { branchId } })
    ]);

    return res.status(200).json({
      success: true,
      branch: branchDetails,
      stats: {
        doctorsCount,
        pharmacistsCount,
        totalPrescriptions,
        totalMedicines
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Staff Members of Branch
const getBranchStaff = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user || !user.branchId) {
      return res.status(400).json({ success: false, message: 'Aap kisi branch se linked nahi hain!' });
    }

    const staff = await prisma.user.findMany({
      where: { branchId: user.branchId },
      select: {
  id: true,
  fullName: true,
  email: true,
  phone: true,
  employeeId: true,
  role: true,
  status: true,
  createdAt: true
}
    });

    return res.status(200).json({ success: true, count: staff.length, staff });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBranchStats,
  getBranchStaff
};