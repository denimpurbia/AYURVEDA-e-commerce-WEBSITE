import React from 'react';
import { useLocation } from 'react-router-dom';
import AnnouncementBar from '../../components/layout/AnnouncementBar';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const LegalPage = () => {
  const location = useLocation();
  const path = location.pathname;

  let title = 'Privacy Policy';
  if (path === '/terms') title = 'Terms & Conditions';
  if (path === '/refund-policy') title = 'Return & Refund Policy';

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col justify-between">
      <AnnouncementBar />
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-12 flex-grow w-full space-y-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#123D2A] border-b border-[#EAE1D2] pb-4">
          {title}
        </h1>

        <div className="text-xs sm:text-sm text-[#243229]/80 space-y-4 leading-relaxed font-medium">
          <p>Last updated: August 2026</p>
          <p>
            Welcome to AyurvedaMart ("AUTHENTIC AYURVEDA. NATURAL WELLNESS."). We are committed to providing genuine, lab-tested herbal formulations, kadhas, and wellness products with complete transparency and trust.
          </p>

          <h3 className="font-bold text-base text-[#123D2A] pt-4">1. Quality & Purity Assurance</h3>
          <p>
            All products listed on AyurvedaMart are manufactured in compliance with classical Ayurvedic guidelines and modern safety standards.
          </p>

          <h3 className="font-bold text-base text-[#123D2A] pt-4">2. Shipping & Delivery Policy</h3>
          <p>
            We deliver nationwide. Orders above ₹999 qualify for FREE SHIPPING. Standard shipping takes 3-5 business days. Cash on Delivery (COD) is available.
          </p>

          <h3 className="font-bold text-base text-[#123D2A] pt-4">3. 7-Day Easy Returns</h3>
          <p>
            If you receive a damaged or unsealed product, you may request a replacement or full refund within 7 days of delivery.
          </p>

          <h3 className="font-bold text-base text-[#123D2A] pt-4">4. Medical Disclaimer</h3>
          <p>
            Content and product descriptions on AyurvedaMart are for informational and wellness purposes only and do not constitute formal medical diagnosis or prescription. Always consult a certified healthcare practitioner for severe health conditions.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalPage;
