# AYURVEDAMART — Complete MERN Stack E-Commerce Platform

**Tagline**: "AUTHENTIC AYURVEDA. NATURAL WELLNESS."

AYURVEDAMART is a production-style, 3-tier MERN stack e-commerce web application with a separate Admin Management Panel, OpenRouter AI Shopping Assistant, Cloudinary image integration, and database-driven REST APIs powered by MongoDB and Express.

---

## 🌿 Key Features

### 🛒 Customer E-Commerce Platform (`client/` - Port 5173)
- **Reference Image UI Matching**: Strict reproduction of cinematic hero layout, floating benefits strip, explore category cards, promotional banner, product card grids, brand story pillars, reviews, and multi-column footer.
- **Visual Palette**: Forest Green (`#123D2A`), Deep Green (`#0B2D1E`), Sage Green (`#789B72`), Warm Cream (`#F7F2E8`), Warm White (`#FFFDF8`), Muted Gold (`#C49A52`), Earth Brown (`#7A6248`).
- **Product Discovery**: Multi-filter catalog search by keyword, price range, categories, minimum rating, and sorting.
- **Product Details**: Multi-image gallery, ingredients breakdown, key benefits, usage & storage instructions, verified ratings, and customer reviews.
- **Database-Backed Shopping Cart & Wishlist**: Real-time calculation of subtotal, free shipping threshold (above ₹999), and quantity controls.
- **Checkout & COD Orders**: Address validation, stock availability checks, Cash on Delivery payment option, and live order tracking timelines.
- **Ayurveda AI Assistant**: Floating OpenRouter-powered chatbot (`POST /api/chat`) with MongoDB tool integration for budget searches, stock lookups, and medical safety disclaimers.

### 🛡️ Admin Management Panel (`admin/` - Port 5174)
- **Role-Based Authorization**: Restricted to `role === 'admin'`. Non-admin accounts receive HTTP 403 Forbidden.
- **Live MongoDB Analytics**: Dashboard metrics (Total Revenue, Total Orders, Total Products, Active Users), Recharts monthly growth trends, low stock alerts (< 10 units), and recent order activity.
- **Product CRUD**: Add, Edit, Delete products with live database syncing, image uploading, SKU generation, and stock management.
- **Category & Order Management**: Manage categories, update order statuses (`Pending` -> `Confirmed` -> `Processing` -> `Shipped` -> `Delivered`), and auto-confirm COD payments upon delivery.
- **User & Review Moderation**: View registered user accounts, toggle active/inactive states, and moderate customer reviews.

---

## 🏗️ Architecture & Technology Stack

```
ayurvedamart/
├── client/     # React 18, Vite, Tailwind CSS, React Router, Axios (Port 5173)
├── admin/      # React 18, Vite, Tailwind CSS, Recharts, Axios (Port 5174)
└── server/     # Node.js, Express.js, Mongoose, JWT, OpenRouter AI, Multer (Port 5000)
```

---

## 🚀 Quick Start & Installation

### 1. Install Dependencies

In separate terminal windows:

```bash
# Server
cd server
npm install

# Customer Client
cd client
npm install

# Admin Panel
cd admin
npm install
```

### 2. Configure Environment Variables

Create `.env` inside `server/`, `client/`, and `admin/`:

`server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/ayurvedamart
JWT_SECRET=ayurvedamart_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct
```

`client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

`admin/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed MongoDB Database

Run the automated seeder script to populate categories, products, admin, and user accounts:

```bash
cd server
npm run seed
```

**Seeded Credentials**:
- **Admin**: `admin@ayurvedamart.com` / `adminpassword123`
- **Customer User**: `user@ayurvedamart.com` / `userpassword123`

### 4. Run Applications Locally

```bash
# Terminal 1: Express REST API
cd server
npm run dev

# Terminal 2: Customer Website
cd client
npm run dev

# Terminal 3: Admin Management Panel
cd admin
npm run dev
```

---

## 🔑 Key URLs

- **Customer Website**: [http://localhost:5173](http://localhost:5173)
- **Admin Control Panel**: [http://localhost:5174](http://localhost:5174)
- **Backend API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
