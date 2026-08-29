const ProductReview = require('../models/ProductReview');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// =====================================================
// HELPER: UPDATE PRODUCT RATING
// =====================================================

const updateProductRating = async (productId) => {
  const result = await ProductReview.aggregate([
    {
      $match: {
        product: productId,
        status: 'approved',
      },
    },
    {
      $group: {
        _id: '$product',
        averageRating: {
          $avg: '$rating',
        },
        totalReviews: {
          $sum: 1,
        },
      },
    },
  ]);

  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: Number(result[0].averageRating.toFixed(1)),
      numReviews: result[0].totalReviews,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      rating: 0,
      numReviews: 0,
    });
  }
};

// =====================================================
// CUSTOMER: CREATE PRODUCT REVIEW
// =====================================================

// @route POST /api/product-reviews
// @access Private
const createProductReview = async (req, res, next) => {
  try {
    const {
      productId,
      orderId,
      rating,
      comment,
      images,
    } = req.body;

    if (!productId || !orderId || !rating || !comment) {
      return errorResponse(
        res,
        400,
        'Product, order, rating and comment are required'
      );
    }

    if (Number(rating) < 1 || Number(rating) > 5) {
      return errorResponse(
        res,
        400,
        'Rating must be between 1 and 5'
      );
    }

    // Check product exists
    const product = await Product.findById(productId);

    if (!product) {
      return errorResponse(
        res,
        404,
        'Product not found'
      );
    }

    // Check order exists
    const order = await Order.findById(orderId);

    if (!order) {
      return errorResponse(
        res,
        404,
        'Order not found'
      );
    }

    // Check order belongs to logged-in user
    if (
      order.user.toString() !==
      req.user._id.toString()
    ) {
      return errorResponse(
        res,
        403,
        'You are not authorized to review this order'
      );
    }

    // Only delivered orders can be reviewed
    if (order.orderStatus !== 'Delivered') {
      return errorResponse(
        res,
        400,
        'You can review this product after the order is delivered'
      );
    }

    // Check product belongs to this order
    const orderedProduct = order.items.find(
      (item) =>
        item.product.toString() ===
        productId.toString()
    );

    if (!orderedProduct) {
      return errorResponse(
        res,
        400,
        'This product does not belong to the selected order'
      );
    }

    // Prevent duplicate review
    const existingReview =
      await ProductReview.findOne({
        user: req.user._id,
        product: productId,
        order: orderId,
      });

    if (existingReview) {
      return errorResponse(
        res,
        400,
        'You have already reviewed this product for this order'
      );
    }

    // Create review
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
        .populate(
          'product',
          'name images'
        );

    return successResponse(
      res,
      201,
      'Your product review has been submitted for admin approval',
      populatedReview
    );
  } catch (error) {
    next(error);
  }
};

// =====================================================
// PUBLIC: GET APPROVED PRODUCT REVIEWS
// =====================================================

// @route GET /api/product-reviews/product/:productId
// @access Public
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
        .populate(
          'user',
          'name'
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
// CUSTOMER: CHECK REVIEW ELIGIBILITY
// =====================================================

// @route GET /api/product-reviews/eligibility/:orderId/:productId
// @access Private
const checkReviewEligibility = async (
  req,
  res,
  next
) => {
  try {
    const {
      orderId,
      productId,
    } = req.params;

    const order =
      await Order.findById(orderId);

    if (!order) {
      return errorResponse(
        res,
        404,
        'Order not found'
      );
    }

    // Check ownership
    if (
      order.user.toString() !==
      req.user._id.toString()
    ) {
      return errorResponse(
        res,
        403,
        'Not authorized'
      );
    }

    const productExists =
      order.items.some(
        (item) =>
          item.product.toString() ===
          productId.toString()
      );

    if (!productExists) {
      return errorResponse(
        res,
        400,
        'Product does not belong to this order'
      );
    }

    const existingReview =
      await ProductReview.findOne({
        user: req.user._id,
        product: productId,
        order: orderId,
      });

    return successResponse(
      res,
      200,
      'Review eligibility checked',
      {
        canReview:
          order.orderStatus ===
            'Delivered' &&
          !existingReview,

        orderDelivered:
          order.orderStatus ===
          'Delivered',

        alreadyReviewed:
          Boolean(existingReview),
      }
    );
  } catch (error) {
    next(error);
  }
};

// =====================================================
// ADMIN: GET ALL PRODUCT REVIEWS
// =====================================================

// @route GET /api/product-reviews/admin/all
// @access Private/Admin
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
      'All product reviews retrieved',
      reviews
    );
  } catch (error) {
    next(error);
  }
};

// =====================================================
// ADMIN: APPROVE PRODUCT REVIEW
// =====================================================

// @route PUT /api/product-reviews/:id/approve
// @access Private/Admin
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
          'name images'
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

// @route PUT /api/product-reviews/:id/reject
// @access Private/Admin
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

// @route DELETE /api/product-reviews/:id
// @access Private/Admin
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

    const productId = review.product;

    await review.deleteOne();

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
  createProductReview,
  getProductReviews,
  checkReviewEligibility,
  getAllProductReviews,
  approveProductReview,
  rejectProductReview,
  deleteProductReview,
};