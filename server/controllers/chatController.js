const { processAIChat } = require('../services/aiService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Process AI Chat assistant message
// @route   POST /api/chat
// @access  Public
const handleChat = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return errorResponse(res, 400, 'Message cannot be empty');
    }

    const aiResult = await processAIChat(message, req.user || null);

    return successResponse(res, 200, 'AI response generated', aiResult);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleChat,
};
