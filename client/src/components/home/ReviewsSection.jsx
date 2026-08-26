import React from 'react';
import { Star, Quote, ShieldCheck } from 'lucide-react';

const reviewsData = [
  {
    id: 1,
    rating: 5,
    quote: "The products are 100% authentic and really effective. My go-to store for Ayurvedic essentials!",
    name: "Priya Sharma",
    verified: true,
  },
  {
    id: 2,
    rating: 5,
    quote: "Amazing quality and fast delivery. Ayurvedamart has made wellness truly easy and trustworthy.",
    name: "Rahul Verma",
    verified: true,
  },
  {
    id: 3,
    rating: 5,
    quote: "Loved the packaging and the quality. You can feel the purity in every product.",
    name: "Neha Kapoor",
    verified: true,
  },
];

const ReviewsSection = () => {
  return (
    <section className="py-20 bg-[#F7F2E8]/50 border-t border-[#EAE1D2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest text-[#7A6248] uppercase block mb-1">
            TESTIMONIALS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#123D2A]">
            CUSTOMER STORIES
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviewsData.map((review) => (
            <div
              key={review.id}
              className="bg-[#FFFDF8] rounded-2xl p-8 border border-[#EAE1D2] shadow-card relative flex flex-col justify-between"
            >
              <Quote className="w-10 h-10 text-[#789B72]/20 absolute top-6 right-6" />

              <div className="space-y-4">
                <div className="flex items-center text-amber-500 space-x-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-sm text-[#243229]/80 font-medium italic leading-relaxed">
                  "{review.quote}"
                </p>
              </div>

              <div className="pt-6 border-t border-[#EAE1D2]/60 flex items-center justify-between mt-6">
                <div>
                  <h4 className="text-xs font-bold text-[#123D2A]">
                    — {review.name}
                  </h4>
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#789B72]">
                      <ShieldCheck className="w-3 h-3 text-[#789B72]" /> Verified Buyer
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ReviewsSection;
