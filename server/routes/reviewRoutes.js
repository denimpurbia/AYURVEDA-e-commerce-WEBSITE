const express = require('express');

const router = express.Router();

const {
  createReview,
  getProductReviews,
  getAllReviews,
  approveReview,
  rejectReview,
  deleteReview,
} = require('../controllers/reviewController');

const {
  protect,
  adminOnly,
} = require('../middleware/authMiddleware');


// ==========================================
// CUSTOMER ROUTES
// ==========================================

// Create review
router.post(
  '/',
  protect,
  createReview
);


// Get approved reviews for a product
router.get(
  '/product/:productId',
  getProductReviews
);


// ==========================================
// ADMIN REVIEW MODERATION ROUTES
// ==========================================

// Get all reviews
router.get(
  '/',
  protect,
  adminOnly,
  getAllReviews
);


// Approve review
router.put(
  '/:id/approve',
  protect,
  adminOnly,
  approveReview
);


// Reject review
router.put(
  '/:id/reject',
  protect,
  adminOnly,
  rejectReview
);


// Delete review
router.delete(
  '/:id',
  protect,
  adminOnly,
  deleteReview
);


module.exports = router;