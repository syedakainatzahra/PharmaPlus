const express = require('express');

const router = express.Router();


// =====================================================
// CONTROLLERS
// =====================================================

// Profile Controller
const {
  getMyProfile,
} = require('../controllers/userController');


// User & Staff Management Controller
const {
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
  createBranchManager,
} = require('../controllers/adminController');


// =====================================================
// AUTH MIDDLEWARE
// =====================================================

const {
  protect,
  authorize,
} = require('../middlewares/authMiddleware');


// =====================================================
// PROFILE
// =====================================================

// Any authenticated user
// GET /api/v1/users/me

router.get(
  '/me',
  protect,
  getMyProfile
);


// =====================================================
// TEST DASHBOARD ROUTES
// =====================================================


// -----------------------------------------------------
// DOCTOR DASHBOARD
// -----------------------------------------------------

// GET /api/v1/users/doctor-dashboard

router.get(
  '/doctor-dashboard',
  protect,
  authorize('DOCTOR'),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Welcome to the Doctor Portal! Access Granted. 🩺',
    });
  }
);


// -----------------------------------------------------
// PHARMACIST INVENTORY
// -----------------------------------------------------

// GET /api/v1/users/pharmacist-inventory

router.get(
  '/pharmacist-inventory',
  protect,
  authorize('PHARMACIST', 'SUPER_ADMIN'),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Welcome to Pharmacist Inventory Access! 💊',
    });
  }
);


// =====================================================
// USER & STAFF MANAGEMENT
// SUPER ADMIN ONLY
// =====================================================


// -----------------------------------------------------
// GET ALL USERS
// -----------------------------------------------------

// GET /api/v1/users

router.get(
  '/',
  protect,
  authorize('SUPER_ADMIN'),
  getAllUsers
);






// -----------------------------------------------------
// GET SYSTEM STATS
// -----------------------------------------------------

// GET /api/v1/users/stats

router.get(
  '/stats',
  protect,
  authorize('SUPER_ADMIN'),
  getSystemStats
);

// -----------------------------------------------------
// GET ADMIN NOTIFICATIONS
// -----------------------------------------------------

// GET /api/v1/users/notifications

router.get(
  '/notifications',
  protect,
  authorize('SUPER_ADMIN'),
  getAdminNotifications
);
// -----------------------------------------------------
// GET USERS BY ROLE
// -----------------------------------------------------

// GET /api/v1/users/role/DOCTOR

router.get(
  '/role/:role',
  protect,
  authorize('SUPER_ADMIN'),
  getUsersByRole
);


// -----------------------------------------------------
// GET USERS BY BRANCH
// -----------------------------------------------------

// GET /api/v1/users/branch/:branchId

router.get(
  '/branch/:branchId',
  protect,
  authorize('SUPER_ADMIN'),
  getUsersByBranch
);

// Create Branch Manager - SUPER ADMIN ONLY
router.post(
  '/branch-manager',
  protect,
  authorize('SUPER_ADMIN'),
  createBranchManager
);
// -----------------------------------------------------
// GET SINGLE USER
// -----------------------------------------------------

// GET /api/v1/users/:userId

router.get(
  '/:userId',
  protect,
  authorize('SUPER_ADMIN'),
  getUserById
);

router.patch('/:userId', protect, authorize('SUPER_ADMIN'), updateUser);
// -----------------------------------------------------
// UPDATE USER ROLE
// -----------------------------------------------------

// PATCH /api/v1/users/:userId/role

router.patch(
  '/:userId/role',
  protect,
  authorize('SUPER_ADMIN'),
  updateUserRole
);


// -----------------------------------------------------
// UPDATE USER BRANCH
// -----------------------------------------------------

// PATCH /api/v1/users/:userId/branch

router.patch(
  '/:userId/branch',
  protect,
  authorize('SUPER_ADMIN'),
  updateUserBranch
);


// -----------------------------------------------------
// UPDATE USER STATUS
// -----------------------------------------------------

// PATCH /api/v1/users/:userId/status

router.patch(
  '/:userId/status',
  protect,
  authorize('SUPER_ADMIN'),
  updateUserStatus
);


// -----------------------------------------------------
// DELETE USER
// -----------------------------------------------------

// DELETE /api/v1/users/:userId

router.delete(
  '/:userId',
  protect,
  authorize('SUPER_ADMIN'),
  deleteUser
);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;