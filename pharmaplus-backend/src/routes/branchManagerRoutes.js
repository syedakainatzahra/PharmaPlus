const express = require('express');

const router = express.Router();

const { protect, authorize } = require('../middlewares/authMiddleware');

const {
  getBranchStats,
  getBranchStaff
} = require('../controllers/branchManagerController');

// Branch Manager Dashboard Stats
router.get(
  '/stats',
  protect,
  authorize('BRANCH_MANAGER', 'SUPER_ADMIN'),
  getBranchStats
);

// Branch Manager Staff
router.get(
  '/staff',
  protect,
  authorize('BRANCH_MANAGER', 'SUPER_ADMIN'),
  getBranchStaff
);

module.exports = router;