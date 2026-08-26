import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';

const AdminLoginPage = () => {
  const { loginAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      setLoading(true);

      const res = await loginAdmin(email.trim(), password);

      if (res.success) {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B2D1E] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FFFDF8] rounded-3xl p-8 shadow-2xl space-y-6 border border-[#C49A52]/30">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-[#123D2A] text-[#C49A52] flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h1 className="font-serif text-2xl font-bold text-[#123D2A]">
            Admin Login
          </h1>

          <p className="text-xs text-[#7A6248] font-medium">
            AyurvedaMart Management Console
          </p>
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="p-3 bg-red-100 border border-red-200 rounded-xl text-xs text-red-800 font-bold text-center">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">
              Admin Email
            </label>

            <div className="relative">
              <input
                type="email"
                required
                autoComplete="username"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 pl-9 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C49A52]/40"
              />

              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 pl-9 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C49A52]/40"
              />

              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#123D2A] text-white text-xs font-bold tracking-widest rounded-full hover:bg-[#0B2D1E] shadow-xl flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'AUTHENTICATING...' : 'ENTER ADMIN CONSOLE'}

            <ArrowRight className="w-4 h-4 text-[#C49A52]" />
          </button>

        </form>

      </div>
    </div>
  );
};

export default AdminLoginPage;