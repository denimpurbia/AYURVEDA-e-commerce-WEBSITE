const rateLimit = require('express-rate-limit');

// ============================================================
// OTP SEND LIMITER
// Protects:
// /send-otp
// /resend-otp
// /forgot-password
// ============================================================

const otpSendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  // Maximum 5 OTP requests from one IP
  limit: 5,

  standardHeaders: 'draft-8',
  legacyHeaders: false,

  message: {
    success: false,
    message:
      'Too many OTP requests. Please wait 15 minutes before requesting another OTP.',
  },
});

// ============================================================
// OTP VERIFY LIMITER
// Protects:
// /verify-otp
// /verify-reset-otp
// ============================================================

const otpVerifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes

  // Maximum 10 verification attempts
  limit: 10,

  standardHeaders: 'draft-8',
  legacyHeaders: false,

  message: {
    success: false,
    message:
      'Too many OTP verification attempts. Please wait 10 minutes and try again.',
  },
});

module.exports = {
  otpSendLimiter,
  otpVerifyLimiter,
};