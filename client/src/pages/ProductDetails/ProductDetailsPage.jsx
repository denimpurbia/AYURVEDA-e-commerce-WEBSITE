import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AnnouncementBar from '../../components/layout/AnnouncementBar';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import API from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { Star, Heart, ShoppingBag, Truck, ShieldCheck, Check, Plus, Minus, ArrowLeft } from 'lucide-react';

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  // Review Form
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/products/${slug}`);
        if (res.success && res.data) {
          setProduct(res.data);
          setSelectedImage(res.data.images && res.data.images.length > 0 ? res.data.images[0] : '');
          
          // Fetch product reviews
          const revRes = await API.get(`/reviews/product/${res.data._id}`);
          if (revRes.success) {
            setReviews(revRes.data);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF8]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="w-12 h-12 border-4 border-[#123D2A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-xs font-bold text-[#123D2A]">Loading authentic formulation...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FFFDF8]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
          <h2 className="font-serif text-2xl font-bold text-[#123D2A]">Product Not Found</h2>
          <button onClick={() => navigate('/shop')} className="px-6 py-2.5 bg-[#123D2A] text-white text-xs font-bold rounded-full">
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const isLiked = isInWishlist(product._id);
  const price = product.discountPrice > 0 ? product.discountPrice : product.price;
  const originalPrice = product.discountPrice > 0 ? product.price : null;

  const handleAddToCart = async () => {
    try {
      await addToCart(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBuyNow = async () => {
    try {
      await addToCart(product, quantity);
      navigate('/checkout');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to leave a review');
      return navigate('/login');
    }

    try {
      setReviewSubmitting(true);
      const res = await API.post('/reviews', {
        productId: product._id,
        rating: newRating,
        comment: newComment,
      });

      if (res.success) {
        setReviews([res.data, ...reviews]);
        setNewComment('');
        alert('Thank you! Your review has been published.');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col justify-between">
      <AnnouncementBar />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        
        {/* Back Link */}
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-xs font-bold text-[#7A6248] hover:text-[#123D2A] mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          
          {/* Gallery Section */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-square bg-[#F7F2E8] rounded-3xl overflow-hidden border border-[#EAE1D2] p-8 relative flex items-center justify-center">
              <img
                src={selectedImage || product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain object-center"
              />
              <button
                onClick={() => toggleWishlist(product._id)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#123D2A]"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-[#C49A52] text-[#C49A52]' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Row */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-xl bg-[#F7F2E8] border-2 p-2 overflow-hidden ${
                      selectedImage === img ? 'border-[#123D2A]' : 'border-[#EAE1D2]'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#789B72] uppercase block mb-1">
                {product.category?.name || 'Ayurvedic Formulation'}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#123D2A] leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center space-x-3 mt-3">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#123D2A]">{product.rating}</span>
                <span className="text-xs text-[#7A6248]">({product.numReviews} Verified Reviews)</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-[#F7F2E8]/60 rounded-2xl border border-[#EAE1D2] flex items-center justify-between">
              <div>
                <span className="font-serif text-3xl font-bold text-[#123D2A]">
                  ₹{price}
                </span>
                {originalPrice && (
                  <span className="text-sm text-gray-400 line-through ml-2">
                    ₹{originalPrice}
                  </span>
                )}
                <span className="block text-[10px] text-[#7A6248] font-medium mt-0.5">
                  Inclusive of all taxes • Weight: {product.weight}
                </span>
              </div>

              <div className="text-right">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  product.stock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </span>
                <span className="block text-[10px] text-gray-400 mt-1">SKU: {product.sku}</span>
              </div>
            </div>

            <p className="text-sm text-[#243229]/80 leading-relaxed">
              {product.shortDescription || product.description}
            </p>

            {/* Quantity Selector & CTA Buttons */}
            {product.stock > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-4">
                  <span className="text-xs font-bold text-[#123D2A]">Quantity:</span>
                  <div className="flex items-center border border-[#EAE1D2] rounded-full bg-[#FFFDF8]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-[#F7F2E8] rounded-l-full text-[#123D2A]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-xs font-bold text-[#123D2A]">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-2 hover:bg-[#F7F2E8] rounded-r-full text-[#123D2A]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold tracking-widest transition-all ${
                      added
                        ? 'bg-emerald-800 text-white'
                        : 'bg-[#123D2A] text-white hover:bg-[#0B2D1E]'
                    }`}
                  >
                    {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4 text-[#C49A52]" />}
                    {added ? 'ADDED TO CART' : 'ADD TO CART'}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold tracking-widest bg-[#C49A52] text-[#0B2D1E] hover:bg-[#123D2A] hover:text-white transition-all shadow-md"
                  >
                    BUY NOW
                  </button>
                </div>
              </div>
            )}

            {/* Delivery Guarantees */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#EAE1D2]">
              <div className="flex items-center space-x-2 text-xs font-medium text-[#7A6248]">
                <Truck className="w-4 h-4 text-[#789B72]" />
                <span>Free shipping above ₹999</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-medium text-[#7A6248]">
                <ShieldCheck className="w-4 h-4 text-[#C49A52]" />
                <span>100% Authentic Product</span>
              </div>
            </div>

          </div>

        </div>

        {/* Detailed Sections: Description, Ingredients, Benefits, Usage */}
        <div className="bg-[#F7F2E8]/40 rounded-3xl p-8 sm:p-12 border border-[#EAE1D2] space-y-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-xl text-[#123D2A]">Description</h3>
              <p className="text-xs sm:text-sm text-[#243229]/80 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Key Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-xl text-[#123D2A]">Key Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing, i) => (
                    <span key={i} className="px-3 py-1 bg-[#FFFDF8] border border-[#789B72]/40 rounded-full text-xs font-semibold text-[#123D2A]">
                      🌿 {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#EAE1D2]">
            <div>
              <h4 className="font-bold text-xs text-[#123D2A] uppercase mb-1">Key Benefits</h4>
              <ul className="text-xs text-[#7A6248] space-y-1 list-disc list-inside font-medium">
                {product.benefits && product.benefits.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-xs text-[#123D2A] uppercase mb-1">How to Use</h4>
              <p className="text-xs text-[#7A6248] font-medium">{product.usage}</p>
            </div>
            <div>
              <h4 className="font-bold text-xs text-[#123D2A] uppercase mb-1">Storage</h4>
              <p className="text-xs text-[#7A6248] font-medium">{product.storageInstructions}</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="space-y-6">
          <h3 className="font-serif font-bold text-2xl text-[#123D2A]">Customer Reviews ({reviews.length})</h3>

          {/* Add Review Form */}
          <form onSubmit={handleReviewSubmit} className="bg-[#FFFDF8] p-6 rounded-2xl border border-[#EAE1D2] space-y-4 max-w-xl">
            <h4 className="font-bold text-xs text-[#123D2A] uppercase">Write a Review</h4>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-[#7A6248] font-medium">Rating:</span>
              <div className="flex gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                  >
                    <Star className={`w-5 h-5 ${star <= newRating ? 'fill-current' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              placeholder="Share your experience with this formulation..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
              className="w-full p-3 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
              rows={3}
            />

            <button
              type="submit"
              disabled={reviewSubmitting}
              className="px-6 py-2.5 bg-[#123D2A] text-white text-xs font-bold rounded-full hover:bg-[#0B2D1E]"
            >
              Submit Review
            </button>
          </form>

          {/* Existing Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div key={rev._id} className="p-4 bg-[#F7F2E8]/60 rounded-xl border border-[#EAE1D2] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#123D2A]">{rev.user?.name || 'Ayurveda Practitioner'}</span>
                  <div className="flex text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#243229]/80">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
