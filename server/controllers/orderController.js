const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Create a new order (COD)
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, items, subtotal, shippingFee, totalAmount, paymentMethod } = req.body;

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.phone || !shippingAddress.street || !shippingAddress.city || !shippingAddress.pincode) {
      return errorResponse(res, 400, 'Complete shipping address is required');
    }

    let orderItems = items;

    // If items are not passed explicitly, pull directly from the user's database cart
    if (!orderItems || orderItems.length === 0) {
      const userCart = await Cart.findOne({ user: req.user._id }).populate('items.product');
      if (!userCart || userCart.items.length === 0) {
        return errorResponse(res, 400, 'Your cart is empty');
      }

      orderItems = userCart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        image: item.product.images[0] || '',
      }));
    }

    if (orderItems.length === 0) {
      return errorResponse(res, 400, 'No order items provided');
    }

    // Validate stock for each item & decrease product stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        return errorResponse(res, 404, `Product '${item.name}' is no longer available`);
      }
      if (product.stock < item.quantity) {
        return errorResponse(res, 400, `Insufficient stock for '${product.name}'. Only ${product.stock} available.`);
      }
    }

    // Deduct stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Calculate subtotal & shipping
    const calculatedSubtotal = subtotal || orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const calculatedShippingFee = shippingFee !== undefined ? shippingFee : (calculatedSubtotal >= 999 ? 0 : 99);
    const calculatedTotal = totalAmount || (calculatedSubtotal + calculatedShippingFee);

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      subtotal: calculatedSubtotal,
      shippingFee: calculatedShippingFee,
      totalAmount: calculatedTotal,
    });

    // Clear user cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], subtotal: 0, shippingFee: 0, totalAmount: 0 });

    return successResponse(res, 201, 'Order placed successfully', order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return successResponse(res, 200, 'User orders retrieved', orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) {
      return errorResponse(res, 404, 'Order not found');
    }

    // Verify ownership or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Not authorized to view this order');
    }

    return successResponse(res, 200, 'Order details retrieved', order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    return successResponse(res, 200, 'All orders retrieved', orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return errorResponse(res, 404, 'Order not found');
    }

    const prevStatus = order.orderStatus;

    if (orderStatus) {
      order.orderStatus = orderStatus;
      if (orderStatus === 'Delivered') {
        order.paymentStatus = 'Paid';
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    // If order is cancelled and was not already cancelled, restore stock
    if (orderStatus === 'Cancelled' && prevStatus !== 'Cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    const updatedOrder = await order.save();
    return successResponse(res, 200, 'Order status updated successfully', updatedOrder);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
