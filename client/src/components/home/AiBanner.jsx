import React from 'react';
import { Bot, Search, Wallet, ShoppingCart, Truck, ArrowRight } from 'lucide-react';

const AiBanner = ({ onOpenAiChat }) => {
  const features = [
    {
      icon: Search,
      title: 'Find Products',
      desc: 'Get product recommendations',
    },
    {
      icon: Wallet,
      title: 'Shop by Budget',
      desc: 'Find best products in your budget',
    },
    {
      icon: ShoppingCart,
      title: 'Manage Cart',
      desc: 'Add, remove and manage cart',
    },
    {
      icon: Truck,
      title: 'Track Orders',
      desc: 'Check order status and history',
    },
  ];

  return (
    <section className="py-12 bg-[#FFFDF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0B2D1E] via-[#123D2A] to-[#0B2D1E] text-white p-8 sm:p-12 shadow-2xl border border-[#789B72]/30">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Header & Features */}
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C49A52]/20 text-[#C49A52] text-xs font-bold tracking-widest uppercase">
                  <Bot className="w-4 h-4 text-[#C49A52]" />
                  AI ASSISTANT
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-wide">
                  MEET AYURVEDA AI
                </h2>
                <p className="text-sm text-emerald-100/90 font-medium">
                  Your personal Ayurvedic shopping assistant.
                </p>
              </div>

              {/* 4 Capability Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {features.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div key={i} className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10 space-y-1 hover:bg-white/10 transition-colors">
                      <Icon className="w-5 h-5 text-[#C49A52]" />
                      <h4 className="text-xs font-bold text-white">{f.title}</h4>
                      <p className="text-[10px] text-emerald-100/70 leading-snug">{f.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Action Button & AI Bot Avatar matching Reference Image */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#C49A52] to-[#789B72] p-1 shadow-lg animate-pulse">
                <div className="w-full h-full rounded-full bg-[#0B2D1E] flex items-center justify-center text-[#C49A52]">
                  <Bot className="w-10 h-10" />
                </div>
              </div>

              <button
                onClick={onOpenAiChat}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FFFDF8] text-[#123D2A] text-xs font-bold tracking-widest rounded-full hover:bg-[#C49A52] hover:text-white transition-all shadow-xl group"
              >
                CHAT WITH AI ASSISTANT
                <ArrowRight className="w-4 h-4 text-[#123D2A] group-hover:text-white group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default AiBanner;
