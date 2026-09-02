import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Leaf,
} from 'lucide-react';

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

  /*
    LOCK BACKGROUND SCROLL
    When mobile menu is open, website behind it cannot scroll
  */
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);


  /*
    CLOSE MOBILE MENU WHEN PAGE CHANGES
  */
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);


  /*
    ESC KEY CLOSE MENU
  */
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);


  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(
        `/shop?search=${encodeURIComponent(
          searchQuery.trim()
        )}`
      );

      setSearchOpen(false);
      setMobileMenuOpen(false);
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


  const isLinkActive = (linkPath) => {
    if (linkPath === '/') {
      return location.pathname === '/';
    }

    if (linkPath.includes('?')) {
      const [basePath, queryString] = linkPath.split('?');

      return (
        location.pathname === basePath &&
        location.search.includes(queryString)
      );
    }

    if (linkPath === '/shop') {
      return (
        location.pathname === '/shop' &&
        !location.search.includes('sort=newest') &&
        !location.search.includes('tab=categories')
      );
    }

    return location.pathname === linkPath;
  };


  const handleMobileMenuToggle = () => {
    setMobileMenuOpen((prev) => !prev);
  };


  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };


  return (
    <header className="sticky top-0 z-50 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#EAE1D2] shadow-sm transition-all duration-300">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-24 sm:h-28 py-2">

          {/* LOGO */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center group"
          >
            <img
              src="/images/logo.png"
              alt="AyurvedaMart"
              className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>


          {/* DESKTOP NAVIGATION */}
          <nav className="hidden lg:flex items-center space-x-8">

            {navLinks.map((link) => {
              const isActive = isLinkActive(link.path);

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-xs font-bold tracking-widest transition-colors py-1 relative ${
                    isActive
                      ? 'text-[#123D2A]'
                      : 'text-[#243229]/80 hover:text-[#123D2A]'
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


          {/* RIGHT ACTIONS */}
          <div className="flex items-center space-x-2 sm:space-x-4">


            {/* SEARCH */}
            <div className="relative">

              {searchOpen ? (

                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center"
                >

                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                    autoFocus
                    className="w-32 sm:w-64 px-3 py-1.5 text-xs bg-[#F7F2E8] border border-[#789B72]/40 rounded-full focus:outline-none focus:ring-1 focus:ring-[#123D2A]"
                  />

                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="ml-1 p-1 text-[#243229]"
                    aria-label="Close search"
                  >
                    <X className="w-4 h-4" />
                  </button>

                </form>

              ) : (

                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-[#123D2A] hover:text-[#C49A52] hover:bg-[#F7F2E8] rounded-full transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>

              )}

            </div>


            {/* ACCOUNT */}
            <Link
              to={
                user
                  ? user.role === 'admin'
                    ? '/admin/dashboard'
                    : '/account'
                  : '/login'
              }
              onClick={closeMobileMenu}
              className="p-2 text-[#123D2A] hover:text-[#C49A52] hover:bg-[#F7F2E8] rounded-full transition-colors relative"
              title={user ? user.name : 'Account'}
            >

              <User className="w-5 h-5" />

              {user && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#789B72] rounded-full" />
              )}

            </Link>


            {/* WISHLIST */}
            <Link
              to="/wishlist"
              onClick={closeMobileMenu}
              className="p-2 text-[#123D2A] hover:text-[#C49A52] hover:bg-[#F7F2E8] rounded-full transition-colors hidden sm:block"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </Link>


            {/* CART */}
            <Link
              to="/cart"
              onClick={closeMobileMenu}
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


            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              onClick={handleMobileMenuToggle}
              className="p-2 text-[#123D2A] lg:hidden rounded-lg hover:bg-[#F7F2E8]"
              aria-label="Toggle mobile menu"
            >

              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}

            </button>

          </div>

        </div>

      </div>


      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (

        <>

          {/* DARK BACKGROUND */}
          <div
            className="fixed inset-0 top-24 z-40 bg-black/20 lg:hidden"
            onClick={closeMobileMenu}
          />


          {/* MOBILE MENU */}
          <div className="absolute top-full left-0 right-0 z-50 lg:hidden">

            <div
              className="
                bg-[#F7F2E8]
                border-b
                border-[#EAE1D2]
                shadow-xl
                px-4
                pt-3
                pb-6
                max-h-[calc(100vh-6rem)]
                overflow-y-auto
                overscroll-contain
              "
            >

              {/* MOBILE NAVIGATION */}
              <div className="space-y-2">

                {navLinks.map((link) => {

                  const isActive = isLinkActive(link.path);

                  return (

                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={closeMobileMenu}
                      className={`block px-4 py-3 text-sm font-bold tracking-wider rounded-md border-l-4 transition-colors ${
                        isActive
                          ? 'text-[#123D2A] bg-[#FFFDF8] border-[#C49A52]'
                          : 'text-[#243229]/80 hover:bg-[#FFFDF8] border-transparent'
                      }`}
                    >

                      {link.name}

                    </Link>

                  );

                })}

              </div>


              {/* MOBILE BOTTOM ACTIONS */}
              <div className="mt-4 pt-4 border-t border-[#EAE1D2] flex items-center justify-around">

                <Link
                  to="/wishlist"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2 text-xs font-semibold text-[#123D2A]"
                >

                  <Heart className="w-4 h-4 text-[#C49A52]" />

                  Wishlist

                </Link>


                {onOpenAiChat && (

                  <button
                    type="button"
                    onClick={() => {
                      closeMobileMenu();
                      onOpenAiChat();
                    }}
                    className="flex items-center gap-2 text-xs font-semibold text-[#123D2A]"
                  >

                    <Leaf className="w-4 h-4 text-[#789B72]" />

                    Ayurveda AI

                  </button>

                )}

              </div>

            </div>

          </div>

        </>

      )}

    </header>
  );
};

export default Navbar;