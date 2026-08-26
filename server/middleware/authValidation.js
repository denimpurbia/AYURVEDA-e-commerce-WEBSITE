const { body } = require('express-validator');

const emailValidation = body('email')
  .trim()
  .normalizeEmail()
  .isEmail()
  .withMessage('Please provide a valid email address');

const passwordValidation = body('password')
  .isString()
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters');

const newPasswordValidation = body('newPassword')
  .isString()
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters');

const otpValidation = body('otp')
  .trim()
  .matches(/^\d{6}$/)
  .withMessage('OTP must be exactly 6 digits');

const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  emailValidation,

  body('phone')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 20 })
    .withMessage('Phone number is too long'),

  passwordValidation,
];

const loginValidation = [
  emailValidation,
  passwordValidation,
];

const sendOTPValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),

  emailValidation,

  body('phone')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 20 })
    .withMessage('Phone number is too long'),

  passwordValidation,
];

const emailOTPValidation = [
  emailValidation,
  otpValidation,
];

const forgotPasswordValidation = [
  emailValidation,
];

const resetPasswordValidation = [
  emailValidation,
  otpValidation,
  newPasswordValidation,
];

module.exports = {
  registerValidation,
  loginValidation,
  sendOTPValidation,
  emailOTPValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};