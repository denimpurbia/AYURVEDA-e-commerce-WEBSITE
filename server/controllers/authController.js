const bcrypt = require('bcryptjs');
const User = require('../models/User');
const EmailVerification = require('../models/EmailVerification');
const PasswordReset = require('../models/PasswordReset');
const generateToken = require('../utils/generateToken');

const {
  sendVerificationOTP,
  sendPasswordResetOTP,
} = require('../services/emailService');

const {
  successResponse,
  errorResponse,
} = require('../utils/apiResponse');

// ============================================================
// GENERATE 6-DIGIT OTP
// ============================================================

const generateOTP = () => {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
};

// ============================================================
// REGISTER - SEND OTP
// POST /api/auth/send-otp
// ============================================================

const sendRegistrationOTP = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return errorResponse(
        res,
        400,
        'Please provide name, email, and password'
      );
    }

    if (password.length < 6) {
      return errorResponse(
        res,
        400,
        'Password must be at least 6 characters'
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const userExists = await User.findOne({
      email: normalizedEmail,
    });

    if (userExists) {
      return errorResponse(
        res,
        400,
        'User with this email already exists'
      );
    }

    await EmailVerification.deleteMany({
      email: normalizedEmail,
    });

    const otp = generateOTP();

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const expiresAt = new Date(
      Date.now() + 5 * 60 * 1000
    );

    await EmailVerification.create({
      email: normalizedEmail,
      otp,
      registrationData: {
        name: name.trim(),
        phone: phone || '',
        password: hashedPassword,
      },
      expiresAt,
    });

    await sendVerificationOTP(
      normalizedEmail,
      otp
    );

    return successResponse(
      res,
      200,
      'Verification OTP sent successfully',
      {
        email: normalizedEmail,
        expiresIn: 300,
      }
    );
  } catch (error) {
    console.error(
      'Send Registration OTP Error:',
      error
    );

    next(error);
  }
};

// ============================================================
// REGISTER - VERIFY OTP
// POST /api/auth/verify-otp
// ============================================================

const verifyRegistrationOTP = async (
  req,
  res,
  next
) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return errorResponse(
        res,
        400,
        'Email and OTP are required'
      );
    }

    const normalizedEmail = email
      .toLowerCase()
      .trim();

    const verification =
      await EmailVerification.findOne({
        email: normalizedEmail,
      });

    if (!verification) {
      return errorResponse(
        res,
        400,
        'OTP not found or expired. Please request a new OTP.'
      );
    }

    if (verification.expiresAt < new Date()) {
      await EmailVerification.deleteOne({
        _id: verification._id,
      });

      return errorResponse(
        res,
        400,
        'OTP has expired. Please request a new OTP.'
      );
    }

    if (
      verification.otp !==
      otp.toString().trim()
    ) {
      return errorResponse(
        res,
        400,
        'Invalid OTP. Please check the OTP and try again.'
      );
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      await EmailVerification.deleteOne({
        _id: verification._id,
      });

      return errorResponse(
        res,
        400,
        'User with this email already exists'
      );
    }

    const user = await User.create({
      name: verification.registrationData.name,
      email: normalizedEmail,
      phone:
        verification.registrationData.phone || '',
      password:
        verification.registrationData.password,
      role: 'user',
    });

    await EmailVerification.deleteOne({
      _id: verification._id,
    });

    const token = generateToken(
      user._id,
      user.role
    );

    return successResponse(
      res,
      201,
      'Email verified and registration successful',
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        token,
      }
    );
  } catch (error) {
    console.error(
      'Verify Registration OTP Error:',
      error
    );

    next(error);
  }
};

// ============================================================
// REGISTER - RESEND OTP
// POST /api/auth/resend-otp
// ============================================================

const resendRegistrationOTP = async (
  req,
  res,
  next
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(
        res,
        400,
        'Email is required'
      );
    }

    const normalizedEmail = email
      .toLowerCase()
      .trim();

    const verification =
      await EmailVerification.findOne({
        email: normalizedEmail,
      });

    if (!verification) {
      return errorResponse(
        res,
        400,
        'Registration session not found. Please register again.'
      );
    }

    const otp = generateOTP();

    verification.otp = otp;

    verification.expiresAt = new Date(
      Date.now() + 5 * 60 * 1000
    );

    await verification.save();

    await sendVerificationOTP(
      normalizedEmail,
      otp
    );

    return successResponse(
      res,
      200,
      'A new OTP has been sent to your email',
      {
        email: normalizedEmail,
        expiresIn: 300,
      }
    );
  } catch (error) {
    console.error(
      'Resend Registration OTP Error:',
      error
    );

    next(error);
  }
};

// ============================================================
// FORGOT PASSWORD - SEND OTP
// POST /api/auth/forgot-password
// ============================================================

const forgotPassword = async (
  req,
  res,
  next
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(
        res,
        400,
        'Please provide your email'
      );
    }

    const normalizedEmail = email
      .toLowerCase()
      .trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return successResponse(
        res,
        200,
        'If an account exists with this email, a reset OTP has been sent.'
      );
    }

    await PasswordReset.deleteMany({
      email: normalizedEmail,
    });

    const otp = generateOTP();

    const expiresAt = new Date(
      Date.now() + 5 * 60 * 1000
    );

    await PasswordReset.create({
      email: normalizedEmail,
      otp,
      expiresAt,
    });

    await sendPasswordResetOTP(
      normalizedEmail,
      otp
    );

    return successResponse(
      res,
      200,
      'Password reset OTP sent successfully',
      {
        email: normalizedEmail,
        expiresIn: 300,
      }
    );
  } catch (error) {
    console.error(
      'Forgot Password Error:',
      error
    );

    next(error);
  }
};

// ============================================================
// FORGOT PASSWORD - VERIFY OTP
// POST /api/auth/verify-reset-otp
// ============================================================

const verifyResetOTP = async (
  req,
  res,
  next
) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return errorResponse(
        res,
        400,
        'Email and OTP are required'
      );
    }

    const normalizedEmail = email
      .toLowerCase()
      .trim();

    const resetRequest =
      await PasswordReset.findOne({
        email: normalizedEmail,
      });

    if (!resetRequest) {
      return errorResponse(
        res,
        400,
        'OTP not found or expired. Please request a new OTP.'
      );
    }

    if (resetRequest.expiresAt < new Date()) {
      await PasswordReset.deleteOne({
        _id: resetRequest._id,
      });

      return errorResponse(
        res,
        400,
        'OTP has expired. Please request a new OTP.'
      );
    }

    if (
      resetRequest.otp !==
      otp.toString().trim()
    ) {
      return errorResponse(
        res,
        400,
        'Invalid OTP. Please check the OTP and try again.'
      );
    }

    return successResponse(
      res,
      200,
      'OTP verified successfully',
      {
        email: normalizedEmail,
      }
    );
  } catch (error) {
    console.error(
      'Verify Reset OTP Error:',
      error
    );

    next(error);
  }
};

// ============================================================
// FORGOT PASSWORD - RESET PASSWORD
// POST /api/auth/reset-password
// ============================================================

const resetPassword = async (
  req,
  res,
  next
) => {
  try {
    const {
      email,
      otp,
      newPassword,
    } = req.body;

    if (!email || !otp || !newPassword) {
      return errorResponse(
        res,
        400,
        'Email, OTP and new password are required'
      );
    }

    if (newPassword.length < 6) {
      return errorResponse(
        res,
        400,
        'Password must be at least 6 characters'
      );
    }

    const normalizedEmail = email
      .toLowerCase()
      .trim();

    const resetRequest =
      await PasswordReset.findOne({
        email: normalizedEmail,
      });

    if (!resetRequest) {
      return errorResponse(
        res,
        400,
        'OTP not found or expired. Please request a new OTP.'
      );
    }

    if (resetRequest.expiresAt < new Date()) {
      await PasswordReset.deleteOne({
        _id: resetRequest._id,
      });

      return errorResponse(
        res,
        400,
        'OTP has expired. Please request a new OTP.'
      );
    }

    if (
      resetRequest.otp !==
      otp.toString().trim()
    ) {
      return errorResponse(
        res,
        400,
        'Invalid OTP'
      );
    }

    const user = await User.findOne({
      email: normalizedEmail,
    }).select('+password');

    if (!user) {
      await PasswordReset.deleteOne({
        _id: resetRequest._id,
      });

      return errorResponse(
        res,
        400,
        'Unable to reset password'
      );
    }

    user.password = newPassword;

    await user.save();

    await PasswordReset.deleteOne({
      _id: resetRequest._id,
    });

    return successResponse(
      res,
      200,
      'Password reset successful. You can now login with your new password.'
    );
  } catch (error) {
    console.error(
      'Reset Password Error:',
      error
    );

    next(error);
  }
};

// ============================================================
// LOGIN
// POST /api/auth/login
// ============================================================

const loginUser = async (
  req,
  res,
  next
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(
        res,
        400,
        'Please provide email and password'
      );
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select('+password');

    if (
      !user ||
      !(await user.matchPassword(password))
    ) {
      return errorResponse(
        res,
        401,
        'Invalid email or password'
      );
    }

    if (!user.isActive) {
      return errorResponse(
        res,
        403,
        'Your account has been deactivated. Please contact support.'
      );
    }

    const token = generateToken(
      user._id,
      user.role
    );

    return successResponse(
      res,
      200,
      'Login successful',
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        token,
      }
    );
  } catch (error) {
    console.error(
      'Login Error:',
      error
    );

    next(error);
  }
};

// ============================================================
// GET CURRENT USER
// GET /api/auth/me
// ============================================================

const getMe = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return errorResponse(
        res,
        404,
        'User not found'
      );
    }

    return successResponse(
      res,
      200,
      'User profile fetched',
      user
    );
  } catch (error) {
    console.error(
      'Get Profile Error:',
      error
    );

    next(error);
  }
};

// ============================================================
// UPDATE CURRENT USER PROFILE
// PUT /api/auth/profile
// ============================================================

const updateProfile = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      phone,
      address,
    } = req.body;

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return errorResponse(
        res,
        404,
        'User not found'
      );
    }

    // UPDATE NAME
    if (
      name !== undefined &&
      typeof name === 'string' &&
      name.trim()
    ) {
      user.name = name.trim();
    }

    // UPDATE PHONE
    if (
      phone !== undefined &&
      typeof phone === 'string'
    ) {
      user.phone = phone.trim();
    }

    // UPDATE ADDRESS
    if (address) {
      const currentAddress =
        user.address || {};

      user.address = {
        street:
          address.street !== undefined
            ? String(address.street).trim()
            : currentAddress.street || '',

        city:
          address.city !== undefined
            ? String(address.city).trim()
            : currentAddress.city || '',

        state:
          address.state !== undefined
            ? String(address.state).trim()
            : currentAddress.state || '',

        pincode:
          address.pincode !== undefined
            ? String(address.pincode).trim()
            : currentAddress.pincode || '',
      };

      user.markModified('address');
    }

    await user.save();

    return successResponse(
      res,
      200,
      'Profile updated successfully',
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
      }
    );
  } catch (error) {
    console.error(
      'Update Profile Error:',
      error
    );

    next(error);
  }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  sendRegistrationOTP,
  verifyRegistrationOTP,
  resendRegistrationOTP,

  forgotPassword,
  verifyResetOTP,
  resetPassword,

  loginUser,
  getMe,
  updateProfile,
};