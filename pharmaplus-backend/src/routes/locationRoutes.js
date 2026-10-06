const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Public / Authenticated Route
router.get('/', protect, locationController.getAllLocations);

// Restricted Route (Only SUPER_ADMIN can create locations)
router.post(
  '/',
  protect,
  restrictTo('SUPER_ADMIN'),
  locationController.createLocation
);

module.exports = router;