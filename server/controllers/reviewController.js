const Review = require('../models/Review');
const Product = require('../models/Product');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Create product review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return errorResponse(res, 400, 'Please provide productId, rating, and comment');
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
      return errorResponse(res, 400, 'You have already reviewed this product');
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      comment,
      verifiedBuyer: true,
    });

    // Update product rating and numReviews
    const reviews = await Review.find({ product: productId });
    product.numReviews = reviews.length;
    product.rating = (reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length).toFixed(1);

    await product.save();

    const populatedReview = await Review.findById(review._id).populate('user', 'name');

    return successResponse(res, 201, 'Review submitted successfully', populatedReview);
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'Product reviews retrieved', reviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review (Admin)
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
    const product = await Product.findById(productId);
    if (product) {
      const reviews = await Review.find({ product: productId });
      product.numReviews = reviews.length;
      product.rating = reviews.length > 0 ? (reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length).toFixed(1) : 5.0;
      await product.save();
    }

    return successResponse(res, 200, 'Review deleted');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getProductReviews,
  deleteReview,
};
