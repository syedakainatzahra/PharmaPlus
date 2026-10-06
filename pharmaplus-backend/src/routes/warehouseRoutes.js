const express = require('express');
const router = express.Router();
const {
  getWarehouseInventory,
  getWarehouseWorkers,
  addWarehouseWorker
} = require('../controllers/warehouseController');

router.get('/inventory', getWarehouseInventory);
router.get('/workers', getWarehouseWorkers);
router.post('/workers', addWarehouseWorker);

module.exports = router;