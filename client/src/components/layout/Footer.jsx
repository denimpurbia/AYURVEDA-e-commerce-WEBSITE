import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#FFFDF8] border-t border-[#EAE1D2] pt-16 pb-8 text-[#243229]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#EAE1D2]">
          
          {/* Brand Info Column */}
          <div className="lg:col-span-1 space-y-4">
            <Link to="/" className="inline-block">
              <img 
                src="/images/logo.png" 
                alt="AyurvedaMart" 
                className="h-14 sm:h-18 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-[#7A6248] leading-relaxed font-medium">
              Bringing the wisdom of authentic Ayurveda to your everyday life with pure, chemical-free herbal formulations.
            </p>
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
            <div className="space-y-3.5 text-xs font-medium">
              <div>
                <p className="font-bold text-[#123D2A]">Phone Support</p>
                <a href="tel:+919876543210" className="text-[#7A6248] hover:text-[#123D2A] transition-colors block">
                  +91 98765 43210
                </a>
              </div>

              <div>
                <p className="font-bold text-[#123D2A]">Email Us</p>
                <a href="mailto:ayurvedamart2k26@gmail.com" className="text-[#7A6248] hover:text-[#123D2A] transition-colors block break-all">
                  ayurvedamart2k26@gmail.com
                </a>
              </div>

              <div>
                <p className="font-bold text-[#123D2A]">Head Office</p>
                <p className="text-[#7A6248] leading-relaxed">
                  Court Choraya, Udaipur, Rajasthan - 313011
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 text-center text-[11px] text-[#7A6248] font-medium">
          <p>© {new Date().getFullYear()} AyurvedaMart. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
