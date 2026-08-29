const Review = require('../models/Review');
const ProductReview = require('../models/ProductReview');
const Product = require('../models/Product');
const Order = require('../models/Order');

const {
  successResponse,
  errorResponse,
} = require('../utils/apiResponse');


// =====================================================
// WEBSITE GENERAL REVIEWS
// =====================================================

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

    const review = await Review.create({
      user: req.user._id,
      rating: Number(rating),
      comment: comment.trim(),
      verifiedBuyer: true,
      status: 'pending',
    });

    const populatedReview = await Review.findById(
      review._id
    ).populate('user', 'name');

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


// =====================================================
// PUBLIC: GET APPROVED WEBSITE REVIEWS
// =====================================================

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


// =====================================================
// ADMIN: GET ALL WEBSITE REVIEWS
// =====================================================

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


// =====================================================
// ADMIN: APPROVE WEBSITE REVIEW
// =====================================================

const approveReview = async (req, res, next) => {
  try {
    const review = await Review.findById(
      req.params.id
    );

    if (!review) {
      return errorResponse(
        res,
        404,
        'Review not found'
      );
    }

    review.status = 'approved';

    await review.save();

    const updatedReview = await Review.findById(
      review._id
    ).populate('user', 'name email');

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


// =====================================================
// ADMIN: REJECT WEBSITE REVIEW
// =====================================================

const rejectReview = async (req, res, next) => {
  try {
    const review = await Review.findById(
      req.params.id
    );

    if (!review) {
      return errorResponse(
        res,
        404,
        'Review not found'
      );
    }

    review.status = 'rejected';

    await review.save();

    return successResponse(
      res,
      200,
      'Review rejected successfully',
      review
    );
  } catch (error) {
    next(error);
  }
};


// =====================================================
// ADMIN: DELETE WEBSITE REVIEW
// =====================================================

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(
      req.params.id
    );

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


// =====================================================
// PRODUCT REVIEWS
// =====================================================


// @desc    Create product review
// @route   POST /api/reviews/product/:productId
// @access  Private - Delivered customer only
const createProductReview = async (
  req,
  res,
  next
) => {
  try {
    const { productId } = req.params;

    const {
      rating,
      comment,
      images,
      orderId,
    } = req.body;

    // Basic validation
    if (!rating || !comment || !orderId) {
      return errorResponse(
        res,
        400,
        'Rating, comment and order ID are required'
      );
    }

    // Check product exists
    const product = await Product.findById(
      productId
    );

    if (!product) {
      return errorResponse(
        res,
        404,
        'Product not found'
      );
    }

    // Check order
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
      orderStatus: 'Delivered',
    });

    if (!order) {
      return errorResponse(
        res,
        403,
        'You can review this product only after the order has been delivered'
      );
    }

    // Check whether this product belongs to order
    const orderedProduct = order.items.find(
      (item) =>
        item.product.toString() ===
        productId.toString()
    );

    if (!orderedProduct) {
      return errorResponse(
        res,
        403,
        'This product does not belong to the selected order'
      );
    }

    // Prevent duplicate review
    const alreadyReviewed =
      await ProductReview.findOne({
        user: req.user._id,
        product: productId,
        order: orderId,
      });

    if (alreadyReviewed) {
      return errorResponse(
        res,
        400,
        'You have already reviewed this product'
      );
    }

    // Create product review
    const review =
      await ProductReview.create({
        user: req.user._id,
        product: productId,
        order: orderId,
        rating: Number(rating),
        comment: comment.trim(),
        images: Array.isArray(images)
          ? images
          : [],
        verifiedBuyer: true,
        status: 'pending',
      });

    const populatedReview =
      await ProductReview.findById(
        review._id
      )
        .populate('user', 'name')
        .populate('product', 'name');

    return successResponse(
      res,
      201,
      'Product review submitted successfully and is awaiting approval',
      populatedReview
    );
  } catch (error) {
    next(error);
  }
};


// =====================================================
// GET PRODUCT REVIEWS - PUBLIC
// =====================================================

// @desc    Get approved reviews of a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (
  req,
  res,
  next
) => {
  try {
    const reviews =
      await ProductReview.find({
        product: req.params.productId,
        status: 'approved',
      })
        .populate('user', 'name')
        .sort({
          createdAt: -1,
        });

    return successResponse(
      res,
      200,
      'Product reviews retrieved successfully',
      reviews
    );
  } catch (error) {
    next(error);
  }
};


// =====================================================
// CHECK IF USER CAN REVIEW PRODUCT
// =====================================================

// @desc    Check product review eligibility
// @route   GET /api/reviews/product/:productId/status
// @access  Private
const getMyProductReviewStatus = async (
  req,
  res,
  next
) => {
  try {
    const { productId } = req.params;

    // Find delivered order containing this product
    const deliveredOrder =
      await Order.findOne({
        user: req.user._id,
        orderStatus: 'Delivered',
        'items.product': productId,
      }).sort({
        createdAt: -1,
      });

    if (!deliveredOrder) {
      return successResponse(
        res,
        200,
        'Product review status retrieved',
        {
          canReview: false,
          reason:
            'You can review this product after your order is delivered',
        }
      );
    }

    // Check if already reviewed
    const existingReview =
      await ProductReview.findOne({
        user: req.user._id,
        product: productId,
        order: deliveredOrder._id,
      });

    if (existingReview) {
      return successResponse(
        res,
        200,
        'Product review status retrieved',
        {
          canReview: false,
          alreadyReviewed: true,
          reviewStatus:
            existingReview.status,
          reason:
            'You have already reviewed this product',
        }
      );
    }

    return successResponse(
      res,
      200,
      'You can review this product',
      {
        canReview: true,
        orderId: deliveredOrder._id,
      }
    );
  } catch (error) {
    next(error);
  }
};


// =====================================================
// UPDATE PRODUCT RATING
// =====================================================

const updateProductRating = async (
  productId
) => {
  const reviews =
    await ProductReview.find({
      product: productId,
      status: 'approved',
    });

  const numReviews =
    reviews.length;

  const rating =
    numReviews > 0
      ? reviews.reduce(
          (total, review) =>
            total + review.rating,
          0
        ) / numReviews
      : 0;

  await Product.findByIdAndUpdate(
    productId,
    {
      rating:
        Math.round(rating * 10) / 10,
      numReviews,
    }
  );
};


// =====================================================
// ADMIN: GET ALL PRODUCT REVIEWS
// =====================================================

const getAllProductReviews = async (
  req,
  res,
  next
) => {
  try {
    const reviews =
      await ProductReview.find()
        .populate(
          'user',
          'name email'
        )
        .populate(
          'product',
          'name images'
        )
        .populate(
          'order',
          'trackingNumber'
        )
        .sort({
          createdAt: -1,
        });

    return successResponse(
      res,
      200,
      'Product reviews retrieved successfully',
      reviews
    );
  } catch (error) {
    next(error);
  }
};


// =====================================================
// ADMIN: APPROVE PRODUCT REVIEW
// =====================================================

const approveProductReview = async (
  req,
  res,
  next
) => {
  try {
    const review =
      await ProductReview.findById(
        req.params.id
      );

    if (!review) {
      return errorResponse(
        res,
        404,
        'Product review not found'
      );
    }

    review.status = 'approved';

    await review.save();

    // Update product rating
    await updateProductRating(
      review.product
    );

    const updatedReview =
      await ProductReview.findById(
        review._id
      )
        .populate(
          'user',
          'name email'
        )
        .populate(
          'product',
          'name'
        );

    return successResponse(
      res,
      200,
      'Product review approved successfully',
      updatedReview
    );
  } catch (error) {
    next(error);
  }
};


// =====================================================
// ADMIN: REJECT PRODUCT REVIEW
// =====================================================

const rejectProductReview = async (
  req,
  res,
  next
) => {
  try {
    const review =
      await ProductReview.findById(
        req.params.id
      );

    if (!review) {
      return errorResponse(
        res,
        404,
        'Product review not found'
      );
    }

    review.status = 'rejected';

    await review.save();

    // Update product rating
    await updateProductRating(
      review.product
    );

    return successResponse(
      res,
      200,
      'Product review rejected successfully',
      review
    );
  } catch (error) {
    next(error);
  }
};


// =====================================================
// ADMIN: DELETE PRODUCT REVIEW
// =====================================================

const deleteProductReview = async (
  req,
  res,
  next
) => {
  try {
    const review =
      await ProductReview.findById(
        req.params.id
      );

    if (!review) {
      return errorResponse(
        res,
        404,
        'Product review not found'
      );
    }

    const productId =
      review.product;

    await review.deleteOne();

    // Update product rating
    await updateProductRating(
      productId
    );

    return successResponse(
      res,
      200,
      'Product review deleted successfully'
    );
  } catch (error) {
    next(error);
  }
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
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
};