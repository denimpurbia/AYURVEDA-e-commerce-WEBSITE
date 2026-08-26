const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// Helper to recalculate cart totals
const recalculateCart = (cart) => {
  cart.subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cart.shippingFee = cart.subtotal >= 999 || cart.subtotal === 0 ? 0 : 99;
  cart.totalAmount = cart.subtotal + cart.shippingFee;
  return cart;
};

// @desc    Get current user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name slug price discountPrice images stock sku weight category',
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    cart = recalculateCart(cart);
    await cart.save();

    return successResponse(res, 200, 'Cart retrieved', cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return errorResponse(res, 404, 'Product not available');
    }

    if (product.stock < quantity) {
      return errorResponse(res, 400, `Only ${product.stock} items available in stock`);
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (itemIndex > -1) {
      const newQty = cart.items[itemIndex].quantity + Number(quantity);
      if (product.stock < newQty) {
        return errorResponse(res, 400, `Cannot add more than ${product.stock} items in total`);
      }
      cart.items[itemIndex].quantity = newQty;
      cart.items[itemIndex].price = itemPrice;
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
        price: itemPrice,
      });
    }

    cart = recalculateCart(cart);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price discountPrice images stock sku weight category',
    });

    return successResponse(res, 200, 'Product added to cart', updatedCart);
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return errorResponse(res, 400, 'Quantity must be at least 1');
    }

    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    if (product.stock < quantity) {
      return errorResponse(res, 400, `Only ${product.stock} units available in stock`);
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return errorResponse(res, 404, 'Cart not found');
    }

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
    if (itemIndex === -1) {
      return errorResponse(res, 404, 'Item not found in cart');
    }

    cart.items[itemIndex].quantity = Number(quantity);
    cart.items[itemIndex].price = product.discountPrice > 0 ? product.discountPrice : product.price;

    cart = recalculateCart(cart);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price discountPrice images stock sku weight category',
    });

    return successResponse(res, 200, 'Cart item updated', updatedCart);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return errorResponse(res, 404, 'Cart not found');
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    cart = recalculateCart(cart);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price discountPrice images stock sku weight category',
    });

    return successResponse(res, 200, 'Item removed from cart', updatedCart);
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart = recalculateCart(cart);
      await cart.save();
    }
    return successResponse(res, 200, 'Cart cleared', cart);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
