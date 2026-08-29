import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Star,
  ShoppingBag,
  Check,
  ImageOff,
} from 'lucide-react';

import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [added, setAdded] = React.useState(false);

  const isLiked = isInWishlist(product._id);

  // ONLY REAL IMAGE FROM ADMIN PANEL / DATABASE
  const image =
    product.images?.[0] ||
    product.image ||
    '';

  const price =
    product.discountPrice > 0
      ? product.discountPrice
      : product.price;

  const originalPrice =
    product.discountPrice > 0
      ? product.price
      : null;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await addToCart(product, 1);

      setAdded(true);

      setTimeout(() => {
        setAdded(false);
      }, 2000);

    } catch (err) {
      console.error(err);
    }
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    toggleWishlist(product._id);
  };

  return (
    <div className="group bg-[#FFFDF8] rounded-2xl border border-[#EAE1D2] overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between">

      {/* Product Image Container */}
      <div className="relative aspect-square bg-[#F7F2E8] overflow-hidden p-4">

        <Link to={`/product/${product.slug || product._id}`}>

          {image ? (
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#7A6248]">

              <ImageOff className="w-10 h-10 mb-2 opacity-60" />

              <span className="text-xs">
                No Image Available
              </span>

            </div>
          )}

        </Link>


        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-[#123D2A] hover:bg-white hover:text-[#C49A52] transition-colors"
          aria-label="Wishlist"
        >

          <Heart
            className={`w-4 h-4 ${
              isLiked
                ? 'fill-[#C49A52] text-[#C49A52]'
                : ''
            }`}
          />

        </button>


        {/* Discount Badge */}
        {originalPrice && (
          <span className="absolute top-3 left-3 bg-[#123D2A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">

            {Math.round(
              ((originalPrice - price) / originalPrice) * 100
            )}% OFF

          </span>
        )}

      </div>


      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">

        <div>

          <Link
            to={`/product/${product.slug || product._id}`}
            className="block"
          >

            <h3 className="font-serif font-bold text-sm text-[#123D2A] group-hover:text-[#C49A52] transition-colors line-clamp-1">

              {product.name}

            </h3>

          </Link>


          {/* Rating */}
          <div className="flex items-center space-x-1 mt-1">

            <div className="flex items-center text-amber-500">

              {[...Array(5)].map((_, i) => (

                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating || 0)
                      ? 'fill-current text-amber-500'
                      : 'text-gray-300'
                  }`}
                />

              ))}

            </div>


            <span className="text-[11px] font-medium text-[#7A6248] ml-1">

              ({product.numReviews || 0})

            </span>

          </div>

        </div>


        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between pt-2 border-t border-[#EAE1D2]/60">

          <div>

            <span className="font-bold text-base text-[#123D2A]">

              ₹{price}

            </span>


            {originalPrice && (

              <span className="text-xs text-gray-400 line-through ml-1.5">

                ₹{originalPrice}

              </span>

            )}

          </div>


          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`p-2 rounded-full transition-all ${
              added
                ? 'bg-emerald-700 text-white'
                : product.stock === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#123D2A] text-white hover:bg-[#0B2D1E] hover:scale-105'
            }`}
            title={
              product.stock === 0
                ? 'Out of Stock'
                : 'Add to Cart'
            }
          >

            {added ? (

              <Check className="w-4 h-4" />

            ) : (

              <ShoppingBag className="w-4 h-4" />

            )}

          </button>

        </div>

      </div>

    </div>
  );
};

export default ProductCard;