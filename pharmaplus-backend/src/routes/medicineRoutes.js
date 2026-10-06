const express = require('express');
const router = express.Router();
const {
  addMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
} = require('../controllers/medicineController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Public / Authenticated Users Routes
router.get('/', getAllMedicines);
router.get('/:id', getMedicineById);

// Protected Staff Routes (Pharmacist / Admin)
router.post('/', protect, authorize('PHARMACIST', 'SUPER_ADMIN', 'ADMIN'), addMedicine);
router.put('/:id', protect, authorize('PHARMACIST', 'SUPER_ADMIN', 'ADMIN'), updateMedicine);

// Admin Only Route
router.delete('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), deleteMedicine);

module.exports = router;