const express = require('express');
const router = express.Router();
const ibtController = require('../controllers/ibtController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Create IBT Request (Pharmacists / Managers)
router.post(
  '/',
  protect,
  restrictTo('SUPER_ADMIN', 'WAREHOUSE_MANAGER', 'PHARMACIST'),
  ibtController.createIBTRequest
);

// Approve IBT Request (Warehouse Managers / Admin)
router.patch(
  '/:ibtId/approve',
  protect,
  restrictTo('SUPER_ADMIN', 'WAREHOUSE_MANAGER'),
  ibtController.approveIBTRequest
);

module.exports = router;