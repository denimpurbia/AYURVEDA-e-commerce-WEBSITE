import React, { useState } from 'react';
import { Send, Leaf, Shield, Award, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

const NewsletterSection = () => {
  const { user } = useAuth();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage('Please login first to submit a review.');
      return;
    }

    if (!comment.trim()) {
      setMessage('Please write your review.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const res = await API.post('/reviews', {
        rating,
        comment,
      });

      if (res.success) {
        setMessage(
          'Thank you! Your review has been submitted and is waiting for admin approval.'
        );

        setComment('');
        setRating(5);
      }
    } catch (error) {
      setMessage(error.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-[#FFFDF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* REVIEW FORM */}
          <div className="lg:col-span-6 bg-[#123D2A] text-white rounded-3xl p-8 sm:p-12 flex flex-col justify-between shadow-xl">

            <div className="space-y-4">
              <span className="text-xs font-bold tracking-widest text-[#C49A52] uppercase block">
                SHARE YOUR EXPERIENCE
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                HOW WAS YOUR EXPERIENCE?
              </h2>

              <p className="text-xs sm:text-sm text-emerald-100/90 font-medium max-w-md">
                Your feedback helps us improve and helps others discover
                authentic Ayurvedic wellness products.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-4"
            >

              {/* RATING */}
              <div>
                <p className="text-xs font-semibold text-[#C49A52] mb-2">
                  YOUR RATING
                </p>

                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      aria-label={`${star} star rating`}
                    >
                      <Star
                        className={`w-6 h-6 transition ${
                          star <= rating
                            ? 'fill-[#C49A52] text-[#C49A52]'
                            : 'text-gray-400'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* COMMENT */}
              <textarea
                placeholder="Write your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows="4"
                className="w-full px-5 py-3 text-sm text-[#243229] bg-[#FFFDF8] rounded-xl focus:outline-none resize-none"
              />

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#C49A52] text-[#123D2A] rounded-full text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-60"
              >
                <Send className="w-4 h-4" />

                {loading
                  ? 'SUBMITTING...'
                  : 'SUBMIT REVIEW'}
              </button>

              {message && (
                <p className="text-xs text-center text-[#C49A52] font-semibold">
                  {message}
                </p>
              )}

            </form>
          </div>

          {/* RIGHT BRAND SECTION */}
          <div className="lg:col-span-6 bg-[#F7F2E8] border border-[#EAE1D2] rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-8 shadow-card">

            <div className="space-y-6 flex-1 text-center sm:text-left">

              <div className="flex items-center space-x-3 justify-center sm:justify-start">
                <Leaf className="w-6 h-6 text-[#789B72]" />

                <div>
                  <h4 className="text-xs font-bold text-[#123D2A] uppercase">
                    NATURAL
                  </h4>

                  <p className="text-[11px] text-[#7A6248]">
                    Always Natural, Always Pure
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 justify-center sm:justify-start">
                <Award className="w-6 h-6 text-[#C49A52]" />

                <div>
                  <h4 className="text-xs font-bold text-[#123D2A] uppercase">
                    QUALITY
                  </h4>

                  <p className="text-[11px] text-[#7A6248]">
                    Premium quality, best results
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 justify-center sm:justify-start">
                <Shield className="w-6 h-6 text-[#789B72]" />

                <div>
                  <h4 className="text-xs font-bold text-[#123D2A] uppercase">
                    TRUST
                  </h4>

                  <p className="text-[11px] text-[#7A6248]">
                    Trusted by thousands
                  </p>
                </div>
              </div>

            </div>

            {/* IMAGE */}
            <div className="w-48 bg-white p-3 rounded-lg shadow-md rotate-3 transform hover:rotate-0 transition-transform duration-300 shrink-0 border border-[#EAE1D2]">

              <div className="aspect-[4/3] rounded overflow-hidden mb-2">
                <img
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400"
                  alt="Ayurvedic wellness"
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-[10px] font-serif font-bold text-center text-[#123D2A]">
                Nature. Wellness. You.
              </p>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;