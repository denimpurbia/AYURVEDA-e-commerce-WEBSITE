const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ayurvedamart'
    );

    console.log('🌿 Database connected successfully');
    console.log('✅ Using real database data from Admin Panel');
    console.log('🚫 No categories or products were deleted');
    console.log('🚫 No Unsplash images were inserted');

    process.exit(0);
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
};

connectDB();