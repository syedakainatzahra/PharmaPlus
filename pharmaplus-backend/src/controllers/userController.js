const prisma = require('../config/db');
const bcrypt = require('bcryptjs');

// =====================================================
// VALID ROLES & STATUSES
// =====================================================
const VALID_ROLES = [
  'DOCTOR',
  'PHARMACIST',
  'RECEPTIONIST',
  'BRANCH_MANAGER',
  'WAREHOUSE_MANAGER',
  'WAREHOUSE_EMPLOYEE',
  'DELIVERY_RIDER',
  'ADMIN',
  'SUPER_ADMIN',
];

const VALID_STATUSES = [
  'ACTIVE',
  'INACTIVE',
  'SUSPENDED',
  'ON_LEAVE',
];

// =====================================================
// 1. GET ALL USERS (Excludes Patients/Customers)
// =====================================================
const getAllUsers = async (req, res) => {
  try {
    const { role, branchId, status, search } = req.query;
    const where = {};

    // Exclude Patients and Customers completely from Admin Panel
    where.role = {
      notIn: ['PATIENT', 'CUSTOMER'],
    };

    if (role && role !== 'ALL') {
      const normalizedRole = role.trim().toUpperCase();
      if (!VALID_ROLES.includes(normalizedRole)) {
        return res.status(400).json({ success: false, message: `Invalid role: ${role}` });
      }
      where.role = normalizedRole;
    }

    if (branchId && branchId !== 'ALL') {
      where.branchId = branchId;
    }

    if (status && status !== 'ALL') {
      const normalizedStatus = status.trim().toUpperCase();
      if (!VALID_STATUSES.includes(normalizedStatus)) {
        return res.status(400).json({ success: false, message: `Invalid status: ${status}` });
      }
      where.status = normalizedStatus;
    }

    if (search && search.trim() !== '') {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { employeeId: { contains: search, mode: 'insensitive' } },
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
        branch: {
          select: { id: true, name: true, code: true, location: true, status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    console.error('Get All Users Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================================
// 2. GET SINGLE USER
// =====================================================
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
        branch: { select: { id: true, name: true, code: true, location: true } },
      },
    });

    if (!user || ['PATIENT', 'CUSTOMER'].includes(user.role)) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Get User Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================================
// 3. GET USERS BY BRANCH
// =====================================================
const getUsersByBranch = async (req, res) => {
  try {
    const { branchId } = req.params;
    const branch = await prisma.branch.findUnique({ where: { id: branchId } });

    if (!branch) {
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }

    const users = await prisma.user.findMany({
      where: {
        branchId,
        role: { notIn: ['PATIENT', 'CUSTOMER'] },
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        employeeId: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: { role: 'asc' },
    });

    return res.status(200).json({ success: true, branch, count: users.length, users });
  } catch (error) {
    console.error('Get Branch Users Error:', error);
    return res.status(500).json({ success: false, message: error.message });
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
      return res.status(400).json({ success: false, message: `Invalid role: ${role}` });
    }

    const where = { role: normalizedRole };
    if (branchId) where.branchId = branchId;

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
        branch: { select: { id: true, name: true, code: true } },
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ success: true, role: normalizedRole, count: users.length, users });
  } catch (error) {
    console.error('Get Users By Role Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================================
// 5. SYSTEM STATS (Excludes Patients from Staff Counts)
// =====================================================
const getSystemStats = async (req, res) => {
  try {
    const totalStaff = await prisma.user.count({
      where: { role: { notIn: ['PATIENT', 'CUSTOMER'] } },
    });

    const totalDoctors = await prisma.user.count({ where: { role: 'DOCTOR' } });
    const totalPharmacists = await prisma.user.count({ where: { role: 'PHARMACIST' } });
    const totalReceptionists = await prisma.user.count({ where: { role: 'RECEPTIONIST' } });
    const totalBranchManagers = await prisma.user.count({ where: { role: 'BRANCH_MANAGER' } });
    const totalWarehouseManagers = await prisma.user.count({ where: { role: 'WAREHOUSE_MANAGER' } });
    const totalWarehouseEmployees = await prisma.user.count({ where: { role: 'WAREHOUSE_EMPLOYEE' } });
    const totalDeliveryRiders = await prisma.user.count({ where: { role: 'DELIVERY_RIDER' } });

    const totalBranches = await prisma.branch.count();
    const activeBranches = await prisma.branch.count({ where: { status: 'ACTIVE' } });

    return res.status(200).json({
      success: true,
      stats: {
        users: {
          totalStaff,
          doctors: totalDoctors,
          pharmacists: totalPharmacists,
          receptionists: totalReceptionists,
          branchManagers: totalBranchManagers,
          warehouseManagers: totalWarehouseManagers,
          warehouseEmployees: totalWarehouseEmployees,
          deliveryRiders: totalDeliveryRiders,
        },
        branches: { total: totalBranches, active: activeBranches },
      },
    });
  } catch (error) {
    console.error('System Stats Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================================
// 6. UPDATE USER ROLE
// =====================================================
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role) return res.status(400).json({ success: false, message: 'Role is required' });
    const normalizedRole = role.toUpperCase();

    if (!VALID_ROLES.includes(normalizedRole)) {
      return res.status(400).json({ success: false, message: `Invalid role: ${role}` });
    }

    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) return res.status(404).json({ success: false, message: 'User not found' });

    if (existingUser.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot change your own role' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: normalizedRole },
      select: { id: true, fullName: true, email: true, role: true, status: true, branchId: true },
    });

    return res.status(200).json({ success: true, message: `User role changed to ${normalizedRole}`, user: updatedUser });
  } catch (error) {
    console.error('Update User Role Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================================
// 7. UPDATE USER BRANCH
// =====================================================
const updateUserBranch = async (req, res) => {
  try {
    const { userId } = req.params;
    const { branchId } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (branchId === null || branchId === '') {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { branchId: null },
        select: { id: true, fullName: true, email: true, role: true, status: true, branchId: true },
      });
      return res.status(200).json({ success: true, message: 'User removed from branch', user: updatedUser });
    }

    const branch = await prisma.branch.findUnique({ where: { id: branchId } });
    if (!branch) return res.status(404).json({ success: false, message: 'Branch not found' });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { branchId },
      select: { id: true, fullName: true, email: true, role: true, status: true, branchId: true, branch: { select: { id: true, name: true, code: true } } },
    });

    return res.status(200).json({ success: true, message: `User assigned to ${branch.name}`, user: updatedUser });
  } catch (error) {
    console.error('Update User Branch Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================================
// 8. UPDATE USER STATUS
// =====================================================
const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ success: false, message: 'Status is required' });
    const normalizedStatus = status.toUpperCase();

    if (!VALID_STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({ success: false, message: `Invalid status: ${status}` });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.id === req.user.id && normalizedStatus !== 'ACTIVE') {
      return res.status(400).json({ success: false, message: 'You cannot deactivate your own account' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status: normalizedStatus },
      select: { id: true, fullName: true, email: true, role: true, status: true },
    });

    return res.status(200).json({ success: true, message: `User status changed to ${normalizedStatus}`, user: updatedUser });
  } catch (error) {
    console.error('Update User Status Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================================
// 9. DELETE USER
// =====================================================
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.role === 'SUPER_ADMIN') {
      return res.status(403).json({ success: false, message: 'Super Admin accounts cannot be deleted' });
    }

    await prisma.user.delete({ where: { id: userId } });
    return res.status(200).json({ success: true, message: `User ${user.fullName} deleted successfully` });
  } catch (error) {
    console.error('Delete User Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================================
// 10. GET MY PROFILE
// =====================================================
const getMyProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        employeeId: true,
        role: true,
        status: true,
        branchId: true,
        branch: { select: { id: true, name: true, code: true, location: true } },
      },
    });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Get My Profile Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================================
// 11. PUBLIC SIGNUP REQUEST (Staff registers and waits for approval)
// =====================================================
const requestUserSignup = async (req, res) => {
  try {
    const { fullName, email, password, role, phone, employeeId, branchId } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Full name, email, password and role are required' });
    }

    const formattedEmail = email.trim().toLowerCase();
    const normalizedRole = role.trim().toUpperCase();

    if (['PATIENT', 'CUSTOMER'].includes(normalizedRole)) {
      return res.status(400).json({ success: false, message: 'Patients and customers use a separate registration flow.' });
    }

    if (!VALID_ROLES.includes(normalizedRole)) {
      return res.status(400).json({ success: false, message: `Invalid role: ${role}` });
    }

    // Check if user already exists or request is already pending
    const existingUser = await prisma.user.findUnique({ where: { email: formattedEmail } });
    const existingRequest = await prisma.userRegistrationRequest.findUnique({ where: { email: formattedEmail } });

    if (existingUser || existingRequest) {
      return res.status(400).json({ success: false, message: 'Email is already registered or has a pending signup request.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const signupRequest = await prisma.userRegistrationRequest.create({
      data: {
        fullName: fullName.trim(),
        email: formattedEmail,
        password: hashedPassword,
        role: normalizedRole,
        phone: phone || null,
        employeeId: employeeId || null,
        branchId: branchId || null,
        status: 'PENDING',
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Signup request submitted successfully. Please wait for Admin or Super Admin approval.',
      request: signupRequest,
    });
  } catch (error) {
    console.error('Signup Request Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================================
// 12. APPROVE SIGNUP REQUEST (Admin/Super Admin action)
// =====================================================
const approveUserRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await prisma.userRegistrationRequest.findUnique({ where: { id: requestId } });
    if (!request) {
      return res.status(404).json({ success: false, message: 'Registration request not found' });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: 'This request has already been processed.' });
    }

    // Create the active user from the request
    const newUser = await prisma.user.create({
      data: {
        fullName: request.fullName,
        email: request.email,
        password: request.password, // already hashed
        role: request.role,
        phone: request.phone,
        employeeId: request.employeeId,
        branchId: request.branchId,
        status: 'ACTIVE',
      },
      select: { id: true, fullName: true, email: true, role: true, status: true },
    });

    // Mark request as APPROVED
    await prisma.userRegistrationRequest.update({
      where: { id: requestId },
      data: { status: 'APPROVED' },
    });

    return res.status(200).json({
      success: true,
      message: `User request approved successfully for ${newUser.fullName}`,
      user: newUser,
    });
  } catch (error) {
    console.error('Approve Request Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =====================================================
// EXPORTS (Note: createUser removed, request/approve added)
// =====================================================
module.exports = {
  getAllUsers,
  getUserById,
  getUsersByBranch,
  getUsersByRole,
  getSystemStats,
  updateUserRole,
  updateUserBranch,
  updateUserStatus,
  deleteUser,
  getMyProfile,
  requestUserSignup,
  approveUserRequest,
};