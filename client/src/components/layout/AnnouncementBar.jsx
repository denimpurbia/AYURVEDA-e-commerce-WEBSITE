import React from 'react';
import { Truck, RotateCcw, CreditCard, Phone, Smartphone } from 'lucide-react';

const AnnouncementBar = () => {
  return (
    <div className="bg-[#123D2A] text-white text-xs py-2 px-4 border-b border-[#1B543B]">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center space-x-6 mx-auto md:mx-0 overflow-x-auto py-0.5 whitespace-nowrap text-[11px] font-medium tracking-wide">
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-[#C49A52]" />
            FREE SHIPPING ON ORDERS ABOVE ₹999
          </span>
          <span className="hidden sm:inline text-white/30">|</span>
          <span className="flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5 text-[#C49A52]" />
            EASY 7-DAY RETURNS
          </span>
          <span className="hidden md:inline text-white/30">|</span>
          <span className="hidden md:flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-[#C49A52]" />
            COD AVAILABLE
          </span>
        </div>

        <div className="hidden lg:flex items-center space-x-4 text-[11px] text-emerald-100/90 font-medium">
          <a href="tel:+919876543210" className="flex items-center gap-1 hover:text-[#C49A52] transition-colors">
            <Phone className="w-3 h-3 text-[#C49A52]" />
            +91 98765 43210
          </a>
          <span className="text-white/30">|</span>
          <span className="flex items-center gap-1 cursor-pointer hover:text-[#C49A52] transition-colors">
            <Smartphone className="w-3 h-3 text-[#C49A52]" />
            Download App & Get 10% Off 🌿
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
