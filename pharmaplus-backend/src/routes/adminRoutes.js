const express = require('express');

const router = express.Router();

const {
  getAllUsers,
  getSystemStats,
  getUsersByBranch,
  getUsersByRole,
  getUserById,
  updateUserRole,
  updateUserBranch,
  updateUserStatus,
  deleteUser,
  getAdminNotifications,
  getAuditLogs,
} = require('../controllers/adminController');

const {
  protect,
  authorize,
} = require('../middlewares/authMiddleware');


// =====================================================
// ADMIN ACCESS
// =====================================================

router.use(protect);
router.use(authorize('SUPER_ADMIN'));


// =====================================================
// SYSTEM STATS
// =====================================================

router.get('/stats', getSystemStats);
router.get('/audit-logs', getAuditLogs);


// =====================================================
// NOTIFICATIONS
// =====================================================

router.get('/notifications', getAdminNotifications);


// =====================================================
// USERS
// =====================================================

router.get('/users', getAllUsers);
router.get('/users/:userId', getUserById);


// =====================================================
// USERS BY BRANCH
// =====================================================

router.get(
  '/branches/:branchId/users',
  getUsersByBranch
);


// =====================================================
// USERS BY ROLE
// =====================================================

router.get(
  '/roles/:role/users',
  getUsersByRole
);


// =====================================================
// UPDATE USER ROLE
// =====================================================

router.put(
  '/users/:userId/role',
  updateUserRole
);


// =====================================================
// UPDATE USER BRANCH
// =====================================================

router.put(
  '/users/:userId/branch',
  updateUserBranch
);


// =====================================================
// UPDATE USER STATUS
// =====================================================

router.put(
  '/users/:userId/status',
  updateUserStatus
);


// =====================================================
// DELETE USER
// =====================================================

router.delete(
  '/users/:userId',
  deleteUser
);


module.exports = router;