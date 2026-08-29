const express = require('express');

const router = express.Router();

const {
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  updateUserStatus,
  getDashboardStats,
} = require('../controllers/userController');

const {
  protect,
  adminOnly,
} = require('../middleware/authMiddleware');


// ==========================================
// LOGGED-IN USER PROFILE ROUTES
// ==========================================

// Get my profile
router.get(
  '/profile',
  protect,
  getMyProfile
);


// Update my profile
router.put(
  '/profile',
  protect,
  updateMyProfile
);


// ==========================================
// ADMIN ROUTES
// ==========================================

// Get all users
router.get(
  '/',
  protect,
  adminOnly,
  getAllUsers
);


// Admin dashboard statistics
router.get(
  '/dashboard-stats',
  protect,
  adminOnly,
  getDashboardStats
);


// Update user status
router.put(
  '/:id/status',
  protect,
  adminOnly,
  updateUserStatus
);


module.exports = router;