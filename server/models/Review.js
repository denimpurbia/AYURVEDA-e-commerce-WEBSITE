const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    // User who submitted the website experience review
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Overall website experience rating
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // Customer's website experience
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 2000,
    },

    // Admin moderation status
    status: {
      type: String,
      enum: [
        'pending',
        'approved',
        'rejected',
      ],
      default: 'pending',
    },

    // Authenticated customer
    verifiedBuyer: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


// One user can submit one website experience review
reviewSchema.index(
  {
    user: 1,
  },
  {
    unique: true,
  }
);


module.exports = mongoose.model(
  'Review',
  reviewSchema
);