const Review = require('../models/Review');
const Product = require('../models/Product');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// ==========================================
// HELPER: RECALCULATE PRODUCT RATING
// Only approved reviews are included
// ==========================================

const updateProductRating = async (productId) => {
  const product = await Product.findById(productId);

  if (!product) return;

  const approvedReviews = await Review.find({
    product: productId,
    status: 'approved',
  });

  product.numReviews = approvedReviews.length;

  product.rating =
    approvedReviews.length > 0
      ? Number(
          (
            approvedReviews.reduce(
              (total, review) => total + review.rating,
              0
            ) / approvedReviews.length
          ).toFixed(1)
        )
      : 0;

  await product.save();
};


// ==========================================
// CUSTOMER REVIEW
// ==========================================

// @desc    Create product review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return errorResponse(
        res,
        400,
        'Please provide productId, rating, and comment'
      );
    }

    const product = await Product.findById(productId);

    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (alreadyReviewed) {
      return errorResponse(
        res,
        400,
        'You have already reviewed this product'
      );
    }

    // New reviews are pending by default
    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      comment,
      verifiedBuyer: true,
      status: 'pending',
    });

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name')
      .populate('product', 'name');

    return successResponse(
      res,
      201,
      'Review submitted successfully and is waiting for admin approval',
      populatedReview
    );
  } catch (error) {
    next(error);
  }
};


// ==========================================
// CUSTOMER: GET APPROVED PRODUCT REVIEWS
// ==========================================

// @desc    Get approved reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;

    // IMPORTANT: Only approved reviews
    const reviews = await Review.find({
      product: productId,
      status: 'approved',
    })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    return successResponse(
      res,
      200,
      'Approved product reviews retrieved',
      reviews
    );
  } catch (error) {
    next(error);
  }
};


// ==========================================
// ADMIN: GET ALL REVIEWS
// ==========================================

// @desc    Get all reviews for admin moderation
// @route   GET /api/reviews
// @access  Private/Admin
const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('product', 'name')
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

// @desc    Approve review
// @route   PUT /api/reviews/:id/approve
// @access  Private/Admin
const approveReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return errorResponse(res, 404, 'Review not found');
    }

    review.status = 'approved';

    await review.save();

    // Update product rating using approved reviews
    await updateProductRating(review.product);

    const updatedReview = await Review.findById(review._id)
      .populate('user', 'name email')
      .populate('product', 'name');

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

// @desc    Reject review
// @route   PUT /api/reviews/:id/reject
// @access  Private/Admin
const rejectReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return errorResponse(res, 404, 'Review not found');
    }

    review.status = 'rejected';

    await review.save();

    // Update rating in case an approved review is rejected
    await updateProductRating(review.product);

    const updatedReview = await Review.findById(review._id)
      .populate('user', 'name email')
      .populate('product', 'name');

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

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return errorResponse(res, 404, 'Review not found');
    }

    const productId = review.product;

    await review.deleteOne();

    // Recalculate product rating
    await updateProductRating(productId);

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
  getProductReviews,
  getAllReviews,
  approveReview,
  rejectReview,
  deleteReview,
};