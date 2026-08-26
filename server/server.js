const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

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

  // Production Client
  'https://ayurveda-e-commerce-website-fc81su9es-denimpurbias-projects.vercel.app',

  // Production Admin
  'https://ayurvedamart-admin.vercel.app',

  // Environment variables
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without Origin
      // e.g. Postman/server-to-server
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`CORS blocked origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
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
  })
);

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
  express.static(path.join(__dirname, 'uploads'))
);

/* ============================================================
   HEALTH CHECK
============================================================ */

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🌿 AYURVEDAMART API Server is running smoothly',
    timestamp: new Date(),
  });
});

/* ============================================================
   API ROUTES
============================================================ */

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

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