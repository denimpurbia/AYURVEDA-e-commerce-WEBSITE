import React, { useEffect, useState } from 'react';
import { Star, Quote, ShieldCheck } from 'lucide-react';
import API from '../../services/api';

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH APPROVED REVIEWS
  // ==========================================

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await API.get('/reviews');

        if (res.success && res.data) {
          setReviews(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <section className="py-20 bg-[#F7F2E8]/50 border-t border-[#EAE1D2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADING */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest text-[#7A6248] uppercase block mb-1">
            TESTIMONIALS
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#123D2A]">
            CUSTOMER STORIES
          </h2>
        </div>

        {/* LOADING */}
        {loading ? (
          <p className="text-center text-sm text-[#7A6248]">
            Loading customer reviews...
          </p>

        ) : reviews.length === 0 ? (
          /* NO REVIEWS */
          <p className="text-center text-sm text-[#7A6248]">
            No customer reviews available yet.
          </p>

        ) : (
          /* REVIEWS */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-[#FFFDF8] rounded-2xl p-8 border border-[#EAE1D2] shadow-card relative flex flex-col justify-between"
              >

                {/* QUOTE ICON */}
                <Quote className="w-10 h-10 text-[#789B72]/20 absolute top-6 right-6" />

                <div className="space-y-4">

                  {/* STARS */}
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? 'fill-[#C49A52] text-[#C49A52]'
                            : 'text-[#D9D1C3]'
                        }`}
                      />
                    ))}
                  </div>

                  {/* COMMENT */}
                  <p className="text-sm text-[#243229]/80 font-medium italic leading-relaxed">
                    "{review.comment}"
                  </p>

                </div>

                {/* CUSTOMER INFO */}
                <div className="pt-6 border-t border-[#EAE1D2]/60 flex items-center justify-between mt-6">

                  <div>

                    {/* CUSTOMER NAME */}
                    <h4 className="text-xs font-bold text-[#123D2A]">
                      — {review.user?.name || 'Customer'}
                    </h4>

                    {/* VERIFIED */}
                    {review.verifiedBuyer && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#789B72]">
                        <ShieldCheck className="w-3 h-3 text-[#789B72]" />
                        Verified Customer
                      </span>
                    )}

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </section>
  );
};

export default ReviewsSection;