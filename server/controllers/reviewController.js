const Review = require(
  '../models/Review'
);

const {
  successResponse,
  errorResponse,
} = require(
  '../utils/apiResponse'
);


// =====================================================
// WEBSITE EXPERIENCE REVIEWS
// =====================================================


// =====================================================
// CUSTOMER: CREATE WEBSITE REVIEW
// =====================================================
// POST /api/reviews
// =====================================================

const createReview = async (
  req,
  res,
  next
) => {
  try {
    const {
      rating,
      comment,
    } = req.body;


    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      !rating ||
      !comment
    ) {
      return errorResponse(
        res,
        400,
        'Please provide rating and comment'
      );
    }


    // Validate rating

    if (
      Number(rating) < 1 ||
      Number(rating) > 5
    ) {
      return errorResponse(
        res,
        400,
        'Rating must be between 1 and 5'
      );
    }


    // ==========================================
    // CHECK EXISTING REVIEW
    // ==========================================

    const alreadyReviewed =
      await Review.findOne({
        user: req.user._id,
      });


    if (
      alreadyReviewed
    ) {
      return errorResponse(
        res,
        400,
        'You have already submitted a website review'
      );
    }


    // ==========================================
    // CREATE REVIEW
    // ==========================================

    const review =
      await Review.create({
        user: req.user._id,

        rating:
          Number(rating),

        comment:
          comment.trim(),

        status:
          'pending',

        verifiedBuyer:
          true,
      });


    // Populate user information

    const populatedReview =
      await Review.findById(
        review._id
      )
        .populate(
          'user',
          'name email'
        );


    return successResponse(
      res,
      201,
      'Thank you! Your review has been submitted for admin approval.',
      populatedReview
    );

  } catch (error) {
    next(error);
  }
};


// =====================================================
// PUBLIC: GET APPROVED WEBSITE REVIEWS
// =====================================================
// GET /api/reviews
// =====================================================

const getApprovedReviews =
  async (
    req,
    res,
    next
  ) => {
    try {

      const reviews =
        await Review.find({
          status:
            'approved',
        })
          .populate(
            'user',
            'name'
          )
          .sort({
            createdAt:
              -1,
          });


      return successResponse(
        res,
        200,
        'Approved reviews retrieved successfully',
        reviews
      );

    } catch (error) {
      next(error);
    }
  };


// =====================================================
// ADMIN: GET ALL WEBSITE REVIEWS
// =====================================================
// GET /api/reviews/admin/all
// =====================================================

const getAllReviews =
  async (
    req,
    res,
    next
  ) => {
    try {

      const reviews =
        await Review.find()
          .populate(
            'user',
            'name email'
          )
          .sort({
            createdAt:
              -1,
          });


      return successResponse(
        res,
        200,
        'All website reviews retrieved successfully',
        reviews
      );

    } catch (error) {
      next(error);
    }
  };


// =====================================================
// ADMIN: APPROVE WEBSITE REVIEW
// =====================================================
// PUT /api/reviews/:id/approve
// =====================================================

const approveReview =
  async (
    req,
    res,
    next
  ) => {
    try {

      const review =
        await Review.findById(
          req.params.id
        );


      if (
        !review
      ) {
        return errorResponse(
          res,
          404,
          'Website review not found'
        );
      }


      review.status =
        'approved';


      await review.save();


      const updatedReview =
        await Review.findById(
          review._id
        )
          .populate(
            'user',
            'name email'
          );


      return successResponse(
        res,
        200,
        'Website review approved successfully',
        updatedReview
      );

    } catch (error) {
      next(error);
    }
  };


// =====================================================
// ADMIN: REJECT WEBSITE REVIEW
// =====================================================
// PUT /api/reviews/:id/reject
// =====================================================

const rejectReview =
  async (
    req,
    res,
    next
  ) => {
    try {

      const review =
        await Review.findById(
          req.params.id
        );


      if (
        !review
      ) {
        return errorResponse(
          res,
          404,
          'Website review not found'
        );
      }


      review.status =
        'rejected';


      await review.save();


      const updatedReview =
        await Review.findById(
          review._id
        )
          .populate(
            'user',
            'name email'
          );


      return successResponse(
        res,
        200,
        'Website review rejected successfully',
        updatedReview
      );

    } catch (error) {
      next(error);
    }
  };


// =====================================================
// ADMIN: DELETE WEBSITE REVIEW
// =====================================================
// DELETE /api/reviews/:id
// =====================================================

const deleteReview =
  async (
    req,
    res,
    next
  ) => {
    try {

      const review =
        await Review.findById(
          req.params.id
        );


      if (
        !review
      ) {
        return errorResponse(
          res,
          404,
          'Website review not found'
        );
      }


      await review.deleteOne();


      return successResponse(
        res,
        200,
        'Website review deleted successfully'
      );

    } catch (error) {
      next(error);
    }
  };


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  createReview,
  getApprovedReviews,
  getAllReviews,
  approveReview,
  rejectReview,
  deleteReview,
};