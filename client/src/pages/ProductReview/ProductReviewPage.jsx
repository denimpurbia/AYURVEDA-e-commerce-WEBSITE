import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ProductReviewPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      productId,
      rating,
      comment,
    });

    alert('Review submitted successfully!');
    navigate('/orders');
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white border border-[#EAE1D2] rounded-2xl p-6 shadow-sm">
        <h1 className="text-3xl font-serif font-bold text-[#123D2A] mb-2">
          Write a Review
        </h1>

        <p className="text-sm text-[#7A6248] mb-6">
          Share your experience with this product.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-bold text-[#123D2A] mb-3">
              Your Rating
            </label>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-3xl ${
                    star <= rating
                      ? 'text-[#C9A452]'
                      : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-[#123D2A] mb-2">
              Your Review
            </label>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows="6"
              placeholder="Tell us about your experience..."
              className="w-full border border-[#EAE1D2] rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#123D2A]"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="flex-1 border border-[#123D2A] text-[#123D2A] py-3 rounded-full font-bold"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 bg-[#123D2A] text-white py-3 rounded-full font-bold"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductReviewPage;