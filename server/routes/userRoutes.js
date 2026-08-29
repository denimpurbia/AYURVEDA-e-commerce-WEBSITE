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

router.get(
  '/profile',
  protect,
  getMyProfile
);


router.put(
  '/profile',
  protect,
  updateMyProfile
);


// ==========================================
// ADMIN DASHBOARD ROUTE
// IMPORTANT: Specific routes first
// ==========================================

router.get(
  '/dashboard-stats',
  protect,
  adminOnly,
  getDashboardStats
);


// ==========================================
// ADMIN USERS ROUTES
// ==========================================

router.get(
  '/',
  protect,
  adminOnly,
  getAllUsers
);


router.put(
  '/:id/status',
  protect,
  adminOnly,
  updateUserStatus
);


module.exports = router;