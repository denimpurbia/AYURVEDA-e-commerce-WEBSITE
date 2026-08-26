/* ============================================================
   CORS CONFIGURATION
============================================================ */

const allowedOrigins = [
  // Local development
  'http://localhost:5173',
  'http://localhost:5174',

  // Production - Client
  'https://ayurveda-e-commerce-website-fc81su9es-denimpurbias-projects.vercel.app',
  'https://ayurvedamart.vercel.app',

  // Production - Admin
  'https://ayurvedamart-admin-acu8s2sqt-denimpurbias-projects.vercel.app',
  'https://ayurvedamart-admin.vercel.app',

  // Environment variables
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests without an Origin header
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`❌ CORS blocked origin: ${origin}`);
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
};

app.use(cors(corsOptions));

// Explicitly handle browser preflight requests
app.options(/.*/, cors(corsOptions));