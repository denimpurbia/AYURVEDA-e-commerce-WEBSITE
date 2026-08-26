const mongoose = require('mongoose');

const emailVerificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    otp: {
      type: String,
      required: true,
    },

    registrationData: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        default: '',
      },
      password: {
        type: String,
        required: true,
      },
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  'EmailVerification',
  emailVerificationSchema
);