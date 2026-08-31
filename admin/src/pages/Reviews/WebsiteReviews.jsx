import React, { useEffect, useState } from 'react';
import {
  Star,
  Check,
  X,
  Trash2,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

import API from '../../services/api';

const WebsiteReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // ==========================================
  // FETCH ALL WEBSITE EXPERIENCE REVIEWS
  // ==========================================

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const res = await API.get('/reviews/admin/all');

      if (res.success) {
        setReviews(res.data || []);
      }
    } catch (error) {
      console.error(
        'Failed to fetch website reviews:',
        error
      );

      alert(
        error?.message ||
          'Failed to load website reviews'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // ==========================================
  // APPROVE REVIEW
  // ==========================================

  const handleApprove = async (reviewId) => {
    try {
      setActionLoading(reviewId);

      const res = await API.put(
        `/reviews/${reviewId}/approve`
      );

      if (res.success) {
        await fetchReviews();
      }
    } catch (error) {
      console.error(
        'Failed to approve review:',
        error
      );

      alert(
        error?.message ||
          'Failed to approve review'
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // REJECT REVIEW
  // ==========================================

  const handleReject = async (reviewId) => {
    try {
      setActionLoading(reviewId);

      const res = await API.put(
        `/reviews/${reviewId}/reject`
      );

      if (res.success) {
        await fetchReviews();
      }
    } catch (error) {
      console.error(
        'Failed to reject review:',
        error
      );

      alert(
        error?.message ||
          'Failed to reject review'
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // DELETE REVIEW
  // ==========================================

  const handleDelete = async (reviewId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this review?'
    );

    if (!confirmed) return;

    try {
      setActionLoading(reviewId);

      const res = await API.delete(
        `/reviews/${reviewId}`
      );

      if (res.success) {
        setReviews((prevReviews) =>
          prevReviews.filter(
            (review) =>
              review._id !== reviewId
          )
        );
      }
    } catch (error) {
      console.error(
        'Failed to delete review:',
        error
      );

      alert(
        error?.message ||
          'Failed to delete review'
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';

      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';

      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return 'N/A';

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#123D2A]" />
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="space-y-6">

      {/* PAGE HEADER */}

      <div>
        <h1 className="font-serif text-3xl font-bold text-[#123D2A]">
          Website Experience Reviews
        </h1>

        <p className="text-sm text-[#7A6248] mt-1">
          Manage customer feedback about their
          experience with AyurvedaMart.
        </p>
      </div>


      {/* REVIEW COUNT */}

      <div className="bg-white border border-[#EAE1D2] rounded-xl px-5 py-4">

        <p className="text-sm text-[#7A6248]">
          Total Website Reviews
        </p>

        <p className="text-2xl font-bold text-[#123D2A] mt-1">
          {reviews.length}
        </p>

      </div>


      {/* NO REVIEWS */}

      {reviews.length === 0 ? (

        <div className="bg-white border border-[#EAE1D2] rounded-2xl p-12 text-center">

          <h3 className="text-lg font-semibold text-[#123D2A]">
            No website reviews found
          </h3>

          <p className="text-sm text-[#7A6248] mt-2">
            Customer experience reviews will appear here.
          </p>

        </div>

      ) : (

        <div className="space-y-5">

          {reviews.map((review) => (

            <div
              key={review._id}
              className="bg-white border border-[#EAE1D2] rounded-2xl p-6 shadow-sm"
            >

              {/* TOP SECTION */}

              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">


                {/* CUSTOMER DETAILS */}

                <div>

                  <h3 className="font-semibold text-[#123D2A] text-lg">
                    {review.user?.name ||
                      'Unknown Customer'}
                  </h3>

                  <p className="text-sm text-[#7A6248]">
                    {review.user?.email ||
                      'Email not available'}
                  </p>

                </div>


                {/* STATUS */}

                <span
                  className={`inline-flex w-fit px-3 py-1 rounded-full border text-xs font-bold uppercase ${getStatusStyle(
                    review.status
                  )}`}
                >
                  {review.status}
                </span>

              </div>


              {/* STARS */}

              <div className="flex items-center gap-1 mt-5">

                {[1, 2, 3, 4, 5].map(
                  (star) => (

                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= review.rating
                          ? 'fill-[#C49A52] text-[#C49A52]'
                          : 'text-[#D9D1C3]'
                      }`}
                    />

                  )
                )}

                <span className="ml-2 text-sm font-semibold text-[#123D2A]">
                  {review.rating}/5
                </span>

              </div>


              {/* REVIEW COMMENT */}

              <div className="mt-5 bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl p-5">

                <p className="text-[#243229] italic leading-relaxed">
                  "{review.comment}"
                </p>

              </div>


              {/* BOTTOM */}

              <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-5">


                {/* REVIEW INFO */}

                <div>

                  {review.verifiedBuyer && (

                    <div className="flex items-center gap-2 text-sm text-[#789B72] font-medium">

                      <ShieldCheck className="w-4 h-4" />

                      Verified Customer

                    </div>

                  )}

                  <p className="text-xs text-[#7A6248] mt-2">

                    Submitted on{' '}

                    {formatDate(
                      review.createdAt
                    )}

                  </p>

                </div>


                {/* ACTION BUTTONS */}

                <div className="flex flex-wrap gap-3">


                  {/* APPROVE */}

                  {review.status !== 'approved' && (

                    <button
                      onClick={() =>
                        handleApprove(
                          review._id
                        )
                      }
                      disabled={
                        actionLoading ===
                        review._id
                      }
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50"
                    >

                      <Check className="w-4 h-4" />

                      Approve

                    </button>

                  )}


                  {/* REJECT */}

                  {review.status !== 'rejected' && (

                    <button
                      onClick={() =>
                        handleReject(
                          review._id
                        )
                      }
                      disabled={
                        actionLoading ===
                        review._id
                      }
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 text-sm font-semibold hover:bg-red-100 disabled:opacity-50"
                    >

                      <X className="w-4 h-4" />

                      Reject

                    </button>

                  )}


                  {/* DELETE */}

                  <button
                    onClick={() =>
                      handleDelete(
                        review._id
                      )
                    }
                    disabled={
                      actionLoading ===
                      review._id
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 disabled:opacity-50"
                  >

                    <Trash2 className="w-4 h-4" />

                    Delete

                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default WebsiteReviews;