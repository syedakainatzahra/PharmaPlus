const express = require('express');

const router = express.Router();

const {
  register,
  login,
  getProfile,
  updateProfile,
  updateProfileImage,
  getAllUsers,
  updateUserStatus,
} = require('../controllers/authController');

const {
  protect,
  authorize,
} = require('../middlewares/authMiddleware');

const ProfileImageUpload = require('../middlewares/profileUpload');
// =====================================================
// PUBLIC ROUTES
// =====================================================

router.post('/signup', register);

router.post('/login', login);


// =====================================================
// PROFILE ROUTES
// Any Logged-in User
// =====================================================

// Get current user's profile
router.get(
  '/profile',
  protect,
  getProfile
);

// Update current user's profile
router.patch(
  '/profile',
  protect,
  updateProfile
);


// =====================================================
// ADMIN-ONLY PROTECTED ROUTE
// RBAC TEST
// =====================================================

router.get(
  '/admin-only',
  protect,
  authorize('SUPER_ADMIN', 'PHARMACIST'),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Welcome Admin / Pharmacist! You have elevated access.',
    });
  }
);


// =====================================================
// SUPER ADMIN ROUTES
// =====================================================

// Get All Users
router.get(
  '/users',
  protect,
  authorize('SUPER_ADMIN'),
  getAllUsers
);

// Update User Status
router.patch(
  '/users/:id/status',
  protect,
  authorize('SUPER_ADMIN'),
  updateUserStatus
);

router.patch(
  '/profile/image',
  protect,
  ProfileImageUpload.single('profileImage'),
  updateProfileImage
);


module.exports = router;