const prisma = require('../config/db');

// 1. Create New Branch
const createBranch = async (req, res) => {
  try {
    const { name, code, location, phone } = req.body;

    if (!name || !location) {
      return res.status(400).json({ success: false, message: 'Branch Name aur Location zaroori hain!' });
    }

    const existingBranch = await prisma.branch.findFirst({
      where: {
        OR: [
          { name },
          code ? { code } : undefined
        ].filter(Boolean)
      }
    });

    if (existingBranch) {
      return res.status(400).json({ success: false, message: 'Is Name ya Code se branch pehle se bani hui hai!' });
    }

    const branch = await prisma.branch.create({
      data: { name, code: code || null, location, phone: phone || null }
    });

    return res.status(201).json({ success: true, message: 'Branch successfully create ho gayi! 🏢', branch });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get All Branches (With User & Prescription Stats)
const getAllBranches = async (req, res) => {
  try {
    const branches = await prisma.branch.findMany({
      include: {
        _count: {
          select: {
            users: true,
            prescriptions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ success: true, count: branches.length, branches });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
// Public: Get Active Branches for Customers
const getPublicBranches = async (req, res) => {
  try {
    const branches = await prisma.branch.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        code: true,
        location: true,
        phone: true,
        isActive: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return res.status(200).json({
      success: true,
      count: branches.length,
      branches
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 3. Toggle Branch Active Status
const toggleBranchStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const branch = await prisma.branch.findUnique({ where: { id } });
    if (!branch) {
      return res.status(404).json({ success: false, message: 'Branch nahi mili!' });
    }

    const updatedBranch = await prisma.branch.update({
      where: { id },
      data: { isActive: !branch.isActive }
    });

    return res.status(200).json({
      success: true,
      message: `Branch status ${updatedBranch.isActive ? 'Active' : 'Disabled'} kar diya gaya.`,
      branch: updatedBranch
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Assign User (Doctor/Pharmacist/Admin) to Branch
const assignUserToBranch = async (req, res) => {
  try {
    const { userId, branchId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID zaroori hai!' });
    }

    // 🌟 Target User Check
    const targetUser = await prisma.user.findUnique({ where: { id: userId } });

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User nahi mila!' });
    }

    // 🌟 Restriction 1: Patient / Customer restriction
    if (targetUser.role === 'PATIENT' || targetUser.role === 'CUSTOMER') {
      return res.status(400).json({
        success: false,
        message: 'Patients registration ke waqt khud apni branch select karte hain.'
      });
    }

    // 🌟 Restriction 2: Super Admin restriction
    if (targetUser.role === 'SUPER_ADMIN') {
      return res.status(400).json({
        success: false,
        message: 'Super Admin ko kisi specific branch se bind karne ki zaroorat nahi hai.'
      });
    }

    // Update Staff Member Branch
    const user = await prisma.user.update({
      where: { id: userId },
      data: { branchId: branchId || null },
      select: { id: true, fullName: true, role: true, branchId: true }
    });

    return res.status(200).json({ success: true, message: 'Staff member ki branch update ho gayi!', user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;

    const branch = await prisma.branch.findUnique({ where: { id } });
    if (!branch) {
      return res.status(404).json({ success: false, message: 'Branch nahi mili!' });
    }

    await prisma.branch.delete({ where: { id } });

    return res.status(200).json({ success: true, message: 'Branch delete ho gayi!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
  createBranch,
  getAllBranches,
  getPublicBranches,
  toggleBranchStatus,
  assignUserToBranch,
  deleteBranch
};