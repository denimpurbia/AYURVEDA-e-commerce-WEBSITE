import React from 'react';
import AnnouncementBar from '../../components/layout/AnnouncementBar';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import StorySection from '../../components/home/StorySection';
import { Leaf, Award, Shield, Heart } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col justify-between">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-grow">
        
        {/* Banner Header */}
        <section className="bg-[#123D2A] text-white py-16 text-center">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#C49A52] uppercase block">
              AUTHENTIC AYURVEDA • NATURAL WELLNESS
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold">
              Our Journey & Heritage
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 font-medium max-w-xl mx-auto">
              Bringing classical Ayurvedic formulations into modern everyday life with pure, sun-dried herbs and traditional preparation methods.
            </p>
          </div>
        </section>

        <StorySection />

        <section className="py-16 bg-[#FFFDF8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-serif text-3xl font-bold text-[#123D2A]">Our Quality Commitment</h2>
              <p className="text-xs text-[#7A6248] mt-2">Every batch of herbs undergoes strict purity checks to ensure 100% heavy-metal-free, chemical-free wellness.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-[#F7F2E8] rounded-2xl border border-[#EAE1D2] space-y-2 text-center">
                <Leaf className="w-8 h-8 text-[#789B72] mx-auto" />
                <h3 className="font-bold text-sm text-[#123D2A]">Wildcrafted Sourcing</h3>
                <p className="text-xs text-[#7A6248]">Herbs harvested directly from pristine Himalayan valleys and Kerala herbal gardens.</p>
              </div>

              <div className="p-6 bg-[#F7F2E8] rounded-2xl border border-[#EAE1D2] space-y-2 text-center">
                <Award className="w-8 h-8 text-[#C49A52] mx-auto" />
                <h3 className="font-bold text-sm text-[#123D2A]">Classical Extraction</h3>
                <p className="text-xs text-[#7A6248]">Formulated using traditional Kwath & Taila Paka Vidhi according to ancient texts.</p>
              </div>

              <div className="p-6 bg-[#F7F2E8] rounded-2xl border border-[#EAE1D2] space-y-2 text-center">
                <Shield className="w-8 h-8 text-[#789B72] mx-auto" />
                <h3 className="font-bold text-sm text-[#123D2A]">Lab Tested Purity</h3>
                <p className="text-xs text-[#7A6248]">Independently tested for microbial safety, pesticides, and active phytochemical potency.</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
