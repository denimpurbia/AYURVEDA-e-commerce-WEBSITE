import React from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Bell } from 'lucide-react';

const AdminTopbar = () => {
  const { admin, logoutAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <header className="bg-[#FFFDF8] border-b border-[#EAE1D2] px-6 py-4 flex items-center justify-between shadow-xs">
      <div className="flex items-center space-x-3">
        <h1 className="font-serif font-bold text-xl text-[#123D2A]">
          Management Console
        </h1>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
          LIVE DATABASE
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3 bg-[#F7F2E8] px-3 py-1.5 rounded-full border border-[#EAE1D2]">
          <div className="w-7 h-7 rounded-full bg-[#123D2A] text-[#C49A52] flex items-center justify-center font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="block text-xs font-bold text-[#123D2A] leading-tight">
              {admin ? admin.name : 'Store Admin'}
            </span>
            <span className="block text-[9px] text-[#7A6248] leading-tight">
              {admin ? admin.email : 'admin@ayurvedamart.com'}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 rounded-full text-red-600 hover:bg-red-50 transition-colors"
          title="Logout Admin Session"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default AdminTopbar;
