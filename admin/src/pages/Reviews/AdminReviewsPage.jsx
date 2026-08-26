import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopbar from '../../components/AdminTopbar';
import adminApi from '../../services/adminApi';
import { Star, Trash2 } from 'lucide-react';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminApi.get('/users/dashboard-stats');
        if (res.success && res.data.recentReviews) {
          setReviews(res.data.recentReviews);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this customer review?')) {
      try {
        const res = await adminApi.delete(`/reviews/${reviewId}`);
        if (res.success) {
          setReviews(reviews.filter((r) => r._id !== reviewId));
          alert('Review removed');
        }
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F2E8]/40">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          <div>
            <h2 className="font-serif font-bold text-2xl text-[#123D2A]">Review Moderation</h2>
            <p className="text-xs text-[#7A6248]">Monitor and moderate customer ratings and comments.</p>
          </div>

          <div className="bg-[#FFFDF8] p-6 rounded-2xl border border-[#EAE1D2] shadow-xs">
            {loading ? (
              <p className="text-xs font-bold text-[#123D2A] py-8 text-center">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-xs text-[#7A6248] text-center py-6">No customer reviews recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev._id} className="p-4 bg-[#F7F2E8]/60 rounded-xl border border-[#EAE1D2] flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-[#123D2A]">{rev.user?.name || 'Customer'}</span>
                        <span className="text-[10px] text-[#7A6248]">on <strong>{rev.product?.name || 'Ayurvedic Product'}</strong></span>
                      </div>
                      <div className="flex text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <p className="text-xs text-[#243229] font-medium italic">"{rev.comment}"</p>
                    </div>

                    <button
                      onClick={() => handleDeleteReview(rev._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
