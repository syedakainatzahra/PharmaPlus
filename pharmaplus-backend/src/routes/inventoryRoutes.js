const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.post(
  '/batch',
  protect,
  restrictTo('SUPER_ADMIN', 'WAREHOUSE_MANAGER', 'PHARMACIST'),
  inventoryController.addStockBatch
);

// FEFO Routing Endpoint
router.get(
  '/fefo/:locationId/:productId',
  protect,
  inventoryController.getAvailableStockFEFO
);

module.exports = router;