const express = require('express');

const router = express.Router();

const {
  createProductReview,
  getProductReviews,
  getAllProductReviews,
  approveProductReview,
  rejectProductReview,
  deleteProductReview,
} = require('../controllers/productReviewController');

const {
  protect,
  adminOnly,
} = require('../middleware/authMiddleware');

// IMPORTANT: Existing uploadMiddleware.js use kar rahe hain
const uploadReviewImages = require(
  '../middleware/uploadMiddleware'
);

// ==========================================
// CUSTOMER ROUTES
// ==========================================

// Create product review with maximum 5 images
router.post(
  '/',
  protect,
  uploadReviewImages.array('images', 5),
  createProductReview
);

// Get approved reviews of a particular product
router.get(
  '/product/:productId',
  getProductReviews
);

// ==========================================
// ADMIN ROUTES
// ==========================================

// Get all product reviews
router.get(
  '/admin/all',
  protect,
  adminOnly,
  getAllProductReviews
);

// Approve product review
router.put(
  '/:id/approve',
  protect,
  adminOnly,
  approveProductReview
);

// Reject product review
router.put(
  '/:id/reject',
  protect,
  adminOnly,
  rejectProductReview
);

// Delete product review
router.delete(
  '/:id',
  protect,
  adminOnly,
  deleteProductReview
);

module.exports = router;