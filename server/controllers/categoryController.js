const Category = require('../models/Category');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// Helper to generate slug
const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// ==========================================
// GET ALL CATEGORIES
// ==========================================
// GET /api/categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({
      isActive: true,
    }).sort({
      name: 1,
    });

    return successResponse(
      res,
      200,
      'Categories retrieved successfully',
      categories
    );
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET CATEGORY BY ID OR SLUG
// ==========================================
// GET /api/categories/:idOrSlug
const getCategoryByIdOrSlug = async (
  req,
  res,
  next
) => {
  try {
    const { idOrSlug } = req.params;

    let category;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(idOrSlug);
    } else {
      category = await Category.findOne({
        slug: idOrSlug,
      });
    }

    if (!category) {
      return errorResponse(
        res,
        404,
        'Category not found'
      );
    }

    return successResponse(
      res,
      200,
      'Category retrieved',
      category
    );
  } catch (error) {
    next(error);
  }
};

// ==========================================
// CREATE CATEGORY
// ==========================================
// POST /api/categories
const createCategory = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      description,
      image,
    } = req.body;

    if (!name) {
      return errorResponse(
        res,
        400,
        'Category name is required'
      );
    }

    const slug = createSlug(name);

    const existingCategory =
      await Category.findOne({
        slug,
      });

    if (existingCategory) {
      return errorResponse(
        res,
        400,
        'Category with this name already exists'
      );
    }

    // Only image provided from Admin Panel will be saved.
    // No Unsplash fallback image.
    const category = await Category.create({
      name,
      slug,
      description: description || '',
      image: image || '',
    });

    return successResponse(
      res,
      201,
      'Category created successfully',
      category
    );
  } catch (error) {
    next(error);
  }
};

// ==========================================
// UPDATE CATEGORY
// ==========================================
// PUT /api/categories/:id
const updateCategory = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      description,
      image,
      isActive,
    } = req.body;

    const category =
      await Category.findById(
        req.params.id
      );

    if (!category) {
      return errorResponse(
        res,
        404,
        'Category not found'
      );
    }

    if (name) {
      category.name = name;
      category.slug = createSlug(name);
    }

    if (description !== undefined) {
      category.description =
        description;
    }

    // Only update image when Admin Panel sends an image
    if (image !== undefined) {
      category.image =
        image || '';
    }

    if (isActive !== undefined) {
      category.isActive =
        isActive;
    }

    const updatedCategory =
      await category.save();

    return successResponse(
      res,
      200,
      'Category updated successfully',
      updatedCategory
    );
  } catch (error) {
    next(error);
  }
};

// ==========================================
// DELETE CATEGORY
// ==========================================
// DELETE /api/categories/:id
const deleteCategory = async (
  req,
  res,
  next
) => {
  try {
    const category =
      await Category.findById(
        req.params.id
      );

    if (!category) {
      return errorResponse(
        res,
        404,
        'Category not found'
      );
    }

    await category.deleteOne();

    return successResponse(
      res,
      200,
      'Category deleted successfully'
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryByIdOrSlug,
  createCategory,
  updateCategory,
  deleteCategory,
};