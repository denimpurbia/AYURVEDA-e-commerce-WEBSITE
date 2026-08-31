import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  ShoppingBag,
  Users,
  Star,
  Settings,
  ExternalLink,
  Leaf,
  Mail,
  MessageSquare,
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Products',
      path: '/admin/products',
      icon: Package,
    },
    {
      name: 'Add Product',
      path: '/admin/products/add',
      icon: PlusCircle,
    },
    {
      name: 'Categories',
      path: '/admin/categories',
      icon: FolderTree,
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: ShoppingBag,
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: Users,
    },

    // PRODUCT REVIEWS
    {
      name: 'Product Reviews',
      path: '/admin/reviews',
      icon: Star,
    },

    // WEBSITE EXPERIENCE REVIEWS
    {
      name: 'Website Reviews',
      path: '/admin/website-reviews',
      icon: Star,
    },  

    {
      name: 'Messages',
      path: '/admin/messages',
      icon: Mail,
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 bg-[#0B2D1E] text-white flex flex-col justify-between min-h-screen border-r border-[#123D2A] shrink-0">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-[#123D2A] flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[#C49A52] text-[#0B2D1E] flex items-center justify-center font-bold">
            <Leaf className="w-5 h-5 fill-current" />
          </div>

          <div>
            <h2 className="font-serif font-bold text-lg text-white tracking-wider">
              AYURVEDAMART
            </h2>

            <span className="text-[10px] text-[#C49A52] font-semibold tracking-widest uppercase block">
              ADMIN CONTROL PANEL
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#123D2A] text-[#C49A52] shadow-sm border-l-4 border-[#C49A52]'
                    : 'text-emerald-100/80 hover:bg-[#123D2A]/60 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />

                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Customer Website Link */}
      <div className="p-4 border-t border-[#123D2A]">
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#123D2A] text-xs font-bold text-emerald-100 hover:text-white transition-colors"
        >
          <span className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-[#789B72]" />
            Customer Website
          </span>

          <ExternalLink className="w-3.5 h-3.5 text-[#C49A52]" />
        </a>
      </div>
    </aside>
  );
};

export default AdminSidebar;