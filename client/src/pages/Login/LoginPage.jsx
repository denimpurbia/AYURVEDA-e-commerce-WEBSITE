import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AnnouncementBar from '../../components/layout/AnnouncementBar';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import {
  Leaf,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  KeyRound,
} from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirect = searchParams.get('redirect') || '/account';

  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

  // ============================================================
  // NORMAL LOGIN
  // ============================================================
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await login(email, password);

      if (res.success) {
        if (res.data.role === 'admin') {
          window.location.href =
            'http://localhost:5174/admin/dashboard';
        } else {
          navigate(redirect);
        }
      }
    } catch (err) {
      alert(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // SEND PASSWORD RESET OTP
  // ============================================================
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert('Please enter your email address');
      return;
    }

    try {
      setLoading(true);

      const res = await API.post('/auth/forgot-password', {
        email,
      });

      if (res.success) {
        setMode('otp');
        setOtp('');
        setCountdown(300);

        alert(
          `If an account exists with this email, a password reset OTP has been sent to ${email}.`
        );
      }
    } catch (err) {
      alert(err.message || 'Unable to send reset OTP');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // VERIFY RESET OTP
  // ============================================================
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      alert('Please enter the 6-digit OTP');
      return;
    }

    try {
      setLoading(true);

      const res = await API.post('/auth/verify-reset-otp', {
        email,
        otp,
      });

      if (res.success) {
        setMode('new-password');
      }
    } catch (err) {
      alert(err.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // RESEND RESET OTP
  // ============================================================
  const handleResendOTP = async () => {
    if (countdown > 0 || resending) return;

    try {
      setResending(true);

      const res = await API.post('/auth/forgot-password', {
        email,
      });

      if (res.success) {
        setOtp('');
        setCountdown(300);

        alert('A new password reset OTP has been sent.');
      }
    } catch (err) {
      alert(err.message || 'Unable to resend OTP');
    } finally {
      setResending(false);
    }
  };

  // ============================================================
  // RESET PASSWORD
  // ============================================================
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      const res = await API.post('/auth/reset-password', {
        email,
        otp,
        newPassword,
      });

      if (res.success) {
        alert(
          '🎉 Password reset successfully! Please login with your new password.'
        );

        setMode('login');
        setPassword('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setCountdown(0);
      }
    } catch (err) {
      alert(err.message || 'Unable to reset password');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // BACK TO LOGIN
  // ============================================================
  const handleBackToLogin = () => {
    setMode('login');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setCountdown(0);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col justify-between">
      <AnnouncementBar />
      <Navbar />

      <main className="max-w-md mx-auto px-4 py-16 flex-grow w-full">
        <div className="bg-[#FFFDF8] p-8 rounded-3xl border border-[#EAE1D2] shadow-card space-y-6">

          {/* HEADER */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#123D2A] text-[#C49A52] flex items-center justify-center mx-auto">
              {mode === 'login' && (
                <Leaf className="w-6 h-6" />
              )}

              {mode === 'forgot' && (
                <KeyRound className="w-6 h-6" />
              )}

              {mode === 'otp' && (
                <ShieldCheck className="w-6 h-6" />
              )}

              {mode === 'new-password' && (
                <Lock className="w-6 h-6" />
              )}
            </div>

            <h1 className="font-serif text-2xl font-bold text-[#123D2A]">
              {mode === 'login' && 'Welcome Back'}

              {mode === 'forgot' && 'Forgot Password?'}

              {mode === 'otp' && 'Verify Your Email'}

              {mode === 'new-password' && 'Create New Password'}
            </h1>

            <p className="text-xs text-[#7A6248]">
              {mode === 'login' &&
                'Sign in to your AyurvedaMart account'}

              {mode === 'forgot' &&
                'Enter your email to receive a password reset OTP'}

              {mode === 'otp' &&
                `We sent a 6-digit OTP to ${email}`}

              {mode === 'new-password' &&
                'Choose a strong new password for your account'}
            </p>
          </div>

          {/* =====================================================
              LOGIN
          ====================================================== */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">

              {/* EMAIL */}
              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">
                  Email Address
                </label>

                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="user@ayurvedamart.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 pl-9 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123D2A]"
                  />

                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#123D2A] uppercase">
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] font-bold text-[#123D2A] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 pl-9 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123D2A]"
                  />

                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#123D2A] text-white text-xs font-bold tracking-widest rounded-full hover:bg-[#0B2D1E] disabled:opacity-60 shadow-md flex items-center justify-center gap-2"
              >
                {loading ? 'SIGNING IN...' : 'LOGIN TO ACCOUNT'}

                <ArrowRight className="w-4 h-4 text-[#C49A52]" />
              </button>
            </form>
          )}

          {/* =====================================================
              FORGOT PASSWORD
          ====================================================== */}
          {mode === 'forgot' && (
            <form
              onSubmit={handleForgotPassword}
              className="space-y-5"
            >
              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-2">
                  Email Address
                </label>

                <div className="relative">
                  <input
                    type="email"
                    required
                    autoFocus
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-3 pl-9 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123D2A]"
                  />

                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#123D2A] text-white text-xs font-bold tracking-widest rounded-full hover:bg-[#0B2D1E] disabled:opacity-60 shadow-md flex items-center justify-center gap-2"
              >
                {loading ? 'SENDING OTP...' : 'SEND RESET OTP'}

                <ArrowRight className="w-4 h-4 text-[#C49A52]" />
              </button>

              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full text-xs text-[#7A6248] hover:text-[#123D2A] underline"
              >
                ← Back to Login
              </button>
            </form>
          )}

          {/* =====================================================
              OTP
          ====================================================== */}
          {mode === 'otp' && (
            <form
              onSubmit={handleVerifyOTP}
              className="space-y-5"
            >
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
                    setOtp(
                      e.target.value.replace(/\D/g, '')
                    )
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

              {/* VERIFY OTP */}
              <button
                type="submit"
                disabled={
                  loading ||
                  otp.length !== 6 ||
                  countdown <= 0
                }
                className="w-full py-3.5 bg-[#123D2A] text-white text-xs font-bold tracking-widest rounded-full hover:bg-[#0B2D1E] disabled:opacity-50 shadow-md flex items-center justify-center gap-2"
              >
                {loading ? 'VERIFYING...' : 'VERIFY OTP'}

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

              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full text-xs text-[#7A6248] hover:text-[#123D2A] underline"
              >
                ← Back to Login
              </button>
            </form>
          )}

          {/* =====================================================
              NEW PASSWORD
          ====================================================== */}
          {mode === 'new-password' && (
            <form
              onSubmit={handleResetPassword}
              className="space-y-4"
            >
              {/* NEW PASSWORD */}
              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">
                  New Password
                </label>

                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(e.target.value)
                    }
                    className="w-full px-3 py-3 pl-9 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123D2A]"
                  />

                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                </div>

                <p className="text-[10px] text-[#7A6248] mt-1">
                  Minimum 6 characters
                </p>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">
                  Confirm New Password
                </label>

                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    className="w-full px-3 py-3 pl-9 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123D2A]"
                  />

                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              {/* RESET */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#123D2A] text-white text-xs font-bold tracking-widest rounded-full hover:bg-[#0B2D1E] disabled:opacity-60 shadow-md flex items-center justify-center gap-2"
              >
                {loading
                  ? 'RESETTING PASSWORD...'
                  : 'RESET PASSWORD'}

                <KeyRound className="w-4 h-4 text-[#C49A52]" />
              </button>

              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full text-xs text-[#7A6248] hover:text-[#123D2A] underline"
              >
                ← Back to Login
              </button>
            </form>
          )}

          {/* REGISTER LINK */}
          {mode === 'login' && (
            <div className="text-center pt-4 border-t border-[#EAE1D2] text-xs text-[#7A6248]">
              Don't have an account?{' '}

              <Link
                to="/register"
                className="font-bold text-[#123D2A] hover:underline"
              >
                Create One Here
              </Link>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;