import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  Home,
  Store,
  Heart,
  ShoppingBag,
  User,
} from 'lucide-react';

import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const MobileBottomNav = () => {
  const location = useLocation();
  const { cartCount } = useCart();
  const { user } = useAuth();

  const accountPath = user
    ? user.role === 'admin'
      ? '/admin/dashboard'
      : '/account'
    : '/login';

  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: Home,
    },
    {
      name: 'Shop',
      path: '/shop',
      icon: Store,
    },
    {
      name: 'Wishlist',
      path: '/wishlist',
      icon: Heart,
    },
    {
      name: 'Cart',
      path: '/cart',
      icon: ShoppingBag,
      badge: cartCount,
    },
    {
      name: 'Account',
      path: accountPath,
      icon: User,
    },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }

    if (path === '/login' || path === '/account') {
      return (
        location.pathname === '/login' ||
        location.pathname === '/account'
      );
    }

    return location.pathname === path;
  };

  return (
    <nav
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-[100]
        lg:hidden
        bg-[#FFFDF8]/95
        backdrop-blur-lg
        border-t
        border-[#EAE1D2]
        shadow-[0_-4px_20px_rgba(18,61,42,0.08)]
        pb-[env(safe-area-inset-bottom)]
      "
    >
      <div className="flex items-center justify-around h-[68px] px-1">

        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.name}
              to={item.path}
              className="
                relative
                flex
                flex-col
                items-center
                justify-center
                gap-1
                min-w-[56px]
                flex-1
                h-full
                transition-all
                duration-200
              "
            >
              {/* Icon Container */}
              <div
                className={`
                  relative
                  flex
                  items-center
                  justify-center
                  w-10
                  h-8
                  rounded-xl
                  transition-all
                  duration-200

                  ${
                    active
                      ? 'bg-[#EAF2E8] text-[#123D2A]'
                      : 'text-[#6B756C]'
                  }
                `}
              >
                <Icon
                  className={`
                    w-5
                    h-5
                    transition-transform
                    duration-200

                    ${active ? 'scale-110' : ''}
                  `}
                  strokeWidth={active ? 2.5 : 2}
                />

                {/* Cart Badge */}
                {item.badge > 0 && (
                  <span
                    className="
                      absolute
                      -top-1
                      -right-2
                      min-w-[18px]
                      h-[18px]
                      px-1
                      flex
                      items-center
                      justify-center
                      rounded-full
                      bg-[#C49A52]
                      text-[#FFFDF8]
                      text-[9px]
                      font-bold
                      border-2
                      border-[#FFFDF8]
                    "
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}

              </div>

              {/* Text */}
              <span
                className={`
                  text-[9px]
                  font-semibold
                  tracking-wide
                  transition-colors
                  duration-200

                  ${
                    active
                      ? 'text-[#123D2A]'
                      : 'text-[#6B756C]'
                  }
                `}
              >
                {item.name}
              </span>

            </Link>
          );
        })}

      </div>
    </nav>
  );
};

export default MobileBottomNav;