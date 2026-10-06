const express = require('express');

const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} = require('../controllers/orderController');

const {
  protect,
  authorize,
} = require('../middlewares/authMiddleware');


// =====================================================
// CUSTOMER ORDER ROUTES
// =====================================================

// Place Order / Checkout
router.post(
  '/',
  protect,
  authorize('CUSTOMER', 'PATIENT'),
  createOrder
);


// Get Logged-in User Orders
router.get(
  '/my-orders',
  protect,
  authorize('CUSTOMER', 'PATIENT'),
  getMyOrders
);


// Get Single Order
router.get(
  '/:id',
  protect,
  authorize('CUSTOMER', 'PATIENT'),
  getOrderById
);


// Cancel Order
router.patch(
  '/:id/cancel',
  protect,
  authorize('CUSTOMER', 'PATIENT'),
  cancelOrder
);


module.exports = router;