import React, { useState } from 'react';
import AnnouncementBar from '../../components/layout/AnnouncementBar';
import Navbar from '../../components/layout/Navbar';
import HeroSection from '../../components/home/HeroSection';
import BenefitsStrip from '../../components/home/BenefitsStrip';
import CategoryGrid from '../../components/home/CategoryGrid';
import PromoBanner from '../../components/home/PromoBanner';
import NewArrivals from '../../components/home/NewArrivals';
import StorySection from '../../components/home/StorySection';
import AiBanner from '../../components/home/AiBanner';
import ReviewsSection from '../../components/home/ReviewsSection';
import NewsletterSection from '../../components/home/NewsletterSection';
import FinalCta from '../../components/home/FinalCta';
import Footer from '../../components/layout/Footer';
import AiChatbotModal from '../../components/chatbot/AiChatbotModal';
import { Bot } from 'lucide-react';

const HomePage = () => {
  const [aiChatOpen, setAiChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col justify-between">
      
      {/* 01. Announcement Bar */}
      <AnnouncementBar />

      {/* 02. Navbar */}
      <Navbar onOpenAiChat={() => setAiChatOpen(true)} />

      <main className="flex-grow">
        {/* 03 & 04. Hero Section + Hero Trust Points */}
        <HeroSection onWatchFilm={() => setAiChatOpen(true)} />

        {/* 05. Floating Benefits Strip */}
        <BenefitsStrip />

        {/* 06. Explore By Category */}
        <CategoryGrid />

        {/* 07. Promotional Banner */}
        <PromoBanner />

        {/* 08. New Arrivals */}
        <NewArrivals />

        {/* 09 & 10. Ayurveda Story & Why Choose Us */}
        <StorySection />

        {/* 11. Ayurveda AI Section */}
        <AiBanner onOpenAiChat={() => setAiChatOpen(true)} />

        {/* 12. Customer Reviews */}
        <ReviewsSection />

        {/* 13. Newsletter */}
        <NewsletterSection />

        {/* 14. Final CTA */}
        <FinalCta />
      </main>

      {/* 15. Footer */}
      <Footer />

      {/* Floating Bottom Right AI Button */}
      <button
        onClick={() => setAiChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#123D2A] text-[#C49A52] p-3.5 rounded-full shadow-2xl hover:bg-[#0B2D1E] hover:scale-110 transition-all border-2 border-[#C49A52] flex items-center gap-2 font-bold text-xs"
        aria-label="Open Ayurveda AI Assistant"
      >
        <Bot className="w-6 h-6 text-[#C49A52]" />
        <span className="hidden sm:inline text-white font-serif tracking-wider">AYURVEDA AI</span>
      </button>

      {/* AI Assistant Modal */}
      <AiChatbotModal isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />

    </div>
  );
};

export default HomePage;
