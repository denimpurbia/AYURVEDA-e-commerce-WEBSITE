import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnnouncementBar from '../../components/layout/AnnouncementBar';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

import {
  User,
  Package,
  Heart,
  LogOut,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Edit3,
  Save,
  X,
} from 'lucide-react';

const AccountPage = () => {
  const {
  user,
  loading: authLoading,
  logout,
} = useAuth();  

  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
    },
  });

  useEffect(() => {
  // Wait until AuthContext finishes restoring session
  if (authLoading) {
    return;
  }

  // Only redirect after session check is complete
  if (!user) {
    navigate('/login', {
      replace: true,
    });
    return;
  }

  fetchProfile();
}, [user, authLoading, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await API.get('/auth/me');

      if (response.success) {
        const userData = response.data;

        setProfile(userData);

        setFormData({
          name: userData.name || '',
          phone: userData.phone || '',
          address: {
            street: userData.address?.street || '',
            city: userData.address?.city || '',
            state: userData.address?.state || '',
            pincode: userData.address?.pincode || '',
          },
        });
      }
    } catch (error) {
      console.error(error);
      alert(error.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

     const response = await API.put(
  '/auth/profile',
  formData
);

      if (response.success) {
        setProfile(response.data);

        setFormData({
          name: response.data.name || '',
          phone: response.data.phone || '',
          address: {
            street:
              response.data.address?.street || '',
            city:
              response.data.address?.city || '',
            state:
              response.data.address?.state || '',
            pincode:
              response.data.address?.pincode || '',
          },
        });

        setEditMode(false);

        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error(error);

      alert(
        error.message ||
          'Failed to update profile'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        address: {
          street:
            profile.address?.street || '',
          city:
            profile.address?.city || '',
          state:
            profile.address?.state || '',
          pincode:
            profile.address?.pincode || '',
        },
      });
    }

    setEditMode(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#123D2A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-sm font-bold text-[#123D2A]">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }
  if (!user) {
  return null;
}

  const currentUser = profile || user;

  const fullAddress = currentUser.address?.city
    ? `${currentUser.address?.street || ''}, ${
        currentUser.address?.city || ''
      }, ${currentUser.address?.state || ''} - ${
        currentUser.address?.pincode || ''
      }`
    : '';

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col justify-between">
      <AnnouncementBar />

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">

        {/* PAGE HEADER */}

        <div className="border-b border-[#EAE1D2] pb-5 mb-8">
          <span className="text-xs font-bold tracking-widest text-[#7A6248] uppercase block mb-1">
            MY ACCOUNT
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#123D2A]">
            Namaste, {currentUser.name}
          </h1>

          <p className="text-sm text-[#7A6248] mt-2">
            Manage your personal information and delivery details.
          </p>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* PROFILE SECTION */}

          <div className="lg:col-span-5">

            <div className="bg-[#F7F2E8] p-6 sm:p-8 rounded-3xl border border-[#EAE1D2]">

              {/* PROFILE HEADER */}

              <div className="flex items-start justify-between gap-4 mb-7">

                <div className="flex items-center gap-4">

                  <div className="w-16 h-16 rounded-full bg-[#123D2A] text-[#C49A52] flex items-center justify-center text-2xl font-bold font-serif">
                    {currentUser.name?.charAt(0)?.toUpperCase()}
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#123D2A]">
                      {currentUser.name}
                    </h3>

                    <p className="text-xs text-[#7A6248] mt-1">
                      {currentUser.email}
                    </p>
                  </div>

                </div>


                {!editMode && (

                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#123D2A] text-white text-xs font-bold hover:bg-[#0B2D1E]"
                  >
                    <Edit3 className="w-4 h-4 text-[#C49A52]" />

                    Edit
                  </button>

                )}

              </div>


              {/* EDIT MODE */}

              {editMode ? (

                <form
                  onSubmit={handleSaveProfile}
                  className="space-y-5"
                >

                  {/* NAME */}

                  <div>

                    <label className="text-xs font-bold text-[#123D2A] uppercase block mb-2">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-3 text-sm bg-white border border-[#EAE1D2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C49A52]"
                    />

                  </div>


                  {/* EMAIL */}

                  <div>

                    <label className="text-xs font-bold text-[#123D2A] uppercase block mb-2">
                      Email Address
                    </label>

                    <div className="flex items-center gap-3 p-3 bg-white/70 border border-[#EAE1D2] rounded-xl text-sm text-[#7A6248]">

                      <Mail className="w-4 h-4 text-[#C49A52]" />

                      {currentUser.email}

                    </div>

                    <p className="text-[10px] text-[#7A6248] mt-1">
                      Email address cannot be changed here.
                    </p>

                  </div>


                  {/* PHONE */}

                  <div>

                    <label className="text-xs font-bold text-[#123D2A] uppercase block mb-2">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="w-full p-3 text-sm bg-white border border-[#EAE1D2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C49A52]"
                    />

                  </div>


                  {/* ADDRESS */}

                  <div className="pt-2 border-t border-[#EAE1D2]">

                    <h4 className="font-serif font-bold text-lg text-[#123D2A] mb-4 flex items-center gap-2">

                      <MapPin className="w-5 h-5 text-[#C49A52]" />

                      Delivery Address

                    </h4>


                    <div className="space-y-3">

                      <input
                        type="text"
                        name="street"
                        value={formData.address.street}
                        onChange={handleAddressChange}
                        placeholder="House No, Street, Area"
                        className="w-full p-3 text-sm bg-white border border-[#EAE1D2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C49A52]"
                      />


                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                        <input
                          type="text"
                          name="city"
                          value={formData.address.city}
                          onChange={handleAddressChange}
                          placeholder="City"
                          className="w-full p-3 text-sm bg-white border border-[#EAE1D2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C49A52]"
                        />


                        <input
                          type="text"
                          name="state"
                          value={formData.address.state}
                          onChange={handleAddressChange}
                          placeholder="State"
                          className="w-full p-3 text-sm bg-white border border-[#EAE1D2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C49A52]"
                        />

                      </div>


                      <input
                        type="text"
                        name="pincode"
                        value={formData.address.pincode}
                        onChange={handleAddressChange}
                        placeholder="Pincode"
                        className="w-full p-3 text-sm bg-white border border-[#EAE1D2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C49A52]"
                      />

                    </div>

                  </div>


                  {/* BUTTONS */}

                  <div className="flex gap-3 pt-3">

                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 py-3 bg-[#123D2A] text-white text-xs font-bold rounded-full hover:bg-[#0B2D1E] flex items-center justify-center gap-2 disabled:opacity-60"
                    >

                      <Save className="w-4 h-4 text-[#C49A52]" />

                      {saving
                        ? 'SAVING...'
                        : 'SAVE CHANGES'}

                    </button>


                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className="px-5 py-3 border border-[#EAE1D2] text-[#7A6248] text-xs font-bold rounded-full hover:bg-white"
                    >

                      <X className="w-4 h-4" />

                    </button>

                  </div>

                </form>

              ) : (

                /* PROFILE VIEW MODE */

                <div className="space-y-5">

                  <div className="pt-5 border-t border-[#EAE1D2]">

                    <div className="flex items-center gap-3">

                      <User className="w-5 h-5 text-[#C49A52]" />

                      <div>

                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A6248]">
                          Full Name
                        </p>

                        <p className="text-sm font-semibold text-[#123D2A] mt-1">
                          {currentUser.name}
                        </p>

                      </div>

                    </div>

                  </div>


                  <div>

                    <div className="flex items-center gap-3">

                      <Mail className="w-5 h-5 text-[#C49A52]" />

                      <div>

                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A6248]">
                          Email Address
                        </p>

                        <p className="text-sm font-semibold text-[#123D2A] mt-1 break-all">
                          {currentUser.email}
                        </p>

                      </div>

                    </div>

                  </div>


                  <div>

                    <div className="flex items-center gap-3">

                      <Phone className="w-5 h-5 text-[#C49A52]" />

                      <div>

                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A6248]">
                          Phone Number
                        </p>

                        <p className="text-sm font-semibold text-[#123D2A] mt-1">

                          {currentUser.phone ||
                            'No phone number added'}

                        </p>

                      </div>

                    </div>

                  </div>


                  <div>

                    <div className="flex items-start gap-3">

                      <MapPin className="w-5 h-5 text-[#C49A52] mt-0.5" />

                      <div>

                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A6248]">
                          Delivery Address
                        </p>

                        <p className="text-sm font-semibold text-[#123D2A] mt-1 leading-relaxed">

                          {fullAddress ||
                            'No delivery address saved'}

                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              )}


              {/* LOGOUT */}

              {!editMode && (

                <button
                  onClick={handleLogout}
                  className="w-full mt-7 py-3 bg-red-50 text-red-700 text-xs font-bold rounded-full hover:bg-red-100 flex items-center justify-center gap-2"
                >

                  <LogOut className="w-4 h-4" />

                  LOG OUT

                </button>

              )}

            </div>

          </div>


          {/* QUICK ACTIONS */}

          <div className="lg:col-span-7">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">


              {/* ORDERS */}

              <Link
                to="/orders"
                className="bg-[#FFFDF8] p-7 rounded-3xl border border-[#EAE1D2] shadow-card hover:shadow-xl transition-all space-y-4 group"
              >

                <div className="w-12 h-12 rounded-full bg-[#123D2A] text-[#C49A52] flex items-center justify-center">

                  <Package className="w-6 h-6" />

                </div>


                <div>

                  <h3 className="font-serif font-bold text-xl text-[#123D2A] group-hover:text-[#C49A52]">

                    My Orders

                  </h3>


                  <p className="text-xs text-[#7A6248] mt-2 leading-relaxed">

                    Track your orders, check delivery status and view order history.

                  </p>

                </div>

              </Link>


              {/* WISHLIST */}

              <Link
                to="/wishlist"
                className="bg-[#FFFDF8] p-7 rounded-3xl border border-[#EAE1D2] shadow-card hover:shadow-xl transition-all space-y-4 group"
              >

                <div className="w-12 h-12 rounded-full bg-[#123D2A] text-[#C49A52] flex items-center justify-center">

                  <Heart className="w-6 h-6" />

                </div>


                <div>

                  <h3 className="font-serif font-bold text-xl text-[#123D2A] group-hover:text-[#C49A52]">

                    My Wishlist

                  </h3>


                  <p className="text-xs text-[#7A6248] mt-2 leading-relaxed">

                    View your saved Ayurvedic products and add them to your cart anytime.

                  </p>

                </div>

              </Link>


              {/* ADMIN */}

              {currentUser.role === 'admin' && (

                <a
                  href="http://localhost:5174/admin/dashboard"
                  className="col-span-1 sm:col-span-2 bg-[#123D2A] text-white p-7 rounded-3xl shadow-xl space-y-3 flex items-center justify-between"
                >

                  <div>

                    <h3 className="font-serif font-bold text-xl text-white flex items-center gap-2">

                      <ShieldCheck className="w-5 h-5 text-[#C49A52]" />

                      Switch to Admin Panel

                    </h3>


                    <p className="text-xs text-emerald-100 mt-2">

                      Manage products, customers, orders and store operations.

                    </p>

                  </div>


                  <span className="px-4 py-2 bg-[#C49A52] text-[#0B2D1E] text-xs font-bold rounded-full whitespace-nowrap">

                    OPEN →

                  </span>

                </a>

              )}

            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
};

export default AccountPage;