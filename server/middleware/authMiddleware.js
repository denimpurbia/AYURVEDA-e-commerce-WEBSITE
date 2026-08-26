const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/apiResponse');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ayurvedamart_super_secret_jwt_key_2026');
      
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user || !req.user.isActive) {
        return errorResponse(res, 401, 'User account is inactive or no longer exists');
      }
      return next();
    } catch (error) {
      return errorResponse(res, 401, 'Not authorized, token invalid or expired');
    }
  }

  if (!token) {
    return errorResponse(res, 401, 'Not authorized, no token provided');
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return errorResponse(res, 403, 'Access denied: Admin privileges required');
};

module.exports = { protect, adminOnly };
