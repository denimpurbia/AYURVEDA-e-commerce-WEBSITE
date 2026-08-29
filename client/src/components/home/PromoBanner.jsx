import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PromoBannerImage from '../../assets/Mahabhringraj Tel.jpeg';

const PromoBanner = () => {
  return (
    <section className="py-8 bg-[#FFFDF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#EAE1D2]/50 border border-[#EAE1D2] shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            {/* Left Content Area */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 space-y-4 z-10">
              <span className="text-xs font-bold tracking-widest text-[#7A6248] uppercase block">
                WELLNESS ESSENTIALS
              </span>

              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#123D2A] leading-tight">
                UP TO 20% OFF
              </h2>

              <p className="text-sm sm:text-base text-[#243229]/80 font-medium">
                On selected Ayurvedic formulations, pure churnas & cold-pressed oils.
              </p>

              <div className="pt-4">
                <Link
                  to="/shop?offer=true"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#123D2A] text-white text-xs font-bold tracking-widest rounded-full hover:bg-[#0B2D1E] transition-all shadow-md group"
                >
                  SHOP THE COLLECTION
                  <ArrowRight className="w-4 h-4 text-[#C49A52] group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Still Life Image + Circular Badge matching Reference image */}
            <div className="lg:col-span-6 relative h-64 sm:h-80 lg:h-96 w-full">
              <img
                src={PromoBannerImage}
                alt="Mahabhringraj Tel - Ayurvedic Hair & Wellness Oil"
                className="w-full h-full object-cover object-center"
              />
              
              {/* Circular Stamp Overlay */}
              <div className="absolute top-6 right-6 hidden sm:flex w-24 h-24 rounded-full border-2 border-dashed border-[#123D2A]/60 bg-[#FFFDF8]/80 backdrop-blur-sm items-center justify-center p-2 text-center shadow-lg">
                <span className="text-[9px] font-bold text-[#123D2A] tracking-wider leading-tight uppercase">
                  INSPIRED BY NATURE • BACKED BY AYURVEDA
                </span>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
