const express = require('express');

const router = express.Router();

const {
  sendRegistrationOTP,
  verifyRegistrationOTP,
  resendRegistrationOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  loginUser,
  getMe,
  updateProfile,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

const {
  otpSendLimiter,
  otpVerifyLimiter,
} = require('../middleware/otpRateLimiter');

const validate = require('../middleware/validationMiddleware');

const {
  sendOTPValidation,
  loginValidation,
  emailOTPValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require('../middleware/authValidation');

// ============================================================
// REGISTRATION
// ============================================================

router.post(
  '/send-otp',
  otpSendLimiter,
  sendOTPValidation,
  validate,
  sendRegistrationOTP
);

router.post(
  '/verify-otp',
  otpVerifyLimiter,
  emailOTPValidation,
  validate,
  verifyRegistrationOTP
);

router.post(
  '/resend-otp',
  otpSendLimiter,
  emailOTPValidation.slice(0, 1),
  validate,
  resendRegistrationOTP
);

// ============================================================
// FORGOT PASSWORD
// ============================================================

router.post(
  '/forgot-password',
  otpSendLimiter,
  forgotPasswordValidation,
  validate,
  forgotPassword
);

router.post(
  '/verify-reset-otp',
  otpVerifyLimiter,
  emailOTPValidation,
  validate,
  verifyResetOTP
);

router.post(
  '/reset-password',
  otpVerifyLimiter,
  resetPasswordValidation,
  validate,
  resetPassword
);

// ============================================================
// LOGIN
// ============================================================

router.post(
  '/login',
  loginValidation,
  validate,
  loginUser
);

// ============================================================
// CURRENT USER
// ============================================================

router.get(
  '/me',
  protect,
  getMe
);

// ============================================================
// UPDATE USER PROFILE
// ============================================================

router.put(
  '/profile',
  protect,
  updateProfile
);

module.exports = router;