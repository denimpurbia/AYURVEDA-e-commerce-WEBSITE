import React, { useState } from 'react';
import AnnouncementBar from '../../components/layout/AnnouncementBar';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'Are AyurvedaMart products 100% natural and safe?',
    a: 'Yes, all AyurvedaMart products are 100% natural, chemical-free, and formulated using authentic herbs according to classical texts. Each batch undergoes rigorous laboratory safety testing.',
  },
  {
    q: 'How long does shipping take?',
    a: 'Standard delivery takes 3-5 business days across India. Orders above ₹999 qualify for FREE Shipping.',
  },
  {
    q: 'Is Cash on Delivery (COD) available?',
    a: 'Yes, Cash on Delivery (COD) is available nationwide for all orders.',
  },
  {
    q: 'What is your return policy?',
    a: 'We offer a hassle-free 7-day return policy for damaged, unsealed, or incorrect items. You can request a return directly from your account orders dashboard.',
  },
  {
    q: 'How do I use the Ayurveda AI Assistant?',
    a: 'Simply click the floating "Ayurveda AI" button at the bottom right of any page. You can ask for product recommendations, budget searches, or store guidance in natural language!',
  },
];

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col justify-between">
      <AnnouncementBar />
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-12 flex-grow w-full">
        
        <div className="text-center space-y-2 mb-10">
          <HelpCircle className="w-10 h-10 text-[#123D2A] mx-auto" />
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#123D2A]">
            Frequently Asked Questions
          </h1>
          <p className="text-xs text-[#7A6248]">Find quick answers to common questions regarding shipping, formulations, and returns.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="bg-[#F7F2E8]/60 border border-[#EAE1D2] rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-serif font-bold text-sm text-[#123D2A] flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#789B72] transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-xs text-[#243229]/80 font-medium leading-relaxed border-t border-[#EAE1D2]/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default FaqPage;
