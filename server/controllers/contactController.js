const ContactMessage = require('../models/ContactMessage');
const {
  successResponse,
  errorResponse,
} = require('../utils/apiResponse');

// @desc    Create a new contact message
// @route   POST /api/contact
// @access  Public
const createContactMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return errorResponse(
        res,
        400,
        'Please fill in all required fields'
      );
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
    });

    return successResponse(
      res,
      201,
      'Message sent successfully',
      contactMessage
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
const getContactMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 });

    return successResponse(
      res,
      200,
      'Contact messages retrieved successfully',
      messages
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Mark message as read
// @route   PUT /api/contact/:id/read
// @access  Private/Admin
const markMessageAsRead = async (req, res, next) => {
  try {
    const contactMessage = await ContactMessage.findById(
      req.params.id
    );

    if (!contactMessage) {
      return errorResponse(res, 404, 'Message not found');
    }

    contactMessage.status = 'read';

    await contactMessage.save();

    return successResponse(
      res,
      200,
      'Message marked as read',
      contactMessage
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContactMessage = async (req, res, next) => {
  try {
    const contactMessage = await ContactMessage.findById(
      req.params.id
    );

    if (!contactMessage) {
      return errorResponse(res, 404, 'Message not found');
    }

    await contactMessage.deleteOne();

    return successResponse(
      res,
      200,
      'Message deleted successfully'
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContactMessage,
  getContactMessages,
  markMessageAsRead,
  deleteContactMessage,
};