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

// Create a review
router.post(
  '/',
  protect,
  createReview
);

// Get only approved reviews for a product
router.get(
  '/product/:productId',
  getProductReviews
);


// ==========================================
// ADMIN REVIEW MODERATION
// ==========================================

// Get all reviews
router.get(
  '/',
  protect,
  adminOnly,
  getAllReviews
);

// Approve a review
router.put(
  '/:id/approve',
  protect,
  adminOnly,
  approveReview
);

// Reject a review
router.put(
  '/:id/reject',
  protect,
  adminOnly,
  rejectReview
);

// Delete a review
router.delete(
  '/:id',
  protect,
  adminOnly,
  deleteReview
);


module.exports = router;