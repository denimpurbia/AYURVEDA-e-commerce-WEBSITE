const express = require('express');

const router = express.Router();

const {
  createContactMessage,
  getContactMessages,
  markMessageAsRead,
  deleteContactMessage,
} = require('../controllers/contactController');

const {
  protect,
  adminOnly,
} = require('../middleware/authMiddleware');


// Public route - customer message send karega
router.post('/', createContactMessage);


// Admin routes
router.get(
  '/',
  protect,
  adminOnly,
  getContactMessages
);


router.put(
  '/:id/read',
  protect,
  adminOnly,
  markMessageAsRead
);


router.delete(
  '/:id',
  protect,
  adminOnly,
  deleteContactMessage
);


module.exports = router;