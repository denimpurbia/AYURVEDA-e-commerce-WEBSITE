const express = require('express');
const router = express.Router();
const {
  createReview,
  getProductReviews,
  deleteReview,
} = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/product/:productId', getProductReviews);
router.delete('/:id', protect, adminOnly, deleteReview);

module.exports = router;
