import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onOpenAiChat }) => {
  const { cartCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'SHOP', path: '/shop' },
    { name: 'CATEGORIES', path: '/shop?tab=categories' },
    { name: 'NEW ARRIVALS', path: '/shop?sort=newest' },
    { name: 'ABOUT US', path: '/about' },
    { name: 'CONTACT', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#EAE1D2] shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 sm:h-28 py-2">
          
          {/* Left / Brand Logo */}
          <Link to="/" className="flex items-center group">
            <img 
              src="/images/logo.png" 
              alt="AyurvedaMart" 
              className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-xs font-bold tracking-widest transition-colors py-1 relative ${
                    isActive ? 'text-[#123D2A]' : 'text-[#243229]/80 hover:text-[#123D2A]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C49A52] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4">
            
            {/* Search Input / Button */}
            <div className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search kadha, oil, ashwagandha..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-48 sm:w-64 px-3 py-1.5 text-xs bg-[#F7F2E8] border border-[#789B72]/40 rounded-full focus:outline-none focus:ring-1 focus:ring-[#123D2A]"
                  />
                  <button type="button" onClick={() => setSearchOpen(false)} className="ml-1 p-1 text-[#243229]">
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-[#123D2A] hover:text-[#C49A52] hover:bg-[#F7F2E8] rounded-full transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Account Link */}
            <Link
              to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/account') : '/login'}
              className="p-2 text-[#123D2A] hover:text-[#C49A52] hover:bg-[#F7F2E8] rounded-full transition-colors relative"
              title={user ? user.name : 'Account'}
            >
              <User className="w-5 h-5" />
              {user && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#789B72] rounded-full" />
              )}
            </Link>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="p-2 text-[#123D2A] hover:text-[#C49A52] hover:bg-[#F7F2E8] rounded-full transition-colors hidden sm:block"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Cart Drawer Link */}
            <Link
              to="/cart"
              className="p-2 text-[#123D2A] hover:text-[#C49A52] hover:bg-[#F7F2E8] rounded-full transition-colors relative"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#C49A52] text-[#0B2D1E] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#123D2A] lg:hidden rounded-lg hover:bg-[#F7F2E8]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F7F2E8] border-b border-[#EAE1D2] px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-bold tracking-wider text-[#123D2A] hover:bg-[#FFFDF8] rounded-md"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#EAE1D2] flex justify-around">
            <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-1.5 text-xs font-semibold text-[#123D2A]">
              <Heart className="w-4 h-4 text-[#C49A52]" /> Wishlist
            </Link>
            <button onClick={() => { setMobileMenuOpen(false); onOpenAiChat && onOpenAiChat(); }} className="flex items-center gap-1.5 text-xs font-semibold text-[#123D2A]">
              <Leaf className="w-4 h-4 text-[#789B72]" /> Ayurveda AI
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
