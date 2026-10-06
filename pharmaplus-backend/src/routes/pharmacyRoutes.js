const express = require('express');
const router = express.Router();
const { getInventory, addMedicine, updateStock } = require('../controllers/pharmacyController');
const { protect } = require('../middlewares/authMiddleware'); // Sahi path ensure karein

router.get('/inventory', protect, getInventory);
router.post('/inventory', protect, addMedicine);
router.put('/inventory/:id/stock', protect, updateStock);

module.exports = router;