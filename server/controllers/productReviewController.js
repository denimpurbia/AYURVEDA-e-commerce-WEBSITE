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
//
// Only the user who purchased AND received
// the product can submit a review.
// ==========================================

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

    // Validate rating
    if (Number(rating) < 1 || Number(rating) > 5) {
      return errorResponse(
        res,
        400,
        'Rating must be between 1 and 5'
      );
    }

    // Find the order belonging to logged-in user
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

    // Review allowed only after delivery
    if (order.orderStatus !== 'Delivered') {
      return errorResponse(
        res,
        400,
        'You can review this product only after it has been delivered'
      );
    }

    // Check that this product exists in the order
    const productExistsInOrder = order.items.some(
      (item) =>
        item.product &&
        item.product.toString() === productId
    );

    if (!productExistsInOrder) {
      return errorResponse(
        res,
        400,
        'This product does not belong to your order'
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

    // One user can review one product only once
    const alreadyReviewed =
      await ProductReview.findOne({
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

    // Uploaded review images
    const images = req.files
      ? req.files.map(
          (file) =>
            `/uploads/reviews/${file.filename}`
        )
      : [];

    // Create review
    // No admin approval required
    const review = await ProductReview.create({
      user: req.user._id,
      product: productId,
      order: orderId,
      rating: Number(rating),
      comment: comment.trim(),
      images,
      verifiedBuyer: true,
    });

    // Populate user and product information
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
      'Product review submitted successfully',
      populatedReview
    );

  } catch (error) {
    next(error);
  }
};


// ==========================================
// PUBLIC: GET PRODUCT REVIEWS
// ==========================================
// GET /api/product-reviews/product/:productId
//
// All submitted genuine buyer reviews
// are shown directly.
// ==========================================

const getProductReviews = async (
  req,
  res,
  next
) => {
  try {
    const reviews =
      await ProductReview.find({
        product: req.params.productId,
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
// DELETE OWN REVIEW
// ==========================================
// DELETE /api/product-reviews/:id
// ==========================================

const deleteProductReview = async (
  req,
  res,
  next
) => {
  try {
    const review =
      await ProductReview.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

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
  createProductReview,
  getProductReviews,
  deleteProductReview,
};