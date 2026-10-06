const express = require('express');

const router = express.Router();

const { protect, authorize } = require('../middlewares/authMiddleware');

const {
  createBranch,
  getAllBranches,
  getPublicBranches,
  toggleBranchStatus,
  assignUserToBranch,
  deleteBranch
} = require('../controllers/branchController');

// =====================================================
// PUBLIC CUSTOMER ROUTE
// =====================================================

// Customers can browse active pharmacies without login
router.get('/public', getPublicBranches);

// =====================================================
// PROTECTED ROUTES
// =====================================================

// Authenticated users can view all branches
router.get('/all', protect, getAllBranches);

// Only SUPER_ADMIN and ADMIN can create
router.post(
  '/create',
  protect,
  authorize('SUPER_ADMIN', 'ADMIN'),
  createBranch
);

// Only SUPER_ADMIN and ADMIN can toggle status
router.patch(
  '/toggle/:id',
  protect,
  authorize('SUPER_ADMIN', 'ADMIN'),
  toggleBranchStatus
);

// Only SUPER_ADMIN and ADMIN can assign users
router.post(
  '/assign-user',
  protect,
  authorize('SUPER_ADMIN', 'ADMIN'),
  assignUserToBranch
);

// Only SUPER_ADMIN and ADMIN can delete
router.delete(
  '/delete/:id',
  protect,
  authorize('SUPER_ADMIN', 'ADMIN'),
  deleteBranch
);

module.exports = router;