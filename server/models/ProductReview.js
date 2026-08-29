const mongoose = require('mongoose');

const productReviewSchema = new mongoose.Schema(
  {
    // Review kis user ne diya
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Review kis product ke liye hai
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    // Kis order ke through product purchase hua
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },

    // Star rating
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // Review text
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    // User uploaded review images
    images: [
      {
        type: String,
      },
    ],

    // Genuine buyer verification
    verifiedBuyer: {
      type: Boolean,
      default: true,
    },

    // Admin approval
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Ek user ek hi order ke same product ko dobara review nahi kar sakta
productReviewSchema.index(
  { user: 1, product: 1, order: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  'ProductReview',
  productReviewSchema
);