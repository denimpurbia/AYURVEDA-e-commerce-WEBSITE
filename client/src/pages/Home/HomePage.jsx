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

import AyurvedaAiImage from '../../assets/ayurveda-ai.png';

const HomePage = () => {
  const [aiChatOpen, setAiChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col justify-between">

      {/* Announcement Bar */}
      <AnnouncementBar />

      {/* Navbar */}
      <Navbar onOpenAiChat={() => setAiChatOpen(true)} />

      <main className="flex-grow">

        <HeroSection
          onWatchFilm={() => setAiChatOpen(true)}
        />

        <BenefitsStrip />

        <CategoryGrid />

        <PromoBanner />

        <NewArrivals />

        <StorySection />

        <AiBanner
          onOpenAiChat={() => setAiChatOpen(true)}
        />

        <ReviewsSection />

        <NewsletterSection />

        <FinalCta />

      </main>

      {/* Footer */}
      <Footer />


      {/* FLOATING AYURVEDA AI */}
      <button
        onClick={() => setAiChatOpen(true)}
        className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-40 group"
        aria-label="Open Ayurveda AI Assistant"
      >
        <img
          src={AyurvedaAiImage}
          alt="Ask Ayurveda AI"
          className="
            w-40
            sm:w-48
            md:w-52
            cursor-pointer
            drop-shadow-2xl
            transition-all
            duration-300
            group-hover:scale-105
          "
        />
      </button>


      {/* AI CHATBOT MODAL */}
      <AiChatbotModal
        isOpen={aiChatOpen}
        onClose={() => setAiChatOpen(false)}
      />

    </div>
  );
};

export default HomePage;