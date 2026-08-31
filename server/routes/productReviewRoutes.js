const express = require('express');

const router = express.Router();


const {
  createProductReview,
  getProductReviews,
  getAllProductReviews,
} = require(
  '../controllers/productReviewController'
);


const {
  protect,
} = require(
  '../middleware/authMiddleware'
);


const uploadReviewImages = require(
  '../middleware/uploadMiddleware'
);


// ==========================================
// ADMIN: GET ALL PRODUCT REVIEWS
// ==========================================
// GET /api/product-reviews/admin/all
// ==========================================

router.get(
  '/admin/all',
  protect,
  getAllProductReviews
);


// ==========================================
// CUSTOMER: CREATE PRODUCT REVIEW
// ==========================================
// POST /api/product-reviews
// ==========================================

router.post(
  '/',
  protect,
  uploadReviewImages.array(
    'images',
    5
  ),
  createProductReview
);


// ==========================================
// PUBLIC: GET PRODUCT REVIEWS OF A PRODUCT
// ==========================================
// GET /api/product-reviews/product/:productId
// ==========================================

router.get(
  '/product/:productId',
  getProductReviews
);


module.exports = router;