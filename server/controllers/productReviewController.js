const ProductReview = require('../models/ProductReview');
const Order = require('../models/Order');
const Product = require('../models/Product');

const {
  successResponse,
  errorResponse,
} = require('../utils/apiResponse');

// ==========================================
// CUSTOMER: CREATE PRODUCT REVIEW
// ==========================================
// POST /api/product-reviews

const createProductReview = async (req, res, next) => {
  try {
    const {
      productId,
      orderId,
      rating,
      comment,
    } = req.body;

    // Validation
    if (!productId || !orderId || !rating || !comment) {
      return errorResponse(
        res,
        400,
        'Product, order, rating and comment are required'
      );
    }

    // Check rating
    if (rating < 1 || rating > 5) {
      return errorResponse(
        res,
        400,
        'Rating must be between 1 and 5'
      );
    }

    // Find order
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) {
      return errorResponse(
        res,
        404,
        'Order not found'
      );
    }

    // Product must be delivered
    if (order.orderStatus !== 'Delivered') {
      return errorResponse(
        res,
        400,
        'You can review this product only after delivery'
      );
    }

    // Check product belongs to this order
    const productExistsInOrder = order.items.some(
      (item) =>
        item.product &&
        item.product.toString() === productId
    );

    if (!productExistsInOrder) {
      return errorResponse(
        res,
        400,
        'This product does not belong to this order'
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

    // Check duplicate review
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

    // Get uploaded images
    const images = req.files
      ? req.files.map(
          (file) =>
            `/uploads/reviews/${file.filename}`
        )
      : [];

    // Create review
    const review =
      await ProductReview.create({
        user: req.user._id,
        product: productId,
        order: orderId,
        rating: Number(rating),
        comment: comment.trim(),
        images,
        verifiedBuyer: true,
        status: 'pending',
      });

    const populatedReview =
      await ProductReview.findById(review._id)
        .populate('user', 'name')
        .populate(
          'product',
          'name images'
        );

    return successResponse(
      res,
      201,
      'Product review submitted successfully and is waiting for admin approval',
      populatedReview
    );
  } catch (error) {
    next(error);
  }
};


// ==========================================
// PUBLIC: GET PRODUCT APPROVED REVIEWS
// ==========================================
// GET /api/product-reviews/product/:productId

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
        .sort({ createdAt: -1 });

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


// ==========================================
// ADMIN: GET ALL PRODUCT REVIEWS
// ==========================================
// GET /api/product-reviews/admin/all

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
          'trackingNumber orderStatus'
        )
        .sort({ createdAt: -1 });

    return successResponse(
      res,
      200,
      'All product reviews retrieved successfully',
      reviews
    );
  } catch (error) {
    next(error);
  }
};


// ==========================================
// ADMIN: APPROVE PRODUCT REVIEW
// ==========================================

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

    return successResponse(
      res,
      200,
      'Product review approved successfully',
      review
    );
  } catch (error) {
    next(error);
  }
};


// ==========================================
// ADMIN: REJECT PRODUCT REVIEW
// ==========================================

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


// ==========================================
// ADMIN: DELETE PRODUCT REVIEW
// ==========================================

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

    await review.deleteOne();

    return successResponse(
      res,
      200,
      'Product review deleted successfully'
    );
  } catch (error) {
    next(error);
  }
};


// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  createProductReview,
  getProductReviews,
  getAllProductReviews,
  approveProductReview,
  rejectProductReview,
  deleteProductReview,
};