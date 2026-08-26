const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Review = require('../models/Review');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const Order = require('../models/Order');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ayurvedamart');
    console.log('🌿 Database connected for seeding...');
  } catch (err) {
    console.error('Failed to connect DB for seed:', err.message);
    process.exit(1);
  }
};

const categoriesData = [
  {
    name: 'Kadha',
    slug: 'kadha',
    description: 'Traditional herbal decoctions for immunity, vitality, and respiratory wellness.',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Ayurvedic Medicines',
    slug: 'ayurvedic-medicines',
    description: 'Pure herbal formulations for systemic balance and holistic wellness.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Herbal Oils',
    slug: 'herbal-oils',
    description: 'Cold-pressed authentic Ayurvedic tailams for hair, skin, and body massage.',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Powders',
    slug: 'powders',
    description: 'Single and polyherbal churnas crafted according to classical texts.',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Wellness',
    slug: 'wellness',
    description: 'Everyday Ayurvedic tonics, elixirs, and dietary supplements.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Hair Care',
    slug: 'hair-care',
    description: 'Natural herbal solutions for strong, shiny, and nourished scalp health.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Skin Care',
    slug: 'skin-care',
    description: 'Radiance-enhancing herbal serums, oils, and ubtans.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Immunity',
    slug: 'immunity',
    description: 'Potent Rasayana formulas to strengthen your natural defenses.',
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&q=80&w=600',
  },
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing old collections...');
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();
    await Order.deleteMany();

    console.log('👤 Seeding Users & Admin...');
    const adminUser = await User.create({
      name: 'AyurvedaMart Admin',
      email: 'admin@ayurvedamart.com',
      password: 'adminpassword123',
      phone: '+91 9876543210',
      role: 'admin',
      address: {
        street: '108 Herbal Way, Connaught Place',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
      },
    });

    const demoUser = await User.create({
      name: 'Priya Sharma',
      email: 'user@ayurvedamart.com',
      password: 'userpassword123',
      phone: '+91 9812345678',
      role: 'user',
      address: {
        street: '45 Lotus Enclave',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302001',
      },
    });

    console.log('🏷️ Seeding Categories...');
    const createdCategories = await Category.insertMany(categoriesData);

    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    console.log('📦 Seeding Ayurvedic Products...');
    const productsData = [
      {
        name: 'Organic Herbal Kadha',
        slug: 'organic-herbal-kadha',
        shortDescription: 'Immunity booster with Tulsi, Ginger, Black Pepper, and Cinnamon.',
        description: 'Our signature Organic Herbal Kadha is an authentic Ayurvedic decoction formulated using traditional herbs known for supporting respiratory health and boosting natural immune defense.',
        category: categoryMap['kadha'],
        brand: 'AyurvedaMart',
        price: 299,
        discountPrice: 249,
        images: ['https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800'],
        ingredients: ['Tulsi', 'Ginger', 'Black Pepper', 'Cinnamon', 'Giloy', 'Mulethi'],
        benefits: ['Boosts Immunity', 'Relieves Cold & Cough', 'Supports Digestion'],
        usage: 'Boil 1 tsp in 200ml water for 5-10 minutes. Strain and drink warm twice daily.',
        storageInstructions: 'Keep airtight in a dry place away from moisture.',
        weight: '150g',
        stock: 50,
        sku: 'AVM-KAD-001',
        rating: 4.8,
        numReviews: 128,
        featured: true,
      },
      {
        name: 'Ashwagandha Powder',
        slug: 'ashwagandha-powder',
        shortDescription: '100% pure organic root powder for stress relief and energy.',
        description: 'Ashwagandha is one of Ayurveda’s most revered adaptogens, celebrated for reducing stress, improving physical stamina, and enhancing restful sleep.',
        category: categoryMap['powders'],
        brand: 'AyurvedaMart',
        price: 349,
        discountPrice: 299,
        images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800'],
        ingredients: ['Pure Organic Ashwagandha Root (Withania Somnifera)'],
        benefits: ['Stress & Anxiety Relief', 'Boosts Stamina', 'Promotes Deep Sleep'],
        usage: 'Mix 1/2 tsp with warm milk or honey before sleeping.',
        storageInstructions: 'Store in a cool dry place.',
        weight: '200g',
        stock: 45,
        sku: 'AVM-POW-002',
        rating: 4.9,
        numReviews: 96,
        featured: true,
      },
      {
        name: 'Amla Powder',
        slug: 'amla-powder',
        shortDescription: 'Rich in Vitamin C for hair growth, skin glow, and digestion.',
        description: 'Sun-dried pure Indian Gooseberry powder rich in natural antioxidants and Vitamin C to revitalize hair roots and detoxify digestion.',
        category: categoryMap['powders'],
        brand: 'AyurvedaMart',
        price: 199,
        discountPrice: 169,
        images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800'],
        ingredients: ['Sun-dried Organic Amla (Emblica Officinalis)'],
        benefits: ['Natural Vitamin C', 'Hair Strength', 'Digestive Health'],
        usage: 'Take 1 tsp with warm water every morning on an empty stomach.',
        storageInstructions: 'Airtight container in dark shelf.',
        weight: '250g',
        stock: 60,
        sku: 'AVM-POW-003',
        rating: 4.7,
        numReviews: 74,
        featured: true,
      },
      {
        name: 'Bhringraj Hair Oil',
        slug: 'bhringraj-hair-oil',
        shortDescription: 'Authentic Kshirpak formulation for hair fall control and thick hair.',
        description: 'Formulated using the traditional Kshirpak विधि with Bhringraj, Amla, and Sesame oil to deeply nourish hair follicles and prevent premature greying.',
        category: categoryMap['herbal-oils'],
        brand: 'AyurvedaMart',
        price: 249,
        discountPrice: 219,
        images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800'],
        ingredients: ['Bhringraj Extract', 'Amla', 'Sesame Oil', 'Coconut Oil', 'Brahmi'],
        benefits: ['Reduces Hair Fall', 'Deep Scalp Nourishment', 'Prevents Greying'],
        usage: 'Gently massage into scalp 2 hours before washing or leave overnight.',
        storageInstructions: 'Store at room temperature.',
        weight: '200ml',
        stock: 35,
        sku: 'AVM-OIL-004',
        rating: 4.9,
        numReviews: 160,
        featured: true,
      },
      {
        name: 'Giloy Tablets',
        slug: 'giloy-tablets',
        shortDescription: 'Pure Guduchi extract for immunity and fever recovery.',
        description: 'Potent Guduchi tablets designed to purify blood, relieve chronic fatigue, and boost overall immune resilience against seasonal changes.',
        category: categoryMap['ayurvedic-medicines'],
        brand: 'AyurvedaMart',
        price: 299,
        discountPrice: 249,
        images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800'],
        ingredients: ['Pure Giloy Extract (Tinospora Cordifolia)'],
        benefits: ['Purifies Blood', 'Reduces Body Heat', 'Improves Vitality'],
        usage: '1-2 tablets twice daily with water after meals.',
        storageInstructions: 'Keep away from direct heat and moisture.',
        weight: '60 Tablets',
        stock: 80,
        sku: 'AVM-MED-005',
        rating: 4.8,
        numReviews: 112,
        featured: true,
      },
      {
        name: 'Tulsi Drops',
        slug: 'tulsi-drops',
        shortDescription: 'Concentrated liquid extract of 5 sacred Pancha Tulsi species.',
        description: 'A blend of Rama, Krishna, Vana, Shukla, and Kapoor Tulsi extracts. A few drops daily enhance respiratory clarity and cellular protection.',
        category: categoryMap['immunity'],
        brand: 'AyurvedaMart',
        price: 249,
        discountPrice: 199,
        images: ['https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&q=80&w=800'],
        ingredients: ['Rama Tulsi', 'Krishna Tulsi', 'Vana Tulsi', 'Kapoor Tulsi', 'Shukla Tulsi'],
        benefits: ['Antioxidant Protection', 'Respiratory Support', 'Stress Relief'],
        usage: 'Add 2-3 drops to warm tea, water, or kadha twice daily.',
        storageInstructions: 'Store in cool place.',
        weight: '30ml',
        stock: 100,
        sku: 'AVM-IMM-006',
        rating: 4.6,
        numReviews: 55,
        featured: true,
      },
      {
        name: 'Kumkumadi Radiance Tailam',
        slug: 'kumkumadi-radiance-tailam',
        shortDescription: 'Kashmiri Saffron beauty elxir for glowing and even skin tone.',
        description: 'Precious facial oil infused with Kashmiri Saffron, Sandalwood, and Lotus stamens to reduce pigmentation, blemishes, and restore natural glow.',
        category: categoryMap['skin-care'],
        brand: 'AyurvedaMart',
        price: 599,
        discountPrice: 499,
        images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800'],
        ingredients: ['Kashmiri Saffron', 'Sandalwood', 'Lotus Extract', 'Sesame Oil', 'Licorice'],
        benefits: ['Brightens Complexion', 'Fades Dark Spots', 'Deep Hydration'],
        usage: 'Apply 3-4 drops on clean face before bedtime and massage gently.',
        storageInstructions: 'Store in cool, dark area.',
        weight: '15ml',
        stock: 25,
        sku: 'AVM-SKN-007',
        rating: 4.9,
        numReviews: 88,
        featured: true,
      },
      {
        name: 'Triphala Churna',
        slug: 'triphala-churna',
        shortDescription: 'Classic Ayurvedic bowel regulator with Haritaki, Bibhitaki, Amla.',
        description: 'Classical formulation of three sacred fruits to gently cleanse the digestive tract, relieve constipation, and rejuvenate internal organs.',
        category: categoryMap['powders'],
        brand: 'AyurvedaMart',
        price: 220,
        discountPrice: 180,
        images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800'],
        ingredients: ['Haritaki', 'Bibhitaki', 'Amla'],
        benefits: ['Cleanses Colon', 'Improves Nutrient Absorption', 'Balances All 3 Doshas'],
        usage: '1 tsp with warm water at bedtime.',
        storageInstructions: 'Keep jar tightly closed.',
        weight: '200g',
        stock: 55,
        sku: 'AVM-POW-008',
        rating: 4.8,
        numReviews: 64,
        featured: false,
      },
    ];

    const createdProducts = await Product.insertMany(productsData);

    console.log('💬 Seeding Sample Product Reviews...');
    await Review.create([
      {
        user: demoUser._id,
        product: createdProducts[0]._id,
        rating: 5,
        comment: 'The products are 100% authentic and really effective. My go-to store for Ayurvedic essentials!',
        verifiedBuyer: true,
      },
      {
        user: demoUser._id,
        product: createdProducts[1]._id,
        rating: 5,
        comment: 'Amazing quality and fast delivery. Ayurvedamart has made wellness truly easy and trustworthy.',
        verifiedBuyer: true,
      },
    ]);

    console.log('✅ Seeding Completed Successfully!');
    console.log(`🔑 Admin Login: admin@ayurvedamart.com / adminpassword123`);
    console.log(`🔑 User Login: user@ayurvedamart.com / userpassword123`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Error:', err);
    process.exit(1);
  }
};

seedData();
