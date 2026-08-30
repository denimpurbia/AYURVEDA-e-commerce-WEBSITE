# AYURVEDAMART — Complete MERN Stack E-Commerce Platform

**Tagline:** "AUTHENTIC AYURVEDA. NATURAL WELLNESS."

AYURVEDAMART is a production-style, 3-tier MERN stack e-commerce web application with a separate Admin Management Panel, OpenRouter AI Shopping Assistant, Cloudinary image integration, and database-driven REST APIs powered by MongoDB and Express.

---

## 🌿 Key Features

### 🛒 Customer E-Commerce Platform (`client/` - Port 5173)

- **Reference Image UI Matching:** Cinematic hero layout, floating benefits strip, explore category cards, promotional banners, product card grids, brand story sections, reviews, and multi-column footer.
- **Visual Palette:** Forest Green (`#123D2A`), Deep Green (`#0B2D1E`), Sage Green (`#789B72`), Warm Cream (`#F7F2E8`), Warm White (`#FFFDF8`), Muted Gold (`#C49A52`), and Earth Brown (`#7A6248`).
- **Product Discovery:** Product search with keyword, price range, category, minimum rating, and sorting filters.
- **Product Details:** Multi-image gallery, ingredients, key benefits, usage and storage instructions, ratings, and customer reviews.
- **Database-Backed Cart & Wishlist:** Real-time cart calculations, quantity controls, wishlist functionality, and free shipping threshold.
- **Checkout & COD Orders:** Address validation, stock checks, Cash on Delivery support, and order tracking.
- **Ayurveda AI Assistant:** Floating AI chatbot powered by OpenRouter with product and shopping assistance.

### 🛡️ Admin Management Panel (`admin/` - Port 5174)

- **Role-Based Authorization:** Admin-only access using role-based authorization.
- **Live Analytics:** Dashboard metrics for revenue, orders, products, and users.
- **Product Management:** Add, edit, delete products, manage stock, images, and SKUs.
- **Category & Order Management:** Manage categories and update order statuses.
- **User & Review Moderation:** Manage user accounts and customer reviews.

---

## 🏗️ Architecture & Technology Stack

```text
ayurvedamart/
├── client/     # React, Vite, Tailwind CSS, React Router, Axios
├── admin/      # React, Vite, Tailwind CSS, Recharts, Axios
└── server/     # Node.js, Express.js, MongoDB, Mongoose, JWT, OpenRouter