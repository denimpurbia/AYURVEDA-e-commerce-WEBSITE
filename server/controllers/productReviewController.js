// ==========================================
// ADMIN: GET ALL PRODUCT REVIEWS
// ==========================================
// GET /api/product-reviews/admin/all
// ==========================================

const getAllProductReviews = async (
  req,
  res,
  next
) => {
  try {
    const reviews =
      await ProductReview.find()
        .populate(
          'user',
          'name email'
        )
        .populate(
          'product',
          'name images'
        )
        .sort({
          createdAt: -1,
        });

    return successResponse(
      res,
      200,
      'All product reviews retrieved successfully',
      reviews
    );

  } catch (error) {
    next(error);
  }
};