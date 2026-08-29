import React from 'react';
import { Leaf, Shield, Heart, Sparkles } from 'lucide-react';

const StorySection = () => {
  const values = [
    {
      icon: Leaf,
      title: 'AUTHENTIC',
      desc: 'Ayurvedic products crafted with real herbs.',
    },
    {
      icon: Sparkles,
      title: 'CHEMICAL FREE',
      desc: 'No harmful chemicals, only pure goodness.',
    },
    {
      icon: Shield,
      title: 'SUSTAINABLE',
      desc: 'Eco-friendly sourcing for a better planet.',
    },
    {
      icon: Heart,
      title: 'TRUSTED',
      desc: 'Loved by thousands of happy customers.',
    },
  ];

  return (
    <section className="py-20 bg-[#F7F2E8]/70 border-y border-[#EAE1D2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Herbal Image */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl bg-[#EAE1D2] aspect-[4/3] sm:aspect-square">
              <img
                src="/images/about-us.jpg"
                alt="Ayurvedic mortar pestle and raw herbs preparation"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* Right Text + 4 Pillars Grid matching Reference Image */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-bold tracking-widest text-[#7A6248] uppercase block">
                OUR PHILOSOPHY
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#123D2A] leading-tight">
                ROOTED IN ANCIENT WISDOM
              </h2>
              <p className="text-sm sm:text-base text-[#243229]/80 font-medium max-w-xl leading-relaxed">
                Ayurveda is the science of life. We bring you the finest natural formulations, crafted with utmost care, ethical sourcing, and classical authenticity to restore harmony in daily life.
              </p>
            </div>

            {/* 4 Brand Value Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-[#EAE1D2]">
              {values.map((v, idx) => {
                const Icon = v.icon;
                return (
                  <div key={idx} className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-[#FFFDF8] border border-[#789B72]/30 flex items-center justify-center text-[#123D2A] mx-auto shadow-sm">
                      <Icon className="w-5 h-5 text-[#123D2A]" />
                    </div>
                    <h4 className="text-xs font-bold tracking-wider text-[#123D2A] uppercase">
                      {v.title}
                    </h4>
                    <p className="text-[11px] text-[#7A6248] leading-snug">
                      {v.desc}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default StorySection;
