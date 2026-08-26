const express = require('express');

const router = express.Router();

const { handleChat } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// ============================================================
// AI CHAT
// Login required
// ============================================================

router.post('/', protect, handleChat);

module.exports = router;