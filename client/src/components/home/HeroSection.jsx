import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, ShieldCheck, Award } from 'lucide-react';

const HeroSection = ({ onWatchFilm }) => {
  return (
    <section className="relative w-full overflow-hidden border-b border-[#EAE1D2] bg-[#F7F2E8]">
      {/* Full-bleed Background Image spanning the entire Hero Section */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-no-repeat bg-[position:center_right]"
        style={{ backgroundImage: `url('/images/hero-banner.png')` }}
      />

      {/* Smooth Gradient Overlay from Left (Cream) to Right (Transparent) for readability */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(247,242,232,0.98) 0%, rgba(247,242,232,0.95) 30%, rgba(247,242,232,0.65) 52%, rgba(247,242,232,0) 78%)'
        }}
      />

      {/* Hero Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 md:pt-14 md:pb-24 min-h-[480px] lg:min-h-[540px] flex flex-col justify-center">
        
        {/* Left Content Overlay (sit directly over left side of background image) */}
        <div className="max-w-xl space-y-6">
          <span className="text-xs font-bold tracking-[0.2em] text-[#7A6248] uppercase block">
            ANCIENT WISDOM. MODERN WELLNESS.
          </span>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#243229] leading-[1.12] tracking-tight">
            NATURE’S <br />
            <span className="text-[#123D2A] font-serif">WISDOM</span> <br />
            REIMAGINED.
          </h1>

          <p className="text-sm sm:text-base text-[#243229]/80 font-medium max-w-md leading-relaxed">
            Authentic Ayurvedic essentials crafted for your everyday wellness.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#123D2A] text-white text-xs font-bold tracking-widest uppercase rounded-full hover:bg-[#0B2D1E] transition-all shadow-md hover:shadow-lg group"
            >
              SHOP COLLECTION
              <ArrowRight className="w-4 h-4 text-[#C49A52] group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-transparent border-2 border-[#123D2A]/30 text-[#123D2A] text-xs font-bold tracking-widest uppercase rounded-full hover:bg-[#123D2A] hover:text-white transition-all"
            >
              EXPLORE AYURVEDA
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#EAE1D2]/80 max-w-md">
            <div className="flex items-start space-x-2">
              <Leaf className="w-4 h-4 text-[#789B72] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] font-bold text-[#123D2A]">100% Natural</h4>
                <p className="text-[10px] text-[#7A6248] leading-tight">Authentic Ingredients</p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Award className="w-4 h-4 text-[#C49A52] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] font-bold text-[#123D2A]">Ayurveda</h4>
                <p className="text-[10px] text-[#7A6248] leading-tight">Trusted by Generations</p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#789B72] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] font-bold text-[#123D2A]">Safe & Effective</h4>
                <p className="text-[10px] text-[#7A6248] leading-tight">Quality Assured</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
