import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnnouncementBar from '../../components/layout/AnnouncementBar';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Leaf,
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState('register');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // OTP countdown
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const formatCountdown = () => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // STEP 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);

      const res = await API.post('/auth/send-otp', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      if (res.success) {
        setStep('otp');
        setOtp('');
        setCountdown(300);

        alert(
          `Verification OTP sent to ${formData.email}. Please check your inbox.`
        );
      }
    } catch (err) {
      alert(err.message || 'Unable to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      alert('Please enter the 6-digit OTP');
      return;
    }

    try {
      setLoading(true);

      const res = await API.post('/auth/verify-otp', {
        email: formData.email,
        otp,
      });

      if (res.success && res.data) {
        // Store the token using the existing auth system
        if (res.data.token) {
          localStorage.setItem(
            'ayurveda_user_token',
            res.data.token
          );
        }

        alert('🎉 Email verified! Your AyurvedaMart account has been created.');

        navigate('/account');
        window.location.reload();
      }
    } catch (err) {
      alert(err.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Resend OTP
  const handleResendOTP = async () => {
    if (countdown > 0 || resending) return;

    try {
      setResending(true);

      const res = await API.post('/auth/resend-otp', {
        email: formData.email,
      });

      if (res.success) {
        setOtp('');
        setCountdown(300);

        alert('A new OTP has been sent to your email.');
      }
    } catch (err) {
      alert(err.message || 'Unable to resend OTP');
    } finally {
      setResending(false);
    }
  };

  const handleBackToRegister = () => {
    setStep('register');
    setOtp('');
    setCountdown(0);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col justify-between">
      <AnnouncementBar />
      <Navbar />

      <main className="max-w-md mx-auto px-4 py-12 flex-grow w-full">
        <div className="bg-[#FFFDF8] p-8 rounded-3xl border border-[#EAE1D2] shadow-card space-y-6">

          {/* HEADER */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#123D2A] text-[#C49A52] flex items-center justify-center mx-auto">
              {step === 'register' ? (
                <Leaf className="w-6 h-6" />
              ) : (
                <ShieldCheck className="w-6 h-6" />
              )}
            </div>

            <h1 className="font-serif text-2xl font-bold text-[#123D2A]">
              {step === 'register'
                ? 'Create Account'
                : 'Verify Your Email'}
            </h1>

            <p className="text-xs text-[#7A6248]">
              {step === 'register'
                ? 'Join the AyurvedaMart wellness journey'
                : `We sent a 6-digit verification code to ${formData.email}`}
            </p>
          </div>

          {/* REGISTRATION STEP */}
          {step === 'register' && (
            <form onSubmit={handleSendOTP} className="space-y-4">

              {/* NAME */}
              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">
                  Full Name
                </label>

                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Priya Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 pl-9 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123D2A]"
                  />

                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">
                  Email Address
                </label>

                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="priya@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 pl-9 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123D2A]"
                  />

                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* PHONE */}
              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">
                  Phone Number
                </label>

                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 pl-9 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123D2A]"
                  />

                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">
                  Password
                </label>

                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 pl-9 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123D2A]"
                  />

                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 pl-9 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123D2A]"
                  />

                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* SEND OTP */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#123D2A] text-white text-xs font-bold tracking-widest rounded-full hover:bg-[#0B2D1E] disabled:opacity-60 shadow-md flex items-center justify-center gap-2"
              >
                {loading ? 'SENDING OTP...' : 'VERIFY EMAIL'}
                <ArrowRight className="w-4 h-4 text-[#C49A52]" />
              </button>
            </form>
          )}

          {/* OTP STEP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-5">

              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-2 text-center">
                  Enter 6-Digit OTP
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="000000"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, ''))
                  }
                  className="w-full px-4 py-4 text-center text-2xl tracking-[0.6em] font-bold bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123D2A]"
                />
              </div>

              {/* TIMER */}
              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-xs text-[#7A6248]">
                    OTP expires in{' '}
                    <span className="font-bold text-[#123D2A]">
                      {formatCountdown()}
                    </span>
                  </p>
                ) : (
                  <p className="text-xs text-red-600 font-semibold">
                    OTP expired. Please request a new OTP.
                  </p>
                )}
              </div>

              {/* VERIFY */}
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-3.5 bg-[#123D2A] text-white text-xs font-bold tracking-widest rounded-full hover:bg-[#0B2D1E] disabled:opacity-50 shadow-md flex items-center justify-center gap-2"
              >
                {loading ? 'VERIFYING...' : 'VERIFY & CREATE ACCOUNT'}
                <ShieldCheck className="w-4 h-4 text-[#C49A52]" />
              </button>

              {/* RESEND */}
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={countdown > 0 || resending}
                className="w-full py-2.5 border border-[#EAE1D2] rounded-full text-xs font-bold text-[#123D2A] hover:bg-[#F7F2E8] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    resending ? 'animate-spin' : ''
                  }`}
                />

                {resending
                  ? 'SENDING...'
                  : countdown > 0
                  ? `RESEND OTP IN ${formatCountdown()}`
                  : 'RESEND OTP'}
              </button>

              {/* CHANGE EMAIL */}
              <button
                type="button"
                onClick={handleBackToRegister}
                className="w-full text-xs text-[#7A6248] hover:text-[#123D2A] underline"
              >
                ← Change email or registration details
              </button>
            </form>
          )}

          {/* LOGIN LINK */}
          <div className="text-center pt-4 border-t border-[#EAE1D2] text-xs text-[#7A6248]">
            Already registered?{' '}
            <Link
              to="/login"
              className="font-bold text-[#123D2A] hover:underline"
            >
              Sign In Here
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterPage;