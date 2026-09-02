const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');

const {
  notFound,
  errorHandler,
} = require('./middleware/errorMiddleware');

// ==========================================
// ROUTE IMPORTS
// ==========================================

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');

// General Website Reviews
const reviewRoutes = require('./routes/reviewRoutes');

// Product Reviews
const productReviewRoutes = require('./routes/productReviewRoutes');

const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

/* ============================================================
   RENDER / PROXY CONFIGURATION
============================================================ */

app.set('trust proxy', 1);

/* ============================================================
   SECURITY HEADERS
============================================================ */

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin',
    },
  })
);

/* ============================================================
   CORS CONFIGURATION
============================================================ */

const allowedOrigins = [
  // Local development
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5000',

  // Production Client
  'https://ayurveda-e-commerce-website.vercel.app',

  // Production Admin
  'https://ayurvedamart-admin.vercel.app',

  // Vercel project deployment URL
  'https://ayurveda-e-commerce-website-fc81su9es-denimpurbias-projects.vercel.app',

  // Environment variables
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
].filter(Boolean);

const isAllowedVercelPreview = (origin) => {
  if (!origin) return false;

  try {
    const url = new URL(origin);

    if (url.protocol !== 'https:') {
      return false;
    }

    // Admin preview deployments
    if (
      /^ayurvedamart-admin-[a-z0-9-]+-denimpurbias-projects\.vercel\.app$/i.test(
        url.hostname
      )
    ) {
      return true;
    }

    // Client preview deployments
    if (
      /^ayurveda-e-commerce-website-[a-z0-9-]+-denimpurbias-projects\.vercel\.app$/i.test(
        url.hostname
      )
    ) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
};

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no Origin header
    // Example: Postman, server-to-server requests
    if (!origin) {
      return callback(null, true);
    }

    // Allow Swagger running from the same backend
    if (
      origin === 'http://localhost:5000' ||
      origin === 'http://127.0.0.1:5000'
    ) {
      return callback(null, true);
    }

    // Exact allowed origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Vercel preview deployments
    if (isAllowedVercelPreview(origin)) {
      return callback(null, true);
    }

    console.warn(`CORS blocked origin: ${origin}`);

    return callback(
      new Error(`Not allowed by CORS: ${origin}`)
    );
  },

  credentials: true,

  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
  ],

  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

/* ============================================================
   BODY PARSING
============================================================ */

app.use(
  express.json({
    limit: '1mb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '1mb',
  })
);

/* ============================================================
   MONGODB INJECTION PROTECTION
============================================================ */

app.use(mongoSanitize());

/* ============================================================
   GLOBAL RATE LIMIT
============================================================ */

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 300,

  standardHeaders: 'draft-8',

  legacyHeaders: false,

  message: {
    success: false,
    message:
      'Too many requests from this IP. Please try again later.',
  },
});

app.use('/api', globalLimiter);

/* ============================================================
   AUTH RATE LIMIT
============================================================ */

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 30,

  standardHeaders: 'draft-8',

  legacyHeaders: false,

  message: {
    success: false,
    message:
      'Too many authentication requests. Please try again later.',
  },
});

app.use('/api/auth', authLimiter);

/* ============================================================
   STATIC UPLOADS
============================================================ */

app.use(
  '/uploads',
  express.static(
    path.join(__dirname, 'uploads')
  )
);

/* ============================================================
   HEALTH CHECK
============================================================ */

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message:
      '🌿 AYURVEDAMART API Server is running smoothly',
    timestamp: new Date(),
  });
});

/* ============================================================
   API ROUTES
============================================================ */

// Authentication
app.use('/api/auth', authRoutes);

// Products
app.use('/api/products', productRoutes);

// Categories
app.use('/api/categories', categoryRoutes);

// Cart
app.use('/api/cart', cartRoutes);

// Wishlist
app.use('/api/wishlist', wishlistRoutes);

// Orders
app.use('/api/orders', orderRoutes);

// General Website Reviews
app.use('/api/reviews', reviewRoutes);

// Product Reviews
app.use(
  '/api/product-reviews',
  productReviewRoutes
);

// Users
app.use('/api/users', userRoutes);

// Chat
app.use('/api/chat', chatRoutes);

// Contact Messages
app.use('/api/contact', contactRoutes);

/* ============================================================
   ERROR HANDLING
============================================================ */

app.use(notFound);

app.use(errorHandler);

/* ============================================================
   START SERVER
============================================================ */

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `🚀 AYURVEDAMART Server running on port ${PORT} in ${
          process.env.NODE_ENV || 'development'
        } mode`
      );

      console.log(
        '🛡️ Security: Helmet + CORS + Rate Limiting + MongoDB Sanitization enabled'
      );
    });
  })
  .catch((error) => {
    console.error(
      '❌ Failed to start server:',
      error.message
    );

    process.exit(1);
  });