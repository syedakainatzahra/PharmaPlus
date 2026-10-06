const prisma = require('../config/db');
const bcrypt = require('bcryptjs');

// =====================================================
// VALID ROLES
// =====================================================

const VALID_ROLES = [
  'CUSTOMER',
  'PATIENT',
  'DOCTOR',
  'PHARMACIST',
  'RECEPTIONIST',
  'BRANCH_MANAGER',
  'WAREHOUSE_MANAGER',
  'WAREHOUSE_EMPLOYEE',
  'DELIVERY_RIDER',
  'SUPER_ADMIN',
  'ADMIN',
];

// =====================================================
// VALID USER STATUS
// =====================================================

const VALID_STATUSES = [
  'ACTIVE',
  'INACTIVE',
  'SUSPENDED',
  'ON_LEAVE',
  'PENDING',
];

// =====================================================
// 1. GET ALL USERS
// =====================================================
const getAllUsers = async (req, res) => {
  try {
    const {
      role,
      branchId,
      status,
      search,
    } = req.query;

    const where = {};

    if (role && role !== 'ALL') {
      if (!VALID_ROLES.includes(role)) {
        return res.status(400).json({
          success: false,
          message: `Invalid role: ${role}`,
        });
      }
      where.role = role;
    } else {
      // Yeh line ensure karegi ke staff/user management mein customers aur patients show na hon
      where.role = {
        notIn: ['CUSTOMER', 'PATIENT'],
      };
    }

    if (branchId && branchId !== 'ALL') {
      where.branchId = branchId;
    }

    if (status && status !== 'ALL') {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status: ${status}`,
        });
      }
      where.status = status;
    }

    if (search && search.trim() !== '') {
      where.OR = [
        {
          fullName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          employeeId: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        employeeId: true,
        role: true,
        status: true,
        branchId: true,
        createdAt: true,
        updatedAt: true,
        branch: {
          select: {
            id: true,
            name: true,
            code: true,
            location: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });

  } catch (error) {
    console.error('Get All Users Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// 2. GET SINGLE USER
// =====================================================

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        employeeId: true,
        role: true,
        status: true,
        branchId: true,
        createdAt: true,
        updatedAt: true,
        branch: {
          select: {
            id: true,
            name: true,
            code: true,
            location: true,
            status: true,
          },
        },
        attendances: {
          orderBy: {
            date: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error('Get User Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// 3. GET USERS BY BRANCH
// =====================================================

const getUsersByBranch = async (req, res) => {
  try {
    const { branchId } = req.params;

    const branch = await prisma.branch.findUnique({
      where: {
        id: branchId,
      },
      select: {
        id: true,
        name: true,
        code: true,
        location: true,
        status: true,
      },
    });

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found',
      });
    }

    const users = await prisma.user.findMany({
      where: {
        branchId,
        role: {
          notIn: ['CUSTOMER', 'PATIENT'],
        },
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        employeeId: true,
        role: true,
        status: true,
        branchId: true,
        createdAt: true,
      },
      orderBy: {
        role: 'asc',
      },
    });

    return res.status(200).json({
      success: true,
      branch,
      count: users.length,
      users,
    });

  } catch (error) {
    console.error('Get Branch Users Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// 4. GET USERS BY ROLE
// =====================================================

const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const { branchId } = req.query;

    const normalizedRole = role.toUpperCase();

    if (!VALID_ROLES.includes(normalizedRole)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role: ${role}`,
      });
    }

    const where = {
      role: normalizedRole,
    };

    if (branchId) {
      where.branchId = branchId;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        employeeId: true,
        role: true,
        status: true,
        branchId: true,
        branch: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({
      success: true,
      role: normalizedRole,
      count: users.length,
      users,
    });

  } catch (error) {
    console.error('Get Users By Role Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// 5. SYSTEM STATS
// =====================================================

const getSystemStats = async (req, res) => {
  try {
    const totalStaff = await prisma.user.count({
      where: {
        role: {
          notIn: ['PATIENT', 'CUSTOMER']
        }
      }
    });

    const totalPatients = await prisma.user.count({ where: { role: 'PATIENT' } });
    const totalDoctors = await prisma.user.count({ where: { role: 'DOCTOR' } });
    const totalPharmacists = await prisma.user.count({ where: { role: 'PHARMACIST' } });
    const totalReceptionists = await prisma.user.count({ where: { role: 'RECEPTIONIST' } });
    const totalBranchManagers = await prisma.user.count({ where: { role: 'BRANCH_MANAGER' } });
    const totalWarehouseManagers = await prisma.user.count({ where: { role: 'WAREHOUSE_MANAGER' } });
    const totalWarehouseEmployees = await prisma.user.count({ where: { role: 'WAREHOUSE_EMPLOYEE' } });
    const totalDeliveryRiders = await prisma.user.count({ where: { role: 'DELIVERY_RIDER' } });

    const totalBranches = await prisma.branch.count();
    const activeBranches = await prisma.branch.count({ where: { status: 'ACTIVE' } });
    const maintenanceBranches = await prisma.branch.count({ where: { status: 'MAINTENANCE' } });
    const disabledBranches = await prisma.branch.count({ where: { status: 'DISABLED' } });

    const totalPrescriptions = await prisma.prescription.count();
    const pendingPrescriptions = await prisma.prescription.count({ where: { status: 'PENDING' } });
    const totalAppointments = await prisma.appointment.count();
    const pendingAppointments = await prisma.appointment.count({ where: { status: 'PENDING' } });

    const totalMedicines = await prisma.medicine.count();
    const totalProducts = await prisma.product.count();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayAttendance = await prisma.attendance.count({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const presentToday = await prisma.attendance.count({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: 'PRESENT',
      },
    });

    const absentToday = await prisma.attendance.count({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: 'ABSENT',
      },
    });

    return res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalStaff,
          patients: totalPatients,
          doctors: totalDoctors,
          pharmacists: totalPharmacists,
          receptionists: totalReceptionists,
          branchManagers: totalBranchManagers,
          warehouseManagers: totalWarehouseManagers,
          warehouseEmployees: totalWarehouseEmployees,
          deliveryRiders: totalDeliveryRiders,
        },
        branches: {
          total: totalBranches,
          active: activeBranches,
          maintenance: maintenanceBranches,
          disabled: disabledBranches,
        },
        healthcare: {
          prescriptions: totalPrescriptions,
          pendingPrescriptions,
          appointments: totalAppointments,
          pendingAppointments,
        },
        inventory: {
          medicines: totalMedicines,
          products: totalProducts,
        },
        attendance: {
          totalToday: todayAttendance,
          presentToday,
          absentToday,
        },
      },
    });

  } catch (error) {
    console.error('System Stats Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// 6. UPDATE USER ROLE
// =====================================================

const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Role is required',
      });
    }

    const normalizedRole = role.toUpperCase();

    if (!VALID_ROLES.includes(normalizedRole)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role: ${role}`,
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (existingUser.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role',
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: normalizedRole,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        status: true,
        branchId: true,
        branch: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: `User role changed to ${normalizedRole}`,
      user: updatedUser,
    });

  } catch (error) {
    console.error('Update User Role Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// 7. UPDATE USER BRANCH
// =====================================================

const updateUserBranch = async (req, res) => {
  try {
    const { userId } = req.params;
    const { branchId } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (branchId === null || branchId === '') {
      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          branchId: null,
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          status: true,
          branchId: true,
        },
      });

      return res.status(200).json({
        success: true,
        message: 'User removed from branch',
        user: updatedUser,
      });
    }

    const branch = await prisma.branch.findUnique({
      where: {
        id: branchId,
      },
    });

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found',
      });
    }

    if (branch.status === 'DISABLED') {
      return res.status(400).json({
        success: false,
        message: 'Cannot assign user to a disabled branch',
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        branchId,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        status: true,
        branchId: true,
        branch: {
          select: {
            id: true,
            name: true,
            code: true,
            location: true,
            status: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: `User assigned to ${branch.name}`,
      user: updatedUser,
    });

  } catch (error) {
    console.error('Update User Branch Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// 8. UPDATE USER 
// =====================================================

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullName, email, phone } = req.body;

    // Find user
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Email duplicate check
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists',
        });
      }
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        ...(fullName !== undefined && {
          fullName: fullName.trim(),
        }),

        ...(email !== undefined && {
          email: email.trim().toLowerCase(),
        }),

        ...(phone !== undefined && {
          phone: phone.trim(),
        }),
      },

      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        branchId: true,

        branch: {
          select: {
            id: true,
            name: true,
            code: true,
            location: true,
            status: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: 'User details updated successfully',
      user: updatedUser,
    });

  } catch (error) {
    console.error('Update User Error:', error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =====================================================
// 9. UPDATE USER STATUS
// =====================================================

const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    const normalizedStatus = status.toUpperCase();

    if (!VALID_STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status: ${status}`,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.id === req.user.id && normalizedStatus !== 'ACTIVE') {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account',
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        status: normalizedStatus,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        status: true,
        branchId: true,
      },
    });

    try {
      const { logAction } = require('../utils/logger');
      if (logAction) {
        if (normalizedStatus === 'ACTIVE') {
          await logAction(req.user.id, 'APPROVE_USER', `Approved user ID: ${userId}`);
        } else {
          await logAction(req.user.id, 'DECLINE_USER', `Updated status for user ID: ${userId} to ${normalizedStatus}`);
        }
      }
    } catch (logErr) {
      // Ignore if logger module isn't strictly required
    }

    return res.status(200).json({
      success: true,
      message: `User status changed to ${normalizedStatus}`,
      user: updatedUser,
    });

  } catch (error) {
    console.error('Update User Status Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// 10. DELETE USER
// =====================================================

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account',
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role === 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Super Admin accounts cannot be deleted from this API',
      });
    }

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return res.status(200).json({
      success: true,
      message: `User ${user.fullName} deleted successfully`,
    });

  } catch (error) {
    console.error('Delete User Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// 10. GET ADMIN NOTIFICATIONS
// =====================================================

const getAdminNotifications = async (req, res) => {
  try {
    const pendingUsers = await prisma.user.findMany({
      where: {
        status: 'PENDING',
        role: {
          notIn: ['CUSTOMER', 'PATIENT']
        }
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    const notifications = pendingUsers.map(user => ({
      id: user.id,
      title: 'New User Registration',
      message: `${user.fullName} (${user.role}) has requested an account.`,
      createdAt: user.createdAt,
    }));

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });

  } catch (error) {
    console.error('Get Notifications Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// 11. GET AUDIT LOGS
// =====================================================

const getAuditLogs = async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      include: { user: { select: { fullName: true, email: true, role: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return res.status(200).json({ success: true, logs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



// =====================================================
// 12. CREATE BRANCH MANAGER
// =====================================================

const createBranchManager = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      employeeId,
      branchId,
    } = req.body;

    // Required fields
    if (!fullName || !email || !password || !branchId) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, password and branch are required',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check branch
    const branch = await prisma.branch.findUnique({
      where: {
        id: branchId,
      },
    });

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found',
      });
    }

    if (!branch.isActive || branch.status !== 'ACTIVE') {
      return res.status(400).json({
        success: false,
        message: 'This branch is not active',
      });
    }

    // Check if branch already has a manager
    const existingManager = await prisma.user.findFirst({
      where: {
        branchId,
        role: 'BRANCH_MANAGER',
      },
    });

    if (existingManager) {
      return res.status(400).json({
        success: false,
        message: 'This branch already has a Branch Manager',
      });
    }

    // Check email
    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Branch Manager
    const manager = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        phone: phone ? phone.trim() : null,
        employeeId: employeeId ? employeeId.trim() : null,

        // Role is controlled by backend
        role: 'BRANCH_MANAGER',

        status: 'ACTIVE',

        // Manager is permanently linked to selected branch
        branchId,
      },

      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        employeeId: true,
        role: true,
        status: true,
        branchId: true,

        branch: {
          select: {
            id: true,
            name: true,
            code: true,
            location: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Branch Manager created successfully',
      manager,
    });

  } catch (error) {
    console.error('Create Branch Manager Error:', error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getAllUsers,
  getUserById,
  getUsersByBranch,
  getUsersByRole,
  getSystemStats,
  updateUserRole,
  updateUserBranch,
  updateUser,
  updateUserStatus,
  deleteUser,
  getAdminNotifications,
  getAuditLogs,
  createBranchManager,
};