import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnnouncementBar from '../../components/layout/AnnouncementBar';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { CreditCard, ArrowRight } from 'lucide-react';

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [loading, setLoading] = useState(false);

  const items = cart.items || [];
  const subtotal = cart.subtotal || 0;
  const shippingFee = cart.shippingFee || 0;
  const totalAmount = cart.totalAmount || 0;

  // Fill address after user data is loaded
  useEffect(() => {
    if (user) {
      setShippingAddress({
        name: user.name || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        pincode: user.address?.pincode || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setShippingAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Wait until authentication check is completed
    if (authLoading) {
      return;
    }

    // User must be logged in
    if (!user) {
      alert('Please login to place an order.');
      navigate('/login?redirect=/checkout');
      return;
    }

    // Cart must contain products
    if (items.length === 0) {
      alert('Your cart is empty.');
      navigate('/shop');
      return;
    }

    // Validate address
    if (
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      alert('Please fill in all shipping details.');
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        shippingAddress: {
          name: shippingAddress.name,
          phone: shippingAddress.phone,
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
        },

        items: items.map((item) => ({
          product: item.product?._id || item.product,
          name: item.product?.name || item.name,
          quantity: item.quantity,
          price: item.price,
          image:
            item.product?.images?.[0] ||
            item.image ||
            '',
        })),

        subtotal,
        shippingFee,
        totalAmount,
        paymentMethod: 'Cash on Delivery',
      };

      console.log('Creating order:', orderData);

      const res = await API.post('/orders', orderData);

      console.log('Order response:', res);

      if (res.success) {
        await clearCart();

        alert('🎉 Order placed successfully via Cash on Delivery!');

        navigate('/orders');
      } else {
        alert(res.message || 'Failed to place order.');
      }
    } catch (err) {
      console.error('Order placement error:', err);
      alert(err.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  // Wait for authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#123D2A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-xs font-bold text-[#123D2A]">
            Checking your account...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col justify-between">
      <AnnouncementBar />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">

        {/* Header */}
        <div className="border-b border-[#EAE1D2] pb-4 mb-8">
          <span className="text-xs font-bold tracking-widest text-[#7A6248] uppercase block mb-1">
            CHECKOUT
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#123D2A]">
            Delivery & Payment
          </h1>
        </div>

        <form
          onSubmit={handlePlaceOrder}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >

          {/* LEFT SIDE */}
          <div className="lg:col-span-7 space-y-6">

            {/* Shipping Details */}
            <div className="bg-[#FFFDF8] p-6 rounded-2xl border border-[#EAE1D2] space-y-4">

              <h3 className="font-serif font-bold text-xl text-[#123D2A]">
                Shipping Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Name */}
                <div>
                  <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    required
                    value={shippingAddress.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    required
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Street */}
              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">
                  Street Address
                </label>

                <input
                  type="text"
                  name="street"
                  required
                  placeholder="House No, Street, Colony..."
                  value={shippingAddress.street}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                />
              </div>

              {/* City / State / Pincode */}
              <div className="grid grid-cols-3 gap-4">

                <div>
                  <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    required
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    required
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">
                    Pincode
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    required
                    value={shippingAddress.pincode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                  />
                </div>

              </div>
            </div>

            {/* Payment */}
            <div className="bg-[#FFFDF8] p-6 rounded-2xl border border-[#EAE1D2] space-y-3">

              <h3 className="font-serif font-bold text-xl text-[#123D2A]">
                Payment Option
              </h3>

              <div className="p-4 bg-[#F7F2E8] rounded-xl border border-[#789B72]/40 flex items-center justify-between">

                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-[#123D2A]" />

                  <div>
                    <h4 className="text-xs font-bold text-[#123D2A]">
                      Cash on Delivery (COD)
                    </h4>

                    <p className="text-[10px] text-[#7A6248]">
                      Pay with cash upon delivery at your doorstep.
                    </p>
                  </div>
                </div>

                <span className="w-4 h-4 rounded-full bg-[#123D2A] border-2 border-white ring-2 ring-[#123D2A]" />

              </div>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-5 bg-[#F7F2E8] p-6 rounded-2xl border border-[#EAE1D2] space-y-6">

            <h3 className="font-serif font-bold text-xl text-[#123D2A]">
              Order Overview
            </h3>

            {/* Items */}
            <div className="space-y-3 max-h-60 overflow-y-auto">

              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs py-2 border-b border-[#EAE1D2]"
                >
                  <span className="font-semibold text-[#123D2A] line-clamp-1">
                    {item.product?.name || item.name} x {item.quantity}
                  </span>

                  <span className="font-bold text-[#123D2A]">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}

            </div>

            {/* Totals */}
            <div className="space-y-2 text-xs text-[#243229] pt-2">

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping Fee</span>

                <span>
                  {shippingFee === 0
                    ? 'FREE'
                    : `₹${shippingFee}`}
                </span>
              </div>

              <div className="pt-3 border-t border-[#EAE1D2] flex justify-between text-base font-bold text-[#123D2A]">
                <span>Total Amount</span>
                <span>₹{totalAmount}</span>
              </div>

            </div>

            {/* Place Order */}
            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="w-full py-4 bg-[#123D2A] text-white text-xs font-bold tracking-widest rounded-full hover:bg-[#0B2D1E] shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? 'PROCESSING ORDER...'
                : 'PLACE ORDER (COD)'}

              <ArrowRight className="w-4 h-4 text-[#C49A52]" />
            </button>

          </div>

        </form>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;