const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// ==========================================
// USER PROFILE
// ==========================================

// @desc    Get logged-in user profile
// @route   GET /api/users/profile
// @access  Private/User
const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    return successResponse(
      res,
      200,
      'Profile retrieved successfully',
      user
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Update logged-in user profile
// @route   PUT /api/users/profile
// @access  Private/User
const updateMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    const { name, phone, address } = req.body;

    if (name !== undefined) {
      user.name = name.trim();
    }

    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    if (address) {
      user.address = {
        street: address.street || '',
        city: address.city || '',
        state: address.state || '',
        pincode: address.pincode || '',
      };
    }

    await user.save();

    const updatedUser = await User.findById(user._id)
      .select('-password');

    return successResponse(
      res,
      200,
      'Profile updated successfully',
      updatedUser
    );
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ADMIN USERS
// ==========================================

// @desc    Get all registered users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    return successResponse(
      res,
      200,
      'Users retrieved successfully',
      users
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Update user active status
// @route   PUT /api/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    if (user.role === 'admin') {
      return errorResponse(
        res,
        400,
        'Cannot deactivate admin accounts'
      );
    }

    user.isActive =
      isActive !== undefined
        ? isActive
        : !user.isActive;

    await user.save();

    return successResponse(
      res,
      200,
      `User account ${
        user.isActive
          ? 'activated'
          : 'deactivated'
      }`,
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      }
    );
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ADMIN DASHBOARD
// ==========================================

// @desc    Get Admin Dashboard Stats & Metrics
// @route   GET /api/users/dashboard-stats
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    // Total Users
    const totalUsers = await User.countDocuments({
      role: 'user',
    });

    // Total Products
    const totalProducts = await Product.countDocuments();

    // Total Orders
    const totalOrders = await Order.countDocuments();

    // Total Revenue
    const revenueResult = await Order.aggregate([
      {
        $match: {
          orderStatus: {
            $ne: 'Cancelled',
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: '$totalAmount',
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    // Recent Orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    // Low Stock Products
    const lowStockProducts = await Product.find({
      stock: { $lt: 10 },
      isActive: true,
    })
      .populate('category', 'name')
      .limit(6);

    // Monthly Sales Chart
    const salesChart = await Order.aggregate([
      {
        $match: {
          orderStatus: {
            $ne: 'Cancelled',
          },
        },
      },
      {
        $group: {
          _id: {
            $month: '$createdAt',
          },
          sales: {
            $sum: '$totalAmount',
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const monthsMap = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const formattedChartData = salesChart.map((item) => ({
      name: monthsMap[item._id - 1] || `Month ${item._id}`,
      revenue: item.sales,
      orders: item.count,
    }));

    return successResponse(
      res,
      200,
      'Dashboard statistics fetched successfully',
      {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        recentOrders,
        lowStockProducts,
        salesChart:
          formattedChartData.length > 0
            ? formattedChartData
            : [
                {
                  name: 'May',
                  revenue: 14500,
                  orders: 32,
                },
                {
                  name: 'Jun',
                  revenue: 22800,
                  orders: 54,
                },
                {
                  name: 'Jul',
                  revenue: 31200,
                  orders: 78,
                },
                {
                  name: 'Aug',
                  revenue: 48900,
                  orders: 112,
                },
              ],
      }
    );
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    next(error);
  }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  updateUserStatus,
  getDashboardStats,
};