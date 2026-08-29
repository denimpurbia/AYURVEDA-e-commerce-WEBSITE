import React from 'react';
import { Bot, Search, Wallet, ShoppingCart, Truck } from 'lucide-react';
import aiAssistantImg from '../../assets/ai-assistant-banner.png';

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
    <section className="py-6 sm:py-8 bg-[#FFFDF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0B2D1E] via-[#123D2A] to-[#0B2D1E] text-white p-6 sm:p-8 lg:p-10 shadow-2xl border border-[#789B72]/30">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center relative z-10">
            
            {/* Left Header & Features */}
            <div className="lg:col-span-6 space-y-5">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C49A52]/20 text-[#C49A52] text-xs font-bold tracking-widest uppercase">
                  <Bot className="w-4 h-4 text-[#C49A52]" />
                  AI ASSISTANT
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-wide">
                  MEET AYURVEDA AI
                </h2>
                <p className="text-sm text-emerald-100/90 font-medium">
                  Your personal Ayurvedic shopping assistant. Click the assistant to start chatting!
                </p>
              </div>

              {/* 4 Capability Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
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

            {/* Right Clickable AI Mascot Image */}
            <div className="lg:col-span-6 flex items-center justify-center lg:justify-center">
              <button
                type="button"
                onClick={onOpenAiChat}
                title="Click to chat with Ayurveda AI"
                className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg group cursor-pointer focus:outline-none transition-transform duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
              >
                <img
                  src={aiAssistantImg}
                  alt="Ayurveda AI Assistant - Click to Chat"
                  className="w-full h-auto max-h-80 sm:max-h-96 lg:max-h-[420px] object-contain drop-shadow-2xl transition-all duration-300 group-hover:brightness-110"
                />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default AiBanner;
