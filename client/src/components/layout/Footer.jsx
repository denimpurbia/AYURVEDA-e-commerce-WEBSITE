import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Phone, Mail, Clock, MapPin, Instagram, Facebook, Youtube, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#FFFDF8] border-t border-[#EAE1D2] pt-16 pb-8 text-[#243229]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#EAE1D2]">
          
          {/* Brand Info Column */}
          <div className="lg:col-span-1 space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#123D2A] flex items-center justify-center text-[#C49A52]">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-lg text-[#123D2A] tracking-wider">
                AYURVEDAMART
              </span>
            </Link>
            <p className="text-xs text-[#7A6248] leading-relaxed font-medium">
              Bringing the wisdom of authentic Ayurveda to your everyday life with pure, chemical-free herbal formulations.
            </p>
            <div className="flex items-center space-x-3 text-[#123D2A] pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-[#F7F2E8] flex items-center justify-center hover:bg-[#123D2A] hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#F7F2E8] flex items-center justify-center hover:bg-[#123D2A] hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#F7F2E8] flex items-center justify-center hover:bg-[#123D2A] hover:text-white transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#F7F2E8] flex items-center justify-center hover:bg-[#123D2A] hover:text-white transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* SHOP Column */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-[#123D2A] uppercase mb-4">
              SHOP
            </h4>
            <ul className="space-y-2.5 text-xs text-[#7A6248] font-medium">
              <li><Link to="/shop" className="hover:text-[#123D2A] transition-colors">All Products</Link></li>
              <li><Link to="/shop?sort=rating-desc" className="hover:text-[#123D2A] transition-colors">Best Sellers</Link></li>
              <li><Link to="/shop?sort=newest" className="hover:text-[#123D2A] transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop?tab=categories" className="hover:text-[#123D2A] transition-colors">Categories</Link></li>
              <li><Link to="/shop?offer=true" className="hover:text-[#123D2A] transition-colors">Offers</Link></li>
            </ul>
          </div>

          {/* HELP Column */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-[#123D2A] uppercase mb-4">
              HELP
            </h4>
            <ul className="space-y-2.5 text-xs text-[#7A6248] font-medium">
              <li><Link to="/orders" className="hover:text-[#123D2A] transition-colors">Track Order</Link></li>
              <li><Link to="/refund-policy" className="hover:text-[#123D2A] transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/faq" className="hover:text-[#123D2A] transition-colors">Shipping Info</Link></li>
              <li><Link to="/faq" className="hover:text-[#123D2A] transition-colors">FAQs</Link></li>
              <li><Link to="/contact" className="hover:text-[#123D2A] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* COMPANY Column */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-[#123D2A] uppercase mb-4">
              COMPANY
            </h4>
            <ul className="space-y-2.5 text-xs text-[#7A6248] font-medium">
              <li><Link to="/about" className="hover:text-[#123D2A] transition-colors">About Us</Link></li>
              <li><Link to="/about" className="hover:text-[#123D2A] transition-colors">Our Story</Link></li>
              <li><Link to="/privacy" className="hover:text-[#123D2A] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-[#123D2A] transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* CONTACT US Column */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-[#123D2A] uppercase mb-4">
              CONTACT US
            </h4>
            <ul className="space-y-3 text-xs text-[#7A6248] font-medium">
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#C49A52] shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#C49A52] shrink-0" />
                <span>hello@ayurvedamart.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#C49A52] shrink-0" />
                <span>Mon - Sun / 9AM - 8PM</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#C49A52] shrink-0" />
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar matching Reference Image */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#7A6248] font-medium">
          <p>© {new Date().getFullYear()} AyurvedaMart. All rights reserved.</p>
          <div className="flex items-center space-x-3 bg-[#F7F2E8] px-4 py-1.5 rounded-full border border-[#EAE1D2]">
            <span className="font-bold text-[#123D2A]">VISA</span>
            <span>•</span>
            <span className="font-bold text-[#123D2A]">Mastercard</span>
            <span>•</span>
            <span className="font-bold text-[#123D2A]">Paytm</span>
            <span>•</span>
            <span className="font-bold text-[#123D2A]">UPI</span>
            <span>•</span>
            <span className="font-bold text-[#123D2A]">COD</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
