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

const uploadReviewImages = require(
  '../middleware/uploadMiddleware'
);
// CUSTOMER ROUTES

router.post(
  '/',
  protect,
  uploadReviewImages.array('images', 5),
  createProductReview
);

router.get(
  '/product/:productId',
  getProductReviews
);

// ADMIN ROUTES

router.get(
  '/admin/all',
  protect,
  adminOnly,
  getAllProductReviews
);

router.put(
  '/:id/approve',
  protect,
  adminOnly,
  approveProductReview
);

router.put(
  '/:id/reject',
  protect,
  adminOnly,
  rejectProductReview
);

router.delete(
  '/:id',
  protect,
  adminOnly,
  deleteProductReview
);

module.exports = router;