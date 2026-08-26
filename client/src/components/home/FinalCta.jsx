import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf } from 'lucide-react';

const FinalCta = () => {
  return (
    <section className="py-20 bg-[#123D2A] text-white text-center relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
        <div className="w-12 h-12 rounded-full bg-[#C49A52]/20 border border-[#C49A52] flex items-center justify-center mx-auto text-[#C49A52]">
          <Leaf className="w-6 h-6" />
        </div>

        <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white">
          YOUR WELLNESS <br />
          STARTS HERE.
        </h2>

        <p className="text-xs sm:text-sm text-emerald-100/90 font-medium max-w-lg mx-auto">
          Transform your daily routine with authentic Ayurvedic kadhas, cold-pressed oils, pure powders, and herbal formulations.
        </p>

        <div className="pt-4">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-9 py-4 bg-[#C49A52] text-[#0B2D1E] text-xs font-bold tracking-widest rounded-full hover:bg-white transition-all shadow-2xl group"
          >
            SHOP NOW
            <ArrowRight className="w-4 h-4 text-[#0B2D1E] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FinalCta;
