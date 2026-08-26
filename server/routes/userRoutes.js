const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUserStatus,
  getDashboardStats,
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

router.get('/', getAllUsers);
router.get('/dashboard-stats', getDashboardStats);
router.put('/:id/status', updateUserStatus);

module.exports = router;
