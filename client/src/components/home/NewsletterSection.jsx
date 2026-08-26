import React, { useState } from 'react';
import { Send, Leaf, Shield, Award } from 'lucide-react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-16 bg-[#FFFDF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Dark Green Newsletter Signup Card */}
          <div className="lg:col-span-6 bg-[#123D2A] text-white rounded-3xl p-8 sm:p-12 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <span className="text-xs font-bold tracking-widest text-[#C49A52] uppercase block">
                NEWSLETTER
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                JOIN THE WELLNESS JOURNEY
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 font-medium max-w-md">
                Be the first to know about new products, exclusive offers and Ayurvedic wellness tips.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8">
              <div className="flex items-center bg-[#FFFDF8] rounded-full p-1.5 shadow-inner">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-4 py-2 text-xs text-[#243229] bg-transparent focus:outline-none placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  className="w-10 h-10 rounded-full bg-[#123D2A] text-white flex items-center justify-center hover:bg-[#0B2D1E] transition-colors shrink-0"
                  aria-label="Subscribe"
                >
                  <Send className="w-4 h-4 text-[#C49A52]" />
                </button>
              </div>
              {subscribed && (
                <p className="text-xs text-[#C49A52] font-semibold mt-2">
                  Thank you for subscribing to Ayurvedic wellness! 🌿
                </p>
              )}
            </form>
          </div>

          {/* Right Brand Pillars & Polaroid Visual Card matching Reference */}
          <div className="lg:col-span-6 bg-[#F7F2E8] border border-[#EAE1D2] rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-8 shadow-card">
            
            {/* 3 Promises */}
            <div className="space-y-6 flex-1 text-center sm:text-left">
              <div className="flex items-center space-x-3 justify-center sm:justify-start">
                <Leaf className="w-6 h-6 text-[#789B72]" />
                <div>
                  <h4 className="text-xs font-bold text-[#123D2A] uppercase">NATURAL</h4>
                  <p className="text-[11px] text-[#7A6248]">Always Natural, Always Pure</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 justify-center sm:justify-start">
                <Award className="w-6 h-6 text-[#C49A52]" />
                <div>
                  <h4 className="text-xs font-bold text-[#123D2A] uppercase">QUALITY</h4>
                  <p className="text-[11px] text-[#7A6248]">Premium quality, best results</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 justify-center sm:justify-start">
                <Shield className="w-6 h-6 text-[#789B72]" />
                <div>
                  <h4 className="text-xs font-bold text-[#123D2A] uppercase">TRUST</h4>
                  <p className="text-[11px] text-[#7A6248]">Trusted by thousands</p>
                </div>
              </div>
            </div>

            {/* Polaroid Photo Style Visual matching Reference Image */}
            <div className="w-48 bg-white p-3 rounded-lg shadow-md rotate-3 transform hover:rotate-0 transition-transform duration-300 shrink-0 border border-[#EAE1D2]">
              <div className="aspect-[4/3] rounded overflow-hidden mb-2">
                <img
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400"
                  alt="Nature wellness landscape"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[10px] font-serif font-bold text-center text-[#123D2A]">
                Nature. Wellness. You.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
