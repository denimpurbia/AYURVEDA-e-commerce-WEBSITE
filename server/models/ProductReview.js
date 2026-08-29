const mongoose = require('mongoose');

const productReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    images: [
      {
        type: String,
      },
    ],

    verifiedBuyer: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

productReviewSchema.index(
  {
    user: 1,
    product: 1,
    order: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  'ProductReview',
  productReviewSchema
);