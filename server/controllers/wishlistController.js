const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get current user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'products',
      select: 'name slug price discountPrice images rating numReviews stock category',
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    return successResponse(res, 200, 'Wishlist retrieved', wishlist);
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle item in wishlist (Add/Remove)
// @route   POST /api/wishlist/:productId
// @access  Private
const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    const index = wishlist.products.indexOf(productId);
    let message = '';

    if (index > -1) {
      wishlist.products.splice(index, 1);
      message = 'Product removed from wishlist';
    } else {
      wishlist.products.push(productId);
      message = 'Product added to wishlist';
    }

    await wishlist.save();

    const updated = await Wishlist.findById(wishlist._id).populate({
      path: 'products',
      select: 'name slug price discountPrice images rating numReviews stock category',
    });

    return successResponse(res, 200, message, updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return errorResponse(res, 404, 'Wishlist not found');
    }

    wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
    await wishlist.save();

    const updated = await Wishlist.findById(wishlist._id).populate({
      path: 'products',
      select: 'name slug price discountPrice images rating numReviews stock category',
    });

    return successResponse(res, 200, 'Product removed from wishlist', updated);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
};
