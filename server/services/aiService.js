const axios = require('axios');
const Product = require('../models/Product');
const Category = require('../models/Category');

// =====================================================
// Find REAL products from MongoDB based on user message
// =====================================================
const queryDatabaseProducts = async (message) => {
  try {
    const lowerMessage = message.toLowerCase();

    const query = {
      isActive: true,
      stock: { $gt: 0 },
    };

    const conditions = [];

    // -----------------------------
    // Budget detection
    // -----------------------------
    const budgetMatch =
      lowerMessage.match(/under\s*₹?\s*(\d+)/i) ||
      lowerMessage.match(/below\s*₹?\s*(\d+)/i) ||
      lowerMessage.match(/less than\s*₹?\s*(\d+)/i) ||
      lowerMessage.match(/within\s*₹?\s*(\d+)/i);

    if (budgetMatch) {
      const maxPrice = Number(budgetMatch[1]);

      query.$or = [
        { price: { $lte: maxPrice } },
        {
          discountPrice: {
            $gt: 0,
            $lte: maxPrice,
          },
        },
      ];
    }

    // -----------------------------
    // Category / keyword detection
    // -----------------------------
    const categoryKeywords = [
      'immunity',
      'kadha',
      'hair',
      'hair care',
      'haircare',
      'oil',
      'herbal oil',
      'skin',
      'skin care',
      'skincare',
      'powder',
      'medicine',
      'wellness',
      'tulsi',
      'ashwagandha',
      'giloy',
      'amla',
      'bhringraj',
      'triphala',
    ];

    const matchedKeyword = categoryKeywords.find((keyword) =>
      lowerMessage.includes(keyword)
    );

    if (matchedKeyword) {
      conditions.push(
        { name: { $regex: matchedKeyword, $options: 'i' } },
        { description: { $regex: matchedKeyword, $options: 'i' } },
        { shortDescription: { $regex: matchedKeyword, $options: 'i' } },
        { ingredients: { $regex: matchedKeyword, $options: 'i' } },
        { benefits: { $regex: matchedKeyword, $options: 'i' } },
        { brand: { $regex: matchedKeyword, $options: 'i' } }
      );

      // Try matching category also
      const category = await Category.findOne({
        $or: [
          { name: { $regex: matchedKeyword, $options: 'i' } },
          { slug: { $regex: matchedKeyword, $options: 'i' } },
        ],
      });

      if (category) {
        conditions.push({ category: category._id });
      }
    }

    // -----------------------------
    // Product search terms
    // -----------------------------
    const stopWords = [
      'show',
      'find',
      'search',
      'give',
      'me',
      'some',
      'best',
      'good',
      'products',
      'product',
      'please',
      'recommend',
      'recommendation',
      'want',
      'need',
      'buy',
      'available',
      'under',
      'below',
      'less',
      'than',
      'rupees',
      'rs',
      '₹',
      'for',
      'my',
      'the',
      'and',
      'with',
      'from',
      'about',
      'what',
      'which',
      'can',
      'you',
      'help',
    ];

    const searchWords = lowerMessage
      .replace(/[₹,!?]/g, ' ')
      .split(/\s+/)
      .filter(
        (word) =>
          word.length >= 3 &&
          !stopWords.includes(word) &&
          !/^\d+$/.test(word)
      );

    if (searchWords.length > 0 && !matchedKeyword) {
      searchWords.slice(0, 4).forEach((word) => {
        conditions.push(
          { name: { $regex: word, $options: 'i' } },
          { description: { $regex: word, $options: 'i' } },
          { ingredients: { $regex: word, $options: 'i' } },
          { benefits: { $regex: word, $options: 'i' } }
        );
      });
    }

    // Apply keyword conditions if available
    if (conditions.length > 0) {
      if (query.$or) {
        query.$and = [
          { $or: query.$or },
          { $or: conditions },
        ];
        delete query.$or;
      } else {
        query.$or = conditions;
      }
    }

    // -----------------------------
    // Get products
    // -----------------------------
    let products = await Product.find(query)
      .populate('category', 'name slug')
      .sort({
        featured: -1,
        rating: -1,
        createdAt: -1,
      })
      .limit(6);

    // If specific search returns nothing,
    // return popular products instead of fake products.
    if (products.length === 0) {
      products = await Product.find({
        isActive: true,
        stock: { $gt: 0 },
      })
        .populate('category', 'name slug')
        .sort({
          featured: -1,
          rating: -1,
          createdAt: -1,
        })
        .limit(6);
    }

    return products.map((product) => {
      const image =
        product.images && product.images.length > 0
          ? product.images[0]
          : '';

      const finalPrice =
        product.discountPrice &&
        product.discountPrice > 0 &&
        product.discountPrice < product.price
          ? product.discountPrice
          : product.price;

      return {
        _id: product._id,
        name: product.name,
        slug: product.slug,
        price: finalPrice,
        originalPrice: product.price,
        discountPrice: product.discountPrice || 0,
        rating: product.rating || 0,
        numReviews: product.numReviews || 0,
        stock: product.stock || 0,
        category: product.category
          ? {
              name: product.category.name,
              slug: product.category.slug,
            }
          : null,
        image,
        images: image ? [image] : [],
      };
    });
  } catch (error) {
    console.error(
      '❌ Error fetching products for Ayurveda AI:',
      error.message
    );

    return [];
  }
};

// =====================================================
// REAL OPENROUTER AI CHAT
// =====================================================
const processAIChat = async (message, user = null) => {
  try {
    const cleanMessage = message.trim();

    if (!cleanMessage) {
      throw new Error('Message cannot be empty');
    }

    // Get REAL products from MongoDB
    const products = await queryDatabaseProducts(cleanMessage);

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model =
      process.env.OPENROUTER_MODEL ||
      'meta-llama/llama-3.3-70b-instruct';

    // Do NOT use fake/mock fallback
    if (
      !apiKey ||
      apiKey.trim() === '' ||
      apiKey === 'your_openrouter_api_key_here'
    ) {
      throw new Error(
        'OpenRouter API key is not configured. Please add OPENROUTER_API_KEY to server/.env'
      );
    }

    // Only send useful product information to AI
    const productContext = products.map((product) => ({
      id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      rating: product.rating,
      reviews: product.numReviews,
      stock: product.stock,
      category: product.category?.name || 'Ayurvedic Wellness',
    }));

    const systemPrompt = `
You are "Ayurveda AI", the official shopping assistant for AyurvedaMart.

STORE:
AyurvedaMart is an Ayurvedic and natural wellness e-commerce store.

YOUR ROLE:
- Help customers discover products available in the store.
- Recommend products based ONLY on the real products provided below.
- Answer product, price, category and shopping questions.
- Be friendly, concise and natural.
- Speak in the same language as the customer when possible.
- If the customer uses Hinglish, you may respond in Hinglish.
- Never invent products, prices, discounts, stock or reviews.
- Never claim that a product is available if it is not in the provided data.
- If no exact product matches the request, politely explain that and recommend the closest available products.
- If a customer asks about price, use the current selling price.
- If originalPrice is higher than price, mention the discount naturally.
- Do not make medical diagnoses.
- Do not prescribe medicines or medical dosages.
- Do not claim that any product can cure a disease.
- For medical concerns, advise the customer to consult a qualified healthcare/Ayurvedic professional.
- You are a shopping assistant, not a doctor.

STORE POLICIES:
- Free shipping on orders above ₹999.
- 7-day return policy.
- Cash on Delivery is available.

REAL PRODUCTS FROM CURRENT DATABASE:
${JSON.stringify(productContext, null, 2)}

IMPORTANT:
The product cards shown to the customer come directly from MongoDB.
Only recommend products that appear in the REAL PRODUCTS list.
`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: cleanMessage,
          },
        ],
        temperature: 0.6,
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer':
            process.env.CLIENT_URL || 'http://localhost:5173',
          'X-Title': 'AyurvedaMart AI Assistant',
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const reply =
      response.data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      throw new Error('OpenRouter returned an empty response');
    }

    return {
      reply,
      products,
    };
  } catch (error) {
    console.error(
      '❌ Ayurveda AI Error:',
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.error?.message ||
        error.message ||
        'Unable to connect to Ayurveda AI'
    );
  }
};

module.exports = {
  processAIChat,
};