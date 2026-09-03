# 🌿 AYURVEDAMART

## Complete MERN Stack E-Commerce Platform

> **AUTHENTIC AYURVEDA. NATURAL WELLNESS.**

AYURVEDAMART is a full-stack MERN e-commerce platform designed for discovering and purchasing Ayurvedic and natural wellness products. It combines a customer shopping website, a separate admin management panel, a REST API backend, secure authentication, email OTP workflows, OpenRouter AI assistance, Cloudinary image management, and Swagger API documentation.

---

# 🚀 Project Overview

The platform includes:

- 🌐 Customer E-Commerce Website
- 📱 Responsive Mobile App-Like Experience
- 🛡️ Separate Admin Management Panel
- ⚙️ REST API Backend
- 🔐 JWT-Based Authentication
- 📧 Email OTP Verification
- 🔑 Forgot Password and Password Reset with OTP
- 🤖 OpenRouter AI Shopping Assistant
- 📚 Swagger API Documentation
- ☁️ Cloudinary Image Management
- 🛒 Database-Driven Cart and Wishlist
- 📦 Order Management
- 📊 Admin Analytics

The application follows a three-tier structure with separate customer frontend, admin frontend, and backend services.

---

# ✨ Key Features

## 🛒 Customer E-Commerce Platform

**Location:** `client/`  
**Default Development Port:** `http://localhost:5173`

### Product Discovery

- **Product Browsing:** Browse Ayurvedic and natural wellness products.
- **Product Search:** Search products using keywords.
- **Smart Filtering:** Filter products by category, price range, and rating.
- **Product Sorting:** Sort products based on user preferences.
- **Category Exploration:** Discover products through categories.

### Product Details

- **Detailed Information:** View product information and descriptions.
- **Multi-Image Gallery:** Explore multiple product images.
- **Ingredients and Benefits:** Read product ingredients and benefits.
- **Usage Information:** View usage and storage instructions.
- **Customer Reviews:** Check ratings and reviews.

### Cart and Wishlist

- Add products to the shopping cart.
- Update product quantities.
- View cart calculations.
- Save products to the wishlist.
- Manage products before checkout.

### Orders and Checkout

- Manage delivery addresses.
- Validate order information.
- Check product availability and stock.
- Place supported Cash on Delivery orders.
- Track order information.

---

## 📱 Mobile Responsive Experience

AYURVEDAMART is designed to adapt across desktop, tablet, and mobile screen sizes.

### Desktop Experience

- Full navigation experience.
- Expanded product grids.
- Detailed product pages.
- Desktop-friendly layouts.

### Mobile Experience

- Responsive navigation.
- Mobile-friendly product cards.
- Adaptive layouts.
- Touch-friendly controls.
- Optimized spacing for smaller screens.

The same web application adapts its interface according to the device screen size.

---

## 🛡️ Admin Management Panel

**Location:** `admin/`  
**Default Development Port:** `http://localhost:5174`

The admin panel is separate from the customer application and is intended for authorized store management.

### Admin Features

- **Role-Based Access:** Admin-only authorization.
- **Analytics:** Dashboard information for store activity.
- **Product Management:** Add, edit, and delete products.
- **Inventory Management:** Manage stock and product details.
- **Image Management:** Manage product images.
- **SKU Management:** Manage product SKUs.
- **Category Management:** Manage product categories.
- **Order Management:** View and update order status.
- **User Management:** Manage user accounts.
- **Review Moderation:** Manage customer reviews.

---

# ⚙️ Backend REST API

**Location:** `server/`  
**Default Development Port:** `http://localhost:5000`

The backend handles business logic, authentication, database operations, API requests, security middleware, and external integrations.

### Backend Responsibilities

- Authentication and authorization.
- User management.
- Product operations.
- Category operations.
- Cart management.
- Wishlist management.
- Order management.
- Review operations.
- Image handling.
- Email OTP operations.
- AI assistant requests.
- API documentation.

---

# 🔐 Authentication and Security

AYURVEDAMART includes a complete authentication workflow.

### Authentication Features

- User registration.
- Email OTP verification.
- Registration OTP resend.
- User login.
- JWT token generation.
- Protected routes.
- Current user profile access.
- Profile updates.
- Forgot password functionality.
- Password reset OTP verification.
- Secure password reset flow.

### Security

The backend uses:

- `helmet`
- `cors`
- `express-rate-limit`
- `express-mongo-sanitize`
- `bcryptjs`
- `jsonwebtoken`
- `express-validator`

OTP-related routes use dedicated rate limiting middleware.

---

# 📧 Email and SMTP Setup

Email functionality supports:

- Registration OTP delivery.
- OTP resend requests.
- Forgot password OTP delivery.
- Password reset verification.

The backend includes:

- `nodemailer`
- `resend`

Keep provider credentials in environment variables and never commit them to GitHub.

### Example Configuration

```env
EMAIL_HOST=your_smtp_host
EMAIL_PORT=your_smtp_port
EMAIL_USER=your_email_username
EMAIL_PASS=your_email_password
EMAIL_FROM=your_sender_email
```

> Use the environment variable names that match your actual backend configuration.

---

# 🤖 OpenRouter AI Shopping Assistant

AYURVEDAMART includes an AI-powered shopping assistant using OpenRouter AI.

The assistant can help with:

- Product-related questions.
- Shopping guidance.
- Product discovery.
- General assistance while browsing the platform.

### Configuration

```env
OPENROUTER_API_KEY=your_openrouter_api_key
```

Never expose API keys in frontend code or commit them to a public repository.

---

# ☁️ Cloudinary Image Management

Cloudinary is used for cloud-based image handling.

It supports workflows such as:

- Product image uploads.
- Multiple product images.
- Cloud image storage.

### Configuration

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

# 📚 Swagger API Documentation

The backend includes Swagger API documentation for API exploration and testing.

### Local Documentation

`http://localhost:5000/api-docs`

Swagger can be used for:

- Viewing API endpoints.
- Checking request methods.
- Viewing request body formats.
- Viewing response codes.
- Testing APIs directly.
- Testing protected routes using authorization tokens.

### Authentication API

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/send-otp` | Send registration OTP |
| POST | `/api/auth/verify-otp` | Verify registration OTP |
| POST | `/api/auth/resend-otp` | Resend registration OTP |
| POST | `/api/auth/forgot-password` | Send password reset OTP |
| POST | `/api/auth/verify-reset-otp` | Verify password reset OTP |
| POST | `/api/auth/reset-password` | Reset password |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current logged-in user |
| PUT | `/api/auth/profile` | Update current user profile |

Protected routes require a valid JWT token.

---

# 🏗️ Project Architecture

```text
ayurvedamart/
├── client/          # Customer-facing React application
├── admin/           # Separate React admin management panel
├── server/          # Node.js and Express backend
└── README.md        # Project documentation
```

### Application Flow

```text
Customer / Admin Frontend
          ↓
       REST API
          ↓
Node.js + Express Backend
          ↓
        MongoDB
```

External services such as Cloudinary, email providers, OpenRouter AI, and Swagger integrate where required.

---

# 🧰 Technology Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios

## Admin Panel

- React
- Vite
- Tailwind CSS
- Axios
- Recharts

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

## Authentication and Security

- JWT
- bcryptjs
- Helmet
- CORS
- Express Rate Limit
- Express Validator
- Express Mongo Sanitize

## Integrations

- OpenRouter AI
- Cloudinary
- Nodemailer
- Resend
- Swagger

---

# 📦 Backend Dependencies

Major backend packages include:

- `axios`
- `bcryptjs`
- `cloudinary`
- `cors`
- `dotenv`
- `express`
- `express-mongo-sanitize`
- `express-rate-limit`
- `express-validator`
- `helmet`
- `jsonwebtoken`
- `mongodb`
- `mongoose`
- `multer`
- `nodemailer`
- `resend`
- `swagger-jsdoc`
- `swagger-ui-express`

Development dependency:

- `nodemon`

---

# 🗄️ Database

AYURVEDAMART uses MongoDB as its primary database.

Mongoose is used to work with MongoDB from the Node.js backend.

The database stores application information such as:

- Users.
- Products.
- Categories.
- Cart data.
- Wishlist data.
- Orders.
- Reviews.

### Example Configuration

```env
MONGODB_URI=your_mongodb_connection_string
```

---

# ⚙️ Installation and Setup

## 1. Clone the Repository

```bash
git clone https://github.com/denimpurbia/AYURVEDAMART-e-commerce-WEBSITE.git
cd AYURVEDAMART-e-commerce-WEBSITE
```

## 2. Customer Frontend

```bash
cd client
npm install
npm run dev
```

Default local URL: `http://localhost:5173`

## 3. Admin Panel

```bash
cd admin
npm install
npm run dev
```

Default local URL: `http://localhost:5174`

## 4. Backend

```bash
cd server
npm install
npm run dev
```

Default local URL: `http://localhost:5000`

---

# 🔑 Environment Variables

Create a `.env` file inside `server/`.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_strong_jwt_secret

OPENROUTER_API_KEY=your_openrouter_api_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

EMAIL_HOST=your_smtp_host
EMAIL_PORT=your_smtp_port
EMAIL_USER=your_email_username
EMAIL_PASS=your_email_password
EMAIL_FROM=your_sender_email
```

> Configure variable names according to the exact names used in your source code.

---

# ▶️ Running the Backend

Development mode:

```bash
cd server
npm run dev
```

Normal startup:

```bash
npm start
```

The exact seeded data depends on the implementation in the `seed/` directory.

---

# 🔗 Local Development Services

| Service | Default URL |
|---|---|
| Customer Website | `http://localhost:5173` |
| Admin Panel | `http://localhost:5174` |
| Backend API | `http://localhost:5000` |
| Swagger API Docs | `http://localhost:5000/api-docs` |

---

# 🧪 API Testing

The API can be tested using:

- Swagger UI.
- Postman.
- Thunder Client.
- Frontend application requests.

### Typical Authentication Testing Flow

1. Send registration OTP.
2. Verify the registration OTP.
3. Login with the registered account.
4. Receive a JWT token.
5. Use the token for protected routes.
6. Test the current user profile route.
7. Test profile update functionality.
8. Test forgot password and reset password workflows.

---

# 🔒 Protected Routes

Protected routes require a valid JWT token.

Typical authorization header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

Swagger's **Authorize** option can be used when testing protected endpoints.

---

# 🎨 User Interface Design

The customer interface is designed around an Ayurvedic and natural wellness identity.

The visual direction includes natural tones such as:

- Forest Green.
- Deep Green.
- Sage Green.
- Warm Cream.
- Warm White.
- Muted Gold.
- Earth Brown.

The interface includes product-focused layouts, category exploration, promotional sections, and responsive components.

---

# 🔄 Typical User Flow

### Customer Shopping Flow

```text
Browse Products
      ↓
View Product Details
      ↓
Add to Cart or Wishlist
      ↓
Login / Authenticate
      ↓
Add or Select Address
      ↓
Place Order
      ↓
Track Order
```

### Registration Flow

```text
Register
   ↓
Receive Email OTP
   ↓
Verify OTP
   ↓
Account Created
   ↓
Login
   ↓
Receive JWT Token
```

### Password Reset Flow

```text
Forgot Password
      ↓
Receive Reset OTP
      ↓
Verify OTP
      ↓
Set New Password
      ↓
Login Again
```

---

# 🔒 Important Security Notes

- Never commit `.env` files containing secrets.
- Never expose JWT secrets.
- Never expose OpenRouter API keys.
- Never expose Cloudinary API secrets.
- Never expose SMTP passwords.
- Use strong production environment variables.
- Apply appropriate production CORS settings before deployment.

---

# 👨‍💻 Author

**Denim Purbia**

GitHub: https://github.com/denimpurbia

---

# 📄 License

This project is created for educational, portfolio, and learning purposes.

---

# 🌿 AYURVEDAMART

> **AUTHENTIC AYURVEDA. NATURAL WELLNESS.**

A full-stack MERN e-commerce platform combining traditional Ayurvedic wellness with modern web technology.
