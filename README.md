# 🌿 AYURVEDAMART

## Complete MERN Stack E-Commerce Platform

> **AUTHENTIC AYURVEDA. NATURAL WELLNESS.**

AYURVEDAMART is a production-style full-stack MERN e-commerce platform built for discovering and purchasing Ayurvedic and natural wellness products.

The project includes:

- 🌐 Customer E-Commerce Website
- 📱 Mobile App-Like Experience
- 🛡️ Separate Admin Management Panel
- 🔐 JWT Authentication
- 📧 Email OTP Verification
- 🔑 Forgot Password with OTP
- 🤖 OpenRouter AI Shopping Assistant
- 📚 Swagger API Documentation
- ☁️ Cloudinary Image Management
- 🛒 Database-Driven Cart & Wishlist
- 📦 Order Management System
- 📊 Admin Analytics Dashboard

The application follows a **3-tier architecture** with separate frontend, admin frontend, and backend services.

---

# 🚀 Project Overview

AYURVEDAMART provides a complete digital shopping experience for Ayurvedic and natural wellness products.

Customers can:

- Browse products
- Search and filter products
- View detailed product information
- Add products to cart
- Add products to wishlist
- Manage their profile
- Save delivery addresses
- Place Cash on Delivery orders
- Track orders
- Review products
- Receive email OTP verification
- Reset passwords securely
- Get assistance from an AI shopping assistant

Administrators can manage:

- Products
- Categories
- Orders
- Users
- Reviews
- Inventory
- Store analytics

---

# ✨ Key Features

## 🛒 Customer E-Commerce Platform

Located in:

```text
client/

Default local development port:

http://localhost:5173
Customer Features
Responsive e-commerce interface
Product browsing
Product search
Category filtering
Price filtering
Rating filtering
Product sorting
Product detail pages
Multi-image product gallery
Ingredients information
Product benefits
Usage instructions
Storage instructions
Product ratings
Customer reviews
Shopping cart
Quantity management
Wishlist
Checkout system
Delivery address management
Cash on Delivery orders
Order tracking
User profile management
Saved delivery address
Automatic address prefill during checkout
💻 Desktop Experience

On desktop and laptop devices, AYURVEDAMART provides a traditional modern e-commerce website experience.

Desktop Features
Full navigation bar
Large responsive layouts
Desktop optimized product grids
Desktop shopping experience
Full footer navigation
Responsive large-screen UI
No mobile splash screen
No mobile bottom navigation

The desktop interface is optimized for larger screens.

📱 Mobile App-Like Experience

AYURVEDAMART provides a different experience for mobile users.

When the website is opened on a mobile device, it behaves more like a modern shopping application.

Mobile Features
Mobile splash screen
App-style interface
Fixed mobile bottom navigation
Touch-friendly buttons
Mobile optimized layouts
Responsive product cards
Mobile-friendly checkout
Mobile account management
Mobile Bottom Navigation

The mobile navigation provides quick access to important sections such as:

Home
Shop
Cart
Wishlist
Account

The bottom navigation is optimized specifically for mobile screens.

Splash Screen Behavior

The splash screen is displayed only for mobile devices.

Desktop and laptop users do not see the mobile splash screen.

🔐 Authentication System

AYURVEDAMART uses a secure authentication system based on:

JWT
Password hashing
Email OTP verification
Protected routes
Role-based authorization
Authentication rate limiting
👤 User Registration

The registration flow includes email verification.

Registration Process
User enters details
        ↓
Registration OTP is generated
        ↓
OTP is sent to user's email
        ↓
User enters OTP
        ↓
OTP is verified
        ↓
Account is created
        ↓
JWT token is generated
        ↓
User is logged in
🔑 Login

Users can log in using:

Email
+
Password

After successful authentication, the backend generates a JWT token.

The token is used to access protected APIs.

🔄 Forgot Password

The application includes a secure password reset flow.

Password Reset Process
User enters email
        ↓
Password reset OTP is generated
        ↓
OTP is sent via email
        ↓
User verifies OTP
        ↓
User creates a new password
        ↓
Password is updated securely
📧 Email & OTP System

AYURVEDAMART uses an email-based OTP system for important authentication operations.

OTP functionality is used for:

User registration verification
Registration OTP resend
Forgot password requests
Password reset verification

The backend includes email service support through configured email infrastructure.

The project dependencies include:

Nodemailer
Resend

The active email configuration is controlled through backend environment variables.

🔐 Security Features

The backend includes multiple security layers.

Security Technologies
Helmet
CORS configuration
JWT authentication
Password hashing with bcrypt
MongoDB sanitization
Global API rate limiting
Authentication rate limiting
OTP rate limiting
Protected routes
Role-based authorization
Environment variables
🛡️ Helmet

Helmet is used to add security-related HTTP headers.

🚦 Rate Limiting

The backend uses rate limiting to help prevent abuse.

Global API Limiting

Limits excessive API requests.

Authentication Limiting

Provides additional protection for authentication endpoints.

OTP Limiting

Helps protect OTP sending and verification APIs.

🧹 MongoDB Sanitization

The application uses MongoDB sanitization to help protect against MongoDB query injection attacks.

🤖 Ayurveda AI Shopping Assistant

AYURVEDAMART includes an AI-powered shopping assistant.

The chatbot helps users with:

Product discovery
Shopping assistance
Product-related questions
Navigation assistance
Ayurvedic product guidance

The AI functionality is powered through:

OpenRouter AI

The chatbot is integrated into the customer web application.

🧠 OpenRouter AI Integration

The backend communicates with OpenRouter AI services to provide AI-generated responses.

The AI configuration is controlled using environment variables.

Example:

OPENROUTER_API_KEY=

Never commit API keys to GitHub.

📚 Swagger API Documentation

The backend includes interactive API documentation using Swagger.

Swagger allows developers and evaluators to:

View available APIs
Understand API endpoints
View request formats
View response formats
Test APIs directly from the browser
Test protected APIs
Test authentication APIs
Manage API documentation
Swagger Technologies

The project uses:

swagger-jsdoc
swagger-ui-express
Swagger API Testing

The API documentation interface allows testing of endpoints such as:

Authentication
POST   /api/auth/send-otp
POST   /api/auth/verify-otp
POST   /api/auth/resend-otp
POST   /api/auth/login
POST   /api/auth/forgot-password
POST   /api/auth/verify-reset-otp
POST   /api/auth/reset-password
GET    /api/auth/me
PUT    /api/auth/profile

Protected APIs can be tested using JWT authentication through Swagger's authorization system.

👤 User Profile Management

Users can manage their profile information.

Editable Information
Name
Phone number
Delivery address
Delivery Address

The saved delivery address includes:

Street
City
State
Pincode

Once the user saves an address, it can be automatically used during future checkout processes.

This provides a shopping experience similar to modern e-commerce platforms.

🛒 Shopping Cart

The cart system is database-driven.

Users can:

Add products
Remove products
Increase quantity
Decrease quantity
View cart totals
Manage multiple products

The backend performs the required calculations and validations.

❤️ Wishlist

Authenticated users can save products to their wishlist.

Features include:

Add product to wishlist
Remove product from wishlist
View saved products
Move products to cart
📦 Order Management

The platform includes an order management system.

Customers can:

Place orders
Provide delivery information
Review order details
View order history
Track order status
💵 Payment Method

Currently supported:

Cash on Delivery
⭐ Product Reviews

AYURVEDAMART supports customer product reviews.

The platform includes a separate product review system.

Users can:

Submit reviews
View product ratings
View customer feedback
🛡️ Admin Management Panel

Located in:

admin/

Default local development port:

http://localhost:5174

The admin panel is separate from the customer application.

👑 Admin Features
📊 Dashboard Analytics

Administrators can view store-related metrics such as:

Revenue
Orders
Products
Users
📦 Product Management

Administrators can:

Add products
Edit products
Delete products
Manage product images
Manage stock
Manage SKUs
🗂️ Category Management

Administrators can manage product categories.

🚚 Order Management

Administrators can:

View customer orders
Manage order information
Update order status
👥 User Management

Administrators can manage user accounts.

⭐ Review Moderation

Administrators can manage customer reviews.

☁️ Cloudinary Image Management

Product images are managed using Cloudinary integration.

Cloudinary provides cloud-based image storage and management.

Example configuration:

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

Never commit Cloudinary secrets to GitHub.

🗄️ Database

The application uses:

MongoDB

with:

Mongoose

MongoDB stores application data including:

Users
Products
Categories
Orders
Cart data
Wishlist data
Reviews
Email verification records
Password reset records
🏗️ Architecture

AYURVEDAMART follows a 3-tier architecture.

                    ┌──────────────────────┐
                    │    CUSTOMER CLIENT   │
                    │       React          │
                    │       Vite           │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               │
                               ▼
                    ┌──────────────────────┐
                    │      BACKEND API     │
                    │      Node.js         │
                    │      Express.js      │
                    │                      │
                    │  Authentication      │
                    │  Products            │
                    │  Orders              │
                    │  Cart                │
                    │  Wishlist            │
                    │  AI Chat             │
                    │  Swagger             │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       MongoDB        │
                    │      Database        │
                    └──────────────────────┘


                    ┌──────────────────────┐
                    │     ADMIN PANEL      │
                    │       React          │
                    │       Vite           │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │      BACKEND API     │
                    └──────────────────────┘
🧰 Technology Stack
Frontend
React
Vite
Tailwind CSS
React Router
Axios
Lucide Icons
Admin Panel
React
Vite
Tailwind CSS
Axios
Recharts
Backend
Node.js
Express.js
MongoDB
Mongoose
JWT
bcryptjs
AI
OpenRouter AI
API Documentation
Swagger
swagger-jsdoc
swagger-ui-express
Email
Nodemailer
Resend
Image Management
Cloudinary
Multer
Security
Helmet
Express Rate Limit
Express Mongo Sanitize
JWT
bcryptjs
📁 Project Structure
AYURVEDAMART-e-commerce-WEBSITE/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── admin/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── seed/
│   ├── server.js
│   └── package.json
│
└── README.md
🔗 API Modules

The backend provides APIs for:

Authentication
Products
Categories
Cart
Wishlist
Orders
Users
General Reviews
Product Reviews
AI Chat
Contact Messages
🩺 API Health Check

The backend includes a health check endpoint.

GET /api/health

Example response:

{
  "success": true,
  "message": "AYURVEDAMART API Server is running smoothly"
}
⚙️ Installation Guide
1. Clone the Repository
git clone https://github.com/denimpurbia/AYURVEDAMART-e-commerce-WEBSITE.git

Move into the project:

cd AYURVEDAMART-e-commerce-WEBSITE
🖥️ Backend Setup

Move into the server directory:

cd server

Install dependencies:

npm install

Create a .env file.

Example:

PORT=5000

NODE_ENV=development

MONGO_URI=

JWT_SECRET=

CLIENT_URL=http://localhost:5173

ADMIN_URL=http://localhost:5174

OPENROUTER_API_KEY=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

EMAIL_USER=

EMAIL_PASSWORD=

RESEND_API_KEY=

Configure only the environment variables required by your active services.

Start the backend:

npm run dev

Backend:

http://localhost:5000
🌐 Customer Frontend Setup

Move into the client directory:

cd client

Install dependencies:

npm install

Create the required environment configuration.

Start the development server:

npm run dev

Customer application:

http://localhost:5173
🛡️ Admin Panel Setup

Move into the admin directory:

cd admin

Install dependencies:

npm install

Start the development server:

npm run dev

Admin panel:

http://localhost:5174
🗄️ Database Seeding

The backend includes a database seeding command.

From the server directory:

npm run seed

This can be used to populate initial project data.

🚀 Deployment Architecture

The project supports separate deployment for different layers.

Customer Frontend
        ↓
      Vercel

Admin Frontend
        ↓
      Vercel

Backend API
        ↓
   Render / Server Hosting

Database
        ↓
     MongoDB
🔒 Environment Variables

Sensitive information should never be committed to GitHub.

Important secrets include:

MongoDB URI
JWT Secret
Email Credentials
Resend API Key
OpenRouter API Key
Cloudinary API Secret

Always use:

.env

for sensitive configuration.

🧪 API Testing

APIs can be tested using:

Swagger UI
Postman
Frontend integration

Swagger provides an interactive interface for testing APIs directly.

Protected routes require JWT authorization.

📱 Responsive Design

The application is designed to work across:

📱 Mobile devices
📲 Tablets
💻 Laptops
🖥️ Desktop computers

The mobile experience includes additional app-style functionality such as bottom navigation and a mobile splash screen.

🔐 Role-Based Access

The application supports different user roles.

User

Can:

Browse products
Manage profile
Manage cart
Manage wishlist
Place orders
Write reviews
Admin

Can:

Access the admin panel
Manage products
Manage categories
Manage orders
Manage users
Manage reviews
View analytics
🎯 Project Highlights

This project demonstrates:

Full-stack MERN development
REST API development
JWT authentication
Email OTP authentication
Password reset system
Role-based authorization
Responsive web design
Mobile app-like web experience
AI integration
OpenRouter API integration
Cloudinary integration
MongoDB database design
Admin dashboard development
API documentation with Swagger
API security
Rate limiting
Deployment architecture
🔮 Future Improvements

Possible future enhancements include:

Online payment gateway integration
Razorpay integration
Multiple saved addresses
Order invoice generation
Push notifications
Advanced product recommendations
AI-powered personalized recommendations
Real-time order notifications
Progressive Web App support
Multi-language support
Advanced analytics
Coupon and discount system
👨‍💻 Developer

Denim Purbia

GitHub:

https://github.com/denimpurbia

📄 License

This project is created for educational and portfolio purposes.

🌿 AYURVEDAMART

AUTHENTIC AYURVEDA. NATURAL WELLNESS.

A complete full-stack MERN e-commerce platform combining traditional Ayurvedic wellness with modern web technologies.


## Next step

Ab **ye complete README replace karke save karo**, phir terminal mein:

```bash
git status