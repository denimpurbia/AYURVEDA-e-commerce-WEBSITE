const express = require('express');

const router = express.Router();

const {
  createReview,
  getApprovedReviews,
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
// PUBLIC REVIEWS
// ==========================================

// Get only approved reviews
router.get(
  '/',
  getApprovedReviews
);


// ==========================================
// CUSTOMER REVIEW
// ==========================================

// Create review
router.post(
  '/',
  protect,
  createReview
);


// ==========================================
// ADMIN REVIEW MODERATION
// ==========================================

// Get all reviews including pending and rejected
router.get(
  '/admin/all',
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