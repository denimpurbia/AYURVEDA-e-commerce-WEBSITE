const express = require('express');

const router = express.Router();

const {
  // Website reviews
  createReview,
  getApprovedReviews,
  getAllReviews,
  approveReview,
  rejectReview,
  deleteReview,

  // Product reviews
  createProductReview,
  getProductReviews,
  getMyProductReviewStatus,
  getAllProductReviews,
  approveProductReview,
  rejectProductReview,
  deleteProductReview,
} = require('../controllers/reviewController');

const {
  protect,
  adminOnly,
} = require('../middleware/authMiddleware');


// ==========================================
// WEBSITE GENERAL REVIEWS
// ==========================================

// Get approved website reviews
router.get(
  '/',
  getApprovedReviews
);

// Create website review
router.post(
  '/',
  protect,
  createReview
);


// ==========================================
// PRODUCT REVIEWS - CUSTOMER
// ==========================================

// Get approved reviews for a particular product
router.get(
  '/product/:productId',
  getProductReviews
);

// Check whether logged-in user can review product
router.get(
  '/product/:productId/status',
  protect,
  getMyProductReviewStatus
);

// Create product review
router.post(
  '/product/:productId',
  protect,
  createProductReview
);


// ==========================================
// WEBSITE REVIEW ADMIN
// ==========================================

// Get all website reviews
router.get(
  '/admin/all',
  protect,
  adminOnly,
  getAllReviews
);

// Approve website review
router.put(
  '/:id/approve',
  protect,
  adminOnly,
  approveReview
);

// Reject website review
router.put(
  '/:id/reject',
  protect,
  adminOnly,
  rejectReview
);

// Delete website review
router.delete(
  '/:id',
  protect,
  adminOnly,
  deleteReview
);


// ==========================================
// PRODUCT REVIEW ADMIN
// ==========================================

// Get all product reviews
router.get(
  '/admin/product/all',
  protect,
  adminOnly,
  getAllProductReviews
);

// Approve product review
router.put(
  '/product/:id/approve',
  protect,
  adminOnly,
  approveProductReview
);

// Reject product review
router.put(
  '/product/:id/reject',
  protect,
  adminOnly,
  rejectProductReview
);

// Delete product review
router.delete(
  '/product/:id',
  protect,
  adminOnly,
  deleteProductReview
);


module.exports = router;