const express = require('express');

const router = express.Router();

const {
  createProductReview,
  getProductReviews,
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


// Create product review

router.post(
  '/',
  protect,
  uploadReviewImages.array(
    'images',
    5
  ),
  createProductReview
);


// Get all reviews of a product

router.get(
  '/product/:productId',
  getProductReviews
);


module.exports = router;