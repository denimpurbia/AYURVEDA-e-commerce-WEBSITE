import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnnouncementBar from '../../components/layout/AnnouncementBar';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useCart } from '../../context/CartContext';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Truck,
  ImageOff,
} from 'lucide-react';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const items = cart.items || [];
  const subtotal = cart.subtotal || 0;
  const shippingFee = cart.shippingFee || 0;
  const totalAmount = cart.totalAmount || 0;

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col justify-between">
      <AnnouncementBar />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        
        <div className="border-b border-[#EAE1D2] pb-4 mb-8">
          <span className="text-xs font-bold tracking-widest text-[#7A6248] uppercase block mb-1">
            SHOPPING BAG
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#123D2A]">
            Your Cart ({items.length})
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-[#F7F2E8] p-12 text-center rounded-3xl border border-[#EAE1D2] space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#123D2A] text-white flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8 text-[#C49A52]" />
            </div>

            <h2 className="font-serif text-2xl font-bold text-[#123D2A]">
              Your Cart is Empty
            </h2>

            <p className="text-xs text-[#7A6248]">
              Explore our range of authentic Ayurvedic formulations and wellness products.
            </p>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#123D2A] text-white text-xs font-bold rounded-full hover:bg-[#0B2D1E]"
            >
              START SHOPPING
              <ArrowRight className="w-4 h-4 text-[#C49A52]" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-[#FFFDF8] rounded-2xl border border-[#EAE1D2] divide-y divide-[#EAE1D2]">

                {items.map((item) => {
                  const product = item.product || {};

                  const productId = product._id || product;

                  const name =
                    product.name ||
                    item.name ||
                    'Ayurvedic Product';

                  const price = item.price;

                  // ONLY REAL IMAGE FROM DATABASE
                  const image =
                    product.images?.[0] ||
                    product.image ||
                    item.image ||
                    '';

                  return (
                    <div
                      key={productId}
                      className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
                    >
                      <div className="flex items-center space-x-4">

                        {/* Product Image */}
                        <div className="w-20 h-20 rounded-xl bg-[#F7F2E8] p-2 flex items-center justify-center overflow-hidden">
                          {image ? (
                            <img
                              src={image}
                              alt={name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <ImageOff className="w-7 h-7 text-[#7A6248]" />
                          )}
                        </div>

                        <div>
                          <h3 className="font-serif font-bold text-sm text-[#123D2A]">
                            {name}
                          </h3>

                          <span className="text-xs text-[#7A6248] font-bold block mt-1">
                            ₹{price}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">

                        {/* Quantity Controls */}
                        <div className="flex items-center border border-[#EAE1D2] rounded-full bg-[#F7F2E8]">

                          <button
                            onClick={() =>
                              updateQuantity(
                                productId,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="p-1.5 hover:bg-[#EAE1D2] rounded-l-full text-[#123D2A]"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <span className="px-3 text-xs font-bold text-[#123D2A]">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(
                                productId,
                                item.quantity + 1
                              )
                            }
                            className="p-1.5 hover:bg-[#EAE1D2] rounded-r-full text-[#123D2A]"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="font-bold text-sm text-[#123D2A] w-16 text-right">
                          ₹{price * item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            removeFromCart(productId)
                          }
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-2">
                <Link
                  to="/shop"
                  className="text-xs font-bold text-[#123D2A] hover:underline"
                >
                  ← Continue Shopping
                </Link>

                <button
                  onClick={clearCart}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 bg-[#F7F2E8] p-6 rounded-2xl border border-[#EAE1D2] space-y-6">

              <h3 className="font-serif font-bold text-xl text-[#123D2A]">
                Order Summary
              </h3>

              {subtotal < 999 && (
                <div className="p-3 bg-[#FFFDF8] rounded-xl border border-[#789B72]/40 text-xs text-[#123D2A] flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#C49A52] shrink-0" />

                  <span>
                    Add <strong>₹{999 - subtotal}</strong> more for{' '}
                    <strong>FREE SHIPPING</strong>!
                  </span>
                </div>
              )}

              <div className="space-y-3 text-xs font-medium text-[#243229]">

                <div className="flex justify-between">
                  <span>Subtotal</span>

                  <span className="font-bold text-[#123D2A]">
                    ₹{subtotal}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping Fee</span>

                  <span className="font-bold text-[#123D2A]">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold">
                        FREE
                      </span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#EAE1D2] flex justify-between text-sm font-bold text-[#123D2A]">
                  <span>Total Amount</span>

                  <span className="text-lg">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-[#123D2A] text-white text-xs font-bold tracking-widest rounded-full hover:bg-[#0B2D1E] shadow-md flex items-center justify-center gap-2"
              >
                PROCEED TO CHECKOUT

                <ArrowRight className="w-4 h-4 text-[#C49A52]" />
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;