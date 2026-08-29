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
  Package,
  Image as ImageIcon,
} from 'lucide-react';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH ALL PRODUCT REVIEWS
  // ==========================================

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const res = await adminApi.get(
        '/product-reviews/admin/all'
      );

      if (res.success && res.data) {
        setReviews(res.data);
      }
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          err.message ||
          'Failed to load product reviews'
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
      const res = await adminApi.put(
        `/product-reviews/${reviewId}/approve`
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

        alert('Product review approved successfully');
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.message ||
          'Failed to approve review'
      );
    }
  };

  // ==========================================
  // REJECT REVIEW
  // ==========================================

  const handleReject = async (reviewId) => {
    const confirmReject = window.confirm(
      'Are you sure you want to reject this product review?'
    );

    if (!confirmReject) {
      return;
    }

    try {
      const res = await adminApi.put(
        `/product-reviews/${reviewId}/reject`
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

        alert('Product review rejected successfully');
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.message ||
          'Failed to reject review'
      );
    }
  };

  // ==========================================
  // DELETE REVIEW
  // ==========================================

  const handleDeleteReview = async (reviewId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to permanently delete this product review?'
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const res = await adminApi.delete(
        `/product-reviews/${reviewId}`
      );

      if (res.success) {
        setReviews((prevReviews) =>
          prevReviews.filter(
            (review) =>
              review._id !== reviewId
          )
        );

        alert(
          'Product review deleted successfully'
        );
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
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

  // ==========================================
  // IMAGE URL
  // ==========================================

  const getImageUrl = (image) => {
    if (!image) return '';

    if (image.startsWith('http')) {
      return image;
    }

    const baseUrl =
      import.meta.env.VITE_API_URL?.replace(
        '/api',
        ''
      ) || '';

    return `${baseUrl}${image}`;
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
              Product Review Moderation
            </h2>

            <p className="text-xs text-[#7A6248] mt-1">
              Approve or reject customer product
              reviews before they appear publicly.
            </p>
          </div>

          {/* REVIEW LIST */}
          <div className="bg-[#FFFDF8] p-6 rounded-2xl border border-[#EAE1D2] shadow-sm">

            {loading ? (
              <p className="text-xs font-bold text-[#123D2A] py-10 text-center">
                Loading product reviews...
              </p>

            ) : reviews.length === 0 ? (
              <div className="py-12 text-center">
                <Star className="w-8 h-8 text-[#C49A52] mx-auto mb-3" />

                <p className="text-sm font-semibold text-[#123D2A]">
                  No product reviews yet
                </p>

                <p className="text-xs text-[#7A6248] mt-1">
                  Customer product reviews will appear
                  here for moderation.
                </p>
              </div>

            ) : (
              <div className="space-y-5">

                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="p-5 bg-[#F7F2E8]/60 rounded-xl border border-[#EAE1D2]"
                  >

                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">

                      {/* REVIEW CONTENT */}
                      <div className="space-y-4 flex-1">

                        {/* USER + STATUS */}
                        <div className="flex items-center justify-between gap-3 flex-wrap">

                          <div>
                            <h3 className="font-bold text-sm text-[#123D2A]">
                              {review.user?.name ||
                                'Customer'}
                            </h3>

                            <p className="text-[10px] text-[#7A6248]">
                              {review.user?.email || ''}
                            </p>
                          </div>

                          {getStatusBadge(
                            review.status
                          )}
                        </div>

                        {/* PRODUCT */}
                        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-[#EAE1D2]">

                          {review.product?.images?.[0] ? (
                            <img
                              src={getImageUrl(
                                review.product.images[0]
                              )}
                              alt={
                                review.product?.name ||
                                'Product'
                              }
                              className="w-14 h-14 rounded-lg object-cover border border-[#EAE1D2]"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-lg bg-[#F7F2E8] flex items-center justify-center">
                              <Package className="w-6 h-6 text-[#123D2A]" />
                            </div>
                          )}

                          <div>
                            <p className="text-[10px] text-[#7A6248] uppercase">
                              Product
                            </p>

                            <h4 className="font-bold text-sm text-[#123D2A]">
                              {review.product?.name ||
                                'Product not available'}
                            </h4>
                          </div>
                        </div>

                        {/* STARS */}
                        <div className="flex items-center gap-1">

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

                          <span className="ml-2 text-xs font-bold text-[#123D2A]">
                            {review.rating}/5
                          </span>
                        </div>

                        {/* COMMENT */}
                        <div className="bg-white p-4 rounded-xl border border-[#EAE1D2]">

                          <p className="text-sm text-[#243229] leading-relaxed italic">
                            "{review.comment}"
                          </p>

                        </div>

                        {/* REVIEW IMAGES */}
                        {review.images &&
                          review.images.length > 0 && (
                            <div>

                              <div className="flex items-center gap-2 mb-2">
                                <ImageIcon className="w-4 h-4 text-[#123D2A]" />

                                <span className="text-xs font-bold text-[#123D2A]">
                                  Customer Photos
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-3">

                                {review.images.map(
                                  (image, index) => (
                                    <img
                                      key={index}
                                      src={getImageUrl(
                                        image
                                      )}
                                      alt={`Review ${index + 1}`}
                                      className="w-24 h-24 object-cover rounded-lg border border-[#EAE1D2]"
                                    />
                                  )
                                )}

                              </div>

                            </div>
                          )}

                        {/* VERIFIED BUYER */}
                        {review.verifiedBuyer && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            VERIFIED BUYER
                          </span>
                        )}

                        {/* DATE */}
                        <p className="text-[10px] text-[#7A6248]">

                          Submitted on{' '}

                          {review.createdAt
                            ? new Date(
                                review.createdAt
                              ).toLocaleDateString()
                            : 'N/A'}

                        </p>

                      </div>

                      {/* ACTIONS */}
                      <div className="flex lg:flex-col gap-2 shrink-0">

                        {review.status ===
                          'pending' && (
                          <>
                            <button
                              onClick={() =>
                                handleApprove(
                                  review._id
                                )
                              }
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition"
                            >
                              <CheckCircle className="w-4 h-4" />
                              APPROVE
                            </button>

                            <button
                              onClick={() =>
                                handleReject(
                                  review._id
                                )
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
                            handleDeleteReview(
                              review._id
                            )
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