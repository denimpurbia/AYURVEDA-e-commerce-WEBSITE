const Review = require('../models/Review');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// ==========================================
// CUSTOMER: CREATE GENERAL REVIEW
// ==========================================

// @desc    Create website review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return errorResponse(
        res,
        400,
        'Please provide rating and comment'
      );
    }

    // Optional: One review per user
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
    });

    if (alreadyReviewed) {
      return errorResponse(
        res,
        400,
        'You have already submitted a review'
      );
    }

    // New review is pending until admin approves it
    const review = await Review.create({
      user: req.user._id,
      rating: Number(rating),
      comment: comment.trim(),
      verifiedBuyer: true,
      status: 'pending',
    });

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name');

    return successResponse(
      res,
      201,
      'Thank you! Your review has been submitted for admin approval.',
      populatedReview
    );
  } catch (error) {
    next(error);
  }
};


// ==========================================
// PUBLIC: GET APPROVED REVIEWS
// ==========================================

// @desc    Get approved website reviews
// @route   GET /api/reviews
// @access  Public
const getApprovedReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({
      status: 'approved',
    })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    return successResponse(
      res,
      200,
      'Approved reviews retrieved successfully',
      reviews
    );
  } catch (error) {
    next(error);
  }
};


// ==========================================
// ADMIN: GET ALL REVIEWS
// ==========================================

// @desc    Get all reviews
// @route   GET /api/reviews/admin/all
// @access  Private/Admin
const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return successResponse(
      res,
      200,
      'All reviews retrieved successfully',
      reviews
    );
  } catch (error) {
    next(error);
  }
};


// ==========================================
// ADMIN: APPROVE REVIEW
// ==========================================

const approveReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return errorResponse(
        res,
        404,
        'Review not found'
      );
    }

    review.status = 'approved';

    await review.save();

    const updatedReview = await Review.findById(review._id)
      .populate('user', 'name email');

    return successResponse(
      res,
      200,
      'Review approved successfully',
      updatedReview
    );
  } catch (error) {
    next(error);
  }
};


// ==========================================
// ADMIN: REJECT REVIEW
// ==========================================

const rejectReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return errorResponse(
        res,
        404,
        'Review not found'
      );
    }

    review.status = 'rejected';

    await review.save();

    const updatedReview = await Review.findById(review._id)
      .populate('user', 'name email');

    return successResponse(
      res,
      200,
      'Review rejected successfully',
      updatedReview
    );
  } catch (error) {
    next(error);
  }
};


// ==========================================
// ADMIN: DELETE REVIEW
// ==========================================

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return errorResponse(
        res,
        404,
        'Review not found'
      );
    }

    await review.deleteOne();

    return successResponse(
      res,
      200,
      'Review deleted successfully'
    );
  } catch (error) {
    next(error);
  }
};


// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  createReview,
  getApprovedReviews,
  getAllReviews,
  approveReview,
  rejectReview,
  deleteReview,
};