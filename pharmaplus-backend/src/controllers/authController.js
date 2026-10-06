const prisma = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// =====================================================
// PUBLIC SIGNUP
// Only CUSTOMER accounts can be created publicly.
// SUPER_ADMIN and STAFF accounts cannot be created here.
// =====================================================
const register = async (req, res) => {
  console.log('👉 Signup Payload Received:', req.body);

  try {
    const { fullName, email, password, phone } = req.body;

    // Basic validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email and password are required',
      });
    }

    const formattedEmail = email.trim().toLowerCase();

    // Check existing user
    const existingUser = await prisma.user.findUnique({
      where: {
        email: formattedEmail,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered. Please login.',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // IMPORTANT:
    // Public signup ALWAYS creates CUSTOMER.
    // Role is NOT accepted from req.body.
    const user = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        email: formattedEmail,
        password: hashedPassword,
        role: 'CUSTOMER',
        status: 'ACTIVE',
        phone: phone ? phone.trim() : null,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      data: user,
    });
  } catch (error) {
    console.error('❌ SIGNUP ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to create account',
      error: error.message,
    });
  }
};


// =====================================================
// LOGIN
// Same login endpoint can authenticate customers,
// patients, staff and Super Admin.
// Role is taken from DATABASE, not from frontend.
// =====================================================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const formattedEmail = email.trim().toLowerCase();

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email: formattedEmail,
      },
    });

    // Don't reveal whether email exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check account status
    if (user.status === 'PENDING') {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending Super Admin approval.',
      });
    }

    if (user.status === 'REJECTED') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been rejected by the Super Admin.',
      });
    }

    if (user.status === 'INACTIVE') {
      return res.status(403).json({
        success: false,
        message: 'Your account is currently inactive.',
      });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        message: 'Your account is currently suspended.',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // JWT secret
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error('❌ JWT_SECRET is missing from .env');

      return res.status(500).json({
        success: false,
        message: 'Server authentication configuration is missing',
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        branchId: user.branchId,
      },
      secret,
      {
        expiresIn: '7d',
      }
    );

    // Return user information
    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        branchId: user.branchId,
        status: user.status,
        employeeId: user.employeeId,
      },
    });
  } catch (error) {
    console.error('❌ LOGIN ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to login',
      error: error.message,
    });
  }
};


// =====================================================
// GET ALL USERS
// SUPER_ADMIN ONLY
// =====================================================
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        employeeId: true,
        branchId: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('❌ GET ALL USERS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Users could not be fetched',
      error: error.message,
    });
  }
};
// =====================================================
// GET MY PROFILE
// Logged-in user can view their own profile
// =====================================================
const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        address: true,
        profileImage: true,
        role: true,
        status: true,
        branchId: true,
        employeeId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('❌ GET PROFILE ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE MY PROFILE
// Logged-in user can update their own basic information
// Email cannot be changed here
// =====================================================
const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, address } = req.body;

    // Basic validation
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Full name is required',
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        fullName: fullName.trim(),
        phone: phone && phone.trim() ? phone.trim() : null,
        address: address && address.trim() ? address.trim() : null,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        address: true,
        profileImage: true,
        role: true,
        status: true,
        branchId: true,
        employeeId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: updatedUser,
    });
  } catch (error) {
    console.error('❌ UPDATE PROFILE ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};
// =====================================================
// UPDATE PROFILE IMAGE
// Logged-in user can upload/change their profile picture
// =====================================================
const updateProfileImage = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select a profile image.',
      });
    }

    // Image path saved in database
    const profileImage = `/uploads/profile-images/${req.file.filename}`;

    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        profileImage,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        address: true,
        profileImage: true,
        role: true,
        status: true,
        branchId: true,
        employeeId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully!',
      user: updatedUser,
    });
  } catch (error) {
    console.error('❌ UPDATE PROFILE IMAGE ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update profile picture',
      error: error.message,
    });
  }
};
// =====================================================
// UPDATE USER STATUS
// SUPER_ADMIN ONLY
// =====================================================
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      'ACTIVE',
      'REJECTED',
      'INACTIVE',
      'SUSPENDED',
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing status value.',
      });
    }

    // Prevent Super Admin from accidentally changing
    // their own account status through this endpoint.
    if (req.user && req.user.id === id && req.user.role === 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Super Admin cannot change their own account status.',
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        status,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        status: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: `User status successfully updated to ${status}.`,
      updatedUser,
    });
  } catch (error) {
    console.error('❌ UPDATE STATUS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: error.message,
    });
  }
};


module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  updateProfileImage,
  getAllUsers,
  updateUserStatus,
};