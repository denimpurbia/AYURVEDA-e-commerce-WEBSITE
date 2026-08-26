import React, { useState } from 'react';
import AnnouncementBar from '../../components/layout/AnnouncementBar';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Phone, Mail, Clock, MapPin, Send } from 'lucide-react';

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col justify-between">
      <AnnouncementBar />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold tracking-widest text-[#7A6248] uppercase block">
            WE ARE HERE TO HELP
          </span>
          <h1 className="font-serif text-4xl font-bold text-[#123D2A]">Get in Touch</h1>
          <p className="text-xs text-[#7A6248]">Have questions about our formulations, dosage, or order tracking? Reach out to our wellness team.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-5 bg-[#F7F2E8] p-8 rounded-3xl border border-[#EAE1D2] space-y-6">
            <h3 className="font-serif font-bold text-xl text-[#123D2A]">Contact Details</h3>

            <div className="space-y-4 text-xs text-[#243229]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#123D2A] text-[#C49A52] flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#123D2A]">Phone Support</h4>
                  <p className="text-[#7A6248]">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#123D2A] text-[#C49A52] flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#123D2A]">Email Us</h4>
                  <p className="text-[#7A6248]">hello@ayurvedamart.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#123D2A] text-[#C49A52] flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#123D2A]">Working Hours</h4>
                  <p className="text-[#7A6248]">Monday - Sunday / 9:00 AM - 8:00 PM</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#123D2A] text-[#C49A52] flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#123D2A]">Head Office</h4>
                  <p className="text-[#7A6248]">108 Herbal Way, Connaught Place, New Delhi 110001</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7 bg-[#FFFDF8] p-8 rounded-3xl border border-[#EAE1D2] shadow-card space-y-6">
            <h3 className="font-serif font-bold text-xl text-[#123D2A]">Send Us a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">Your Name</label>
                  <input type="text" required placeholder="Rahul Verma" className="w-full p-3 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">Email Address</label>
                  <input type="email" required placeholder="rahul@example.com" className="w-full p-3 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">Subject</label>
                <input type="text" required placeholder="Product Inquiry / Order Status" className="w-full p-3 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none" />
              </div>

              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">Message</label>
                <textarea rows={4} required placeholder="Write your message here..." className="w-full p-3 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none" />
              </div>

              <button type="submit" className="px-8 py-3.5 bg-[#123D2A] text-white text-xs font-bold rounded-full hover:bg-[#0B2D1E] flex items-center gap-2">
                SEND MESSAGE <Send className="w-4 h-4 text-[#C49A52]" />
              </button>
              {submitted && <p className="text-xs font-bold text-emerald-700">Thank you! Message sent successfully. We will reply within 24 hours.</p>}
            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
