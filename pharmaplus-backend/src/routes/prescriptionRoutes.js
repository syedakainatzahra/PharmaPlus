const express = require('express');

const router = express.Router();

const {
  createPrescription,
  getMyPrescriptions,
  getPatientsList,
  getRecentPrescriptions,
  uploadPrescriptionFile,
} = require('../controllers/prescriptionController');

const { protect, authorize } = require('../middlewares/authMiddleware');

const uploadPrescription = require('../middlewares/uploadMiddleware');

// =====================================================
// GET MY PRESCRIPTIONS
// =====================================================

router.get('/', protect, getMyPrescriptions);

// =====================================================
// GET PATIENTS LIST
// Doctor / Super Admin only
// =====================================================

router.get(
  '/patients',
  protect,
  authorize('DOCTOR', 'SUPER_ADMIN'),
  getPatientsList
);

// =====================================================
// GET RECENT PRESCRIPTIONS
// Doctor / Super Admin only
// =====================================================

router.get(
  '/recent',
  protect,
  authorize('DOCTOR', 'SUPER_ADMIN'),
  getRecentPrescriptions
);

// =====================================================
// CUSTOMER / PATIENT FILE UPLOAD
// =====================================================

router.post(
  '/upload',
  protect,
  authorize('CUSTOMER', 'PATIENT'),
  uploadPrescription.single('prescription'),
  uploadPrescriptionFile
);

// =====================================================
// CREATE DOCTOR PRESCRIPTION
// =====================================================

router.post(
  '/create',
  protect,
  authorize('DOCTOR', 'SUPER_ADMIN'),
  createPrescription
);

router.post(
  '/',
  protect,
  authorize('DOCTOR', 'SUPER_ADMIN'),
  createPrescription
);

module.exports = router;