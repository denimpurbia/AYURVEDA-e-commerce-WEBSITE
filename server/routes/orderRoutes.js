const express = require('express');

const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

const {
  protect,
  adminOnly,
} = require('../middleware/authMiddleware');


// ============================================================
// CREATE ORDER
// GET ALL ORDERS - ADMIN
// ============================================================

router
  .route('/')
  .post(
    protect,
    createOrder
  )
  .get(
    protect,
    adminOnly,
    getAllOrders
  );


// ============================================================
// GET LOGGED IN USER ORDERS
// ============================================================

router.get(
  '/my-orders',
  protect,
  getMyOrders
);


// ============================================================
// CANCEL OWN ORDER
// IMPORTANT: THIS MUST COME BEFORE /:id
// ============================================================

router.put(
  '/:id/cancel',
  protect,
  cancelOrder
);


// ============================================================
// GET SINGLE ORDER
// ============================================================

router.get(
  '/:id',
  protect,
  getOrderById
);


// ============================================================
// UPDATE ORDER STATUS - ADMIN
// ============================================================

router.put(
  '/:id/status',
  protect,
  adminOnly,
  updateOrderStatus
);


module.exports = router;