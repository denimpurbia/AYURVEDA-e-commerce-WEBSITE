const Product = require('../models/Product');
const Category = require('../models/Category');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-') + '-' + Math.floor(100 + Math.random() * 900);
};

// @desc    Get all products with filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const {
      keyword,
      category,
      categorySlug,
      minPrice,
      maxPrice,
      rating,
      featured,
      inStock,
      sort,
    } = req.query;

    const query = { isActive: true };

    // Search Keyword
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { shortDescription: { $regex: keyword, $options: 'i' } },
        { ingredients: { $regex: keyword, $options: 'i' } },
        { brand: { $regex: keyword, $options: 'i' } },
      ];
    }

    // Category filter by ID or Slug
    if (category) {
      query.category = category;
    } else if (categorySlug) {
      const foundCat = await Category.findOne({ slug: categorySlug });
      if (foundCat) {
        query.category = foundCat._id;
      }
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Rating
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // Featured
    if (featured === 'true') {
      query.featured = true;
    }

    // Stock availability
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'rating-desc') sortOption = { rating: -1 };
    else if (sort === 'oldest') sortOption = { createdAt: 1 };

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    return successResponse(res, 200, 'Products retrieved successfully', products, {
      total: totalProducts,
      page,
      pages: Math.ceil(totalProducts / limit),
      limit,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product details by ID or Slug
// @route   GET /api/products/:idOrSlug
// @access  Public
const getProductByIdOrSlug = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    let product;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(idOrSlug).populate('category', 'name slug');
    } else {
      product = await Product.findOne({ slug: idOrSlug }).populate('category', 'name slug');
    }

    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    return successResponse(res, 200, 'Product details retrieved', product);
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      category,
      brand,
      price,
      discountPrice,
      images,
      description,
      shortDescription,
      ingredients,
      benefits,
      usage,
      storageInstructions,
      weight,
      stock,
      sku,
      featured,
    } = req.body;

    if (!name || !category || !price || !description || !sku) {
      return errorResponse(res, 400, 'Please fill in all required fields (name, category, price, description, sku)');
    }

    const existingSku = await Product.findOne({ sku });
    if (existingSku) {
      return errorResponse(res, 400, 'Product with this SKU already exists');
    }

    const slug = createSlug(name);

    const product = await Product.create({
      name,
      slug,
      category,
      brand: brand || 'AyurvedaMart',
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600'],
      description,
      shortDescription: shortDescription || '',
      ingredients: Array.isArray(ingredients) ? ingredients : ingredients ? ingredients.split(',').map(i => i.trim()) : [],
      benefits: Array.isArray(benefits) ? benefits : benefits ? benefits.split(',').map(b => b.trim()) : [],
      usage: usage || 'Take as directed on package or consult an Ayurvedic practitioner.',
      storageInstructions: storageInstructions || 'Store in a cool, dry place away from direct sunlight.',
      weight: weight || '100g',
      stock: stock !== undefined ? Number(stock) : 10,
      sku,
      featured: Boolean(featured),
    });

    const populated = await Product.findById(product._id).populate('category', 'name slug');
    return successResponse(res, 201, 'Product created successfully', populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    const fields = [
      'name', 'category', 'brand', 'price', 'discountPrice', 'images',
      'description', 'shortDescription', 'ingredients', 'benefits',
      'usage', 'storageInstructions', 'weight', 'stock', 'sku', 'featured', 'isActive'
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'ingredients' || field === 'benefits') {
          product[field] = Array.isArray(req.body[field]) ? req.body[field] : req.body[field].split(',').map(item => item.trim());
        } else {
          product[field] = req.body[field];
        }
      }
    });

    if (req.body.name && req.body.name !== product.name) {
      product.slug = createSlug(req.body.name);
    }

    const updated = await product.save();
    const populated = await Product.findById(updated._id).populate('category', 'name slug');

    return successResponse(res, 200, 'Product updated successfully', populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    await product.deleteOne();
    return successResponse(res, 200, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
