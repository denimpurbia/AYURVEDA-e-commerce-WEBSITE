import React from 'react';
import { Truck, RefreshCw, Award, Headphones } from 'lucide-react';

const BenefitsStrip = () => {
  const benefits = [
    {
      icon: Truck,
      title: 'FREE SHIPPING',
      subtitle: 'On orders above ₹999',
      bgColor: 'bg-[#DDECDA]',
      iconColor: 'text-[#123D2A]',
    },
    {
      icon: RefreshCw,
      title: 'EASY RETURNS',
      subtitle: '7-day return policy',
      bgColor: 'bg-[#F9ECCF]',
      iconColor: 'text-[#7A6248]',
    },
    {
      icon: Award,
      title: 'PREMIUM QUALITY',
      subtitle: 'Finest ingredients',
      bgColor: 'bg-[#DDECDA]',
      iconColor: 'text-[#123D2A]',
    },
    {
      icon: Headphones,
      title: '24/7 SUPPORT',
      subtitle: "We're here to help",
      bgColor: 'bg-[#F9ECCF]',
      iconColor: 'text-[#7A6248]',
    },
  ];

  return (
    <div className="relative -mt-10 sm:-mt-12 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#FFFDF8] border border-[#EAE1D2] rounded-2xl sm:rounded-full shadow-card p-6 md:py-6 md:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#EAE1D2]">
          {benefits.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`flex items-center space-x-4 ${
                  index !== 0 ? 'pt-4 sm:pt-0 sm:pl-6' : ''
                }`}
              >
                <div className={`w-12 h-12 rounded-full ${item.bgColor} flex items-center justify-center shrink-0 shadow-xs`}>
                  <Icon className={`w-6 h-6 ${item.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-xs font-bold tracking-widest text-[#123D2A] uppercase">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#7A6248] font-medium mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BenefitsStrip;
