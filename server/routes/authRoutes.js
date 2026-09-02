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

/* ============================================================
   SWAGGER SCHEMAS
============================================================ */

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       properties:
 *         street:
 *           type: string
 *           example: House No. 12, Hiran Magri
 *         city:
 *           type: string
 *           example: Udaipur
 *         state:
 *           type: string
 *           example: Rajasthan
 *         pincode:
 *           type: string
 *           example: "313001"
 *
 *     SendOTPRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: Denim Purbia
 *         email:
 *           type: string
 *           format: email
 *           example: denim@example.com
 *         phone:
 *           type: string
 *           example: "7023768853"
 *         password:
 *           type: string
 *           format: password
 *           example: Password123
 *
 *     VerifyOTPRequest:
 *       type: object
 *       required:
 *         - email
 *         - otp
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: denim@example.com
 *         otp:
 *           type: string
 *           example: "123456"
 *
 *     ForgotPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: denim@example.com
 *
 *     ResetPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *         - otp
 *         - newPassword
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: denim@example.com
 *         otp:
 *           type: string
 *           example: "123456"
 *         newPassword:
 *           type: string
 *           format: password
 *           example: NewPassword123
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: denim@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: Password123
 *
 *     UpdateProfileRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Denim Purbia
 *         phone:
 *           type: string
 *           example: "7023768853"
 *         address:
 *           $ref: '#/components/schemas/Address'
 */

/* ============================================================
   REGISTRATION
============================================================ */

/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: Send registration OTP
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendOTPRequest'
 *     responses:
 *       200:
 *         description: Verification OTP sent successfully
 *       400:
 *         description: Invalid request or user already exists
 *       429:
 *         description: Too many OTP requests
 */
router.post(
  '/send-otp',
  otpSendLimiter,
  sendOTPValidation,
  validate,
  sendRegistrationOTP
);

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify registration OTP and create user account
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOTPRequest'
 *     responses:
 *       201:
 *         description: Registration completed successfully
 *       400:
 *         description: Invalid or expired OTP
 */
router.post(
  '/verify-otp',
  otpVerifyLimiter,
  emailOTPValidation,
  validate,
  verifyRegistrationOTP
);

/**
 * @swagger
 * /api/auth/resend-otp:
 *   post:
 *     summary: Resend registration OTP
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: denim@example.com
 *     responses:
 *       200:
 *         description: New OTP sent successfully
 *       400:
 *         description: Registration session not found
 */
router.post(
  '/resend-otp',
  otpSendLimiter,
  emailOTPValidation.slice(0, 1),
  validate,
  resendRegistrationOTP
);

/* ============================================================
   FORGOT PASSWORD
============================================================ */

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Send password reset OTP
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset OTP sent
 */
router.post(
  '/forgot-password',
  otpSendLimiter,
  forgotPasswordValidation,
  validate,
  forgotPassword
);

/**
 * @swagger
 * /api/auth/verify-reset-otp:
 *   post:
 *     summary: Verify password reset OTP
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOTPRequest'
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 */
router.post(
  '/verify-reset-otp',
  otpVerifyLimiter,
  emailOTPValidation,
  validate,
  verifyResetOTP
);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid request or OTP
 */
router.post(
  '/reset-password',
  otpVerifyLimiter,
  resetPasswordValidation,
  validate,
  resetPassword
);

/* ============================================================
   LOGIN
============================================================ */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 *       403:
 *         description: User account is deactivated
 */
router.post(
  '/login',
  loginValidation,
  validate,
  loginUser
);

/* ============================================================
   CURRENT USER
============================================================ */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current logged-in user profile
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get(
  '/me',
  protect,
  getMe
);

/* ============================================================
   UPDATE CURRENT USER PROFILE
============================================================ */

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update current logged-in user profile and address
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put(
  '/profile',
  protect,
  updateProfile
);

module.exports = router;