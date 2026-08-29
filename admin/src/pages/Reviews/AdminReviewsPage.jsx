import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopbar from '../../components/AdminTopbar';
import adminApi from '../../services/adminApi';

import {
  Star,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH ALL REVIEWS
  // ==========================================

  const fetchReviews = async () => {
    try {
      setLoading(true);

      // IMPORTANT:
      // Get all reviews including pending, approved and rejected
      const res = await adminApi.get('/reviews/admin/all');

      if (res.success && res.data) {
        setReviews(res.data);
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to load reviews');
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
      const res = await adminApi.put(
        `/reviews/${reviewId}/approve`
      );

      if (res.success) {
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review._id === reviewId
              ? {
                  ...review,
                  status: 'approved',
                }
              : review
          )
        );

        alert('Review approved successfully');
      }
    } catch (err) {
      alert(err.message || 'Failed to approve review');
    }
  };

  // ==========================================
  // REJECT REVIEW
  // ==========================================

  const handleReject = async (reviewId) => {
    if (
      !window.confirm(
        'Are you sure you want to reject this review?'
      )
    ) {
      return;
    }

    try {
      const res = await adminApi.put(
        `/reviews/${reviewId}/reject`
      );

      if (res.success) {
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review._id === reviewId
              ? {
                  ...review,
                  status: 'rejected',
                }
              : review
          )
        );

        alert('Review rejected');
      }
    } catch (err) {
      alert(err.message || 'Failed to reject review');
    }
  };

  // ==========================================
  // DELETE REVIEW
  // ==========================================

  const handleDeleteReview = async (reviewId) => {
    if (
      !window.confirm(
        'Are you sure you want to permanently delete this review?'
      )
    ) {
      return;
    }

    try {
      const res = await adminApi.delete(
        `/reviews/${reviewId}`
      );

      if (res.success) {
        setReviews((prevReviews) =>
          prevReviews.filter(
            (review) =>
              review._id !== reviewId
          )
        );

        alert('Review deleted successfully');
      }
    } catch (err) {
      alert(
        err.message ||
          'Failed to delete review'
      );
    }
  };

  // ==========================================
  // STATUS BADGE
  // ==========================================

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );

      case 'rejected':
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );

      default:
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F2E8]/40">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">

          {/* HEADER */}
          <div>
            <h2 className="font-serif font-bold text-2xl text-[#123D2A]">
              Review Moderation
            </h2>

            <p className="text-xs text-[#7A6248] mt-1">
              Review customer feedback before it appears publicly on the website.
            </p>
          </div>

          {/* REVIEW LIST */}
          <div className="bg-[#FFFDF8] p-6 rounded-2xl border border-[#EAE1D2] shadow-xs">

            {loading ? (
              <p className="text-xs font-bold text-[#123D2A] py-10 text-center">
                Loading reviews...
              </p>

            ) : reviews.length === 0 ? (
              <div className="py-12 text-center">
                <Star className="w-8 h-8 text-[#C49A52] mx-auto mb-3" />

                <p className="text-sm font-semibold text-[#123D2A]">
                  No customer reviews yet
                </p>

                <p className="text-xs text-[#7A6248] mt-1">
                  Customer reviews will appear here for moderation.
                </p>
              </div>

            ) : (
              <div className="space-y-4">

                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="p-5 bg-[#F7F2E8]/60 rounded-xl border border-[#EAE1D2]"
                  >

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

                      {/* REVIEW CONTENT */}
                      <div className="space-y-2 flex-1">

                        {/* USER */}
                        <div className="flex items-center justify-between gap-3 flex-wrap">

                          <div>
                            <h3 className="font-bold text-sm text-[#123D2A]">
                              {review.user?.name || 'Customer'}
                            </h3>

                            <p className="text-[10px] text-[#7A6248]">
                              {review.user?.email || ''}
                            </p>
                          </div>

                          {getStatusBadge(review.status)}
                        </div>

                        {/* STARS */}
                        <div className="flex items-center gap-1">
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
                        <div className="bg-white p-4 rounded-xl border border-[#EAE1D2]">
                          <p className="text-sm text-[#243229] leading-relaxed italic">
                            "{review.comment}"
                          </p>
                        </div>

                        {/* DATE */}
                        <p className="text-[10px] text-[#7A6248]">
                          Submitted on{' '}
                          {new Date(
                            review.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex sm:flex-col gap-2 shrink-0">

                        {review.status === 'pending' && (
                          <>
                            <button
                              onClick={() =>
                                handleApprove(review._id)
                              }
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition"
                            >
                              <CheckCircle className="w-4 h-4" />
                              APPROVE
                            </button>

                            <button
                              onClick={() =>
                                handleReject(review._id)
                              }
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition"
                            >
                              <XCircle className="w-4 h-4" />
                              REJECT
                            </button>
                          </>
                        )}

                        <button
                          onClick={() =>
                            handleDeleteReview(review._id)
                          }
                          className="flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                          DELETE
                        </button>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminReviewsPage;