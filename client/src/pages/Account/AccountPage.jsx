import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnnouncementBar from '../../components/layout/AnnouncementBar';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import { User, Package, Heart, LogOut, ShieldCheck, MapPin } from 'lucide-react';

const AccountPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col justify-between">
      <AnnouncementBar />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        
        <div className="border-b border-[#EAE1D2] pb-4 mb-8">
          <span className="text-xs font-bold tracking-widest text-[#7A6248] uppercase block mb-1">
            MY DASHBOARD
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#123D2A]">
            Namaste, {user.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* User Profile Card */}
          <div className="lg:col-span-4 bg-[#F7F2E8] p-6 rounded-3xl border border-[#EAE1D2] space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full bg-[#123D2A] text-[#C49A52] flex items-center justify-center text-xl font-bold font-serif">
                {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#123D2A]">{user.name}</h3>
                <span className="text-xs text-[#7A6248] font-medium">{user.email}</span>
                <span className="block text-[10px] font-bold text-[#789B72] uppercase mt-0.5">
                  Role: {user.role}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-[#EAE1D2] text-xs text-[#243229]">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#C49A52]" />
                <span>
                  {user.address && user.address.city
                    ? `${user.address.street}, ${user.address.city}, ${user.address.state} - ${user.address.pincode}`
                    : 'No default address saved'}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 bg-red-50 text-red-700 text-xs font-bold rounded-full hover:bg-red-100 flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" /> LOG OUT
            </button>
          </div>

          {/* Account Quick Links */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <Link
              to="/orders"
              className="bg-[#FFFDF8] p-6 rounded-2xl border border-[#EAE1D2] shadow-card hover:shadow-xl transition-all space-y-3 group"
            >
              <div className="w-10 h-10 rounded-full bg-[#123D2A] text-[#C49A52] flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#123D2A] group-hover:text-[#C49A52]">
                My Orders
              </h3>
              <p className="text-xs text-[#7A6248]">
                Track order timeline, view invoice details and order history.
              </p>
            </Link>

            <Link
              to="/wishlist"
              className="bg-[#FFFDF8] p-6 rounded-2xl border border-[#EAE1D2] shadow-card hover:shadow-xl transition-all space-y-3 group"
            >
              <div className="w-10 h-10 rounded-full bg-[#123D2A] text-[#C49A52] flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#123D2A] group-hover:text-[#C49A52]">
                Saved Wishlist
              </h3>
              <p className="text-xs text-[#7A6248]">
                View saved Ayurvedic formulations and move to cart anytime.
              </p>
            </Link>

            {user.role === 'admin' && (
              <a
                href="http://localhost:5174/admin/dashboard"
                className="col-span-1 sm:col-span-2 bg-[#123D2A] text-white p-6 rounded-2xl shadow-xl space-y-2 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-serif font-bold text-xl text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#C49A52]" /> Switch to Admin Panel
                  </h3>
                  <p className="text-xs text-emerald-100">
                    Manage products, stock, customer orders, and store analytics.
                  </p>
                </div>
                <span className="px-4 py-2 bg-[#C49A52] text-[#0B2D1E] text-xs font-bold rounded-full">
                  OPEN ADMIN →
                </span>
              </a>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountPage;
