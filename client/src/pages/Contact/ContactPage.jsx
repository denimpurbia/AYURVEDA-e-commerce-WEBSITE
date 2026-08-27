import React, { useState } from 'react';
import AnnouncementBar from '../../components/layout/AnnouncementBar';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import API from '../../services/api';
import { Phone, Mail, MapPin, Send } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError('');
      setSubmitted(false);

      const res = await API.post('/contact', formData);

      if (res.success) {
        setSubmitted(true);

        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });

        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      }
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
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

          <h1 className="font-serif text-4xl font-bold text-[#123D2A]">
            Get in Touch
          </h1>

          <p className="text-xs text-[#7A6248]">
            Have questions about our products or orders? Reach out to our wellness team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Contact Details */}
          <div className="lg:col-span-5 bg-[#F7F2E8] p-8 rounded-3xl border border-[#EAE1D2] space-y-6">

            <h3 className="font-serif font-bold text-xl text-[#123D2A]">
              Contact Details
            </h3>

            <div className="space-y-4 text-xs text-[#243229]">

              {/* Phone */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#123D2A] text-[#C49A52] flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>

                <div>
                  <h4 className="font-bold text-[#123D2A]">
                    Phone Support
                  </h4>

                  <a
                    href="tel:+919876543210"
                    className="text-[#7A6248] hover:text-[#123D2A]"
                  >
                    +91 98765 43210
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#123D2A] text-[#C49A52] flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>

                <div>
                  <h4 className="font-bold text-[#123D2A]">
                    Email Us
                  </h4>

                  <a
                    href="mailto:ayurvedamart2k26@gmail.com"
                    className="text-[#7A6248] hover:text-[#123D2A] break-all"
                  >
                    ayurvedamart2k26@gmail.com
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 shrink-0 rounded-full bg-[#123D2A] text-[#C49A52] flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>

                <div>
                  <h4 className="font-bold text-[#123D2A]">
                    Head Office
                  </h4>

                  <p className="text-[#7A6248]">
                    Court Choraya, Udaipur,
                    Rajasthan - 313011
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-[#FFFDF8] p-8 rounded-3xl border border-[#EAE1D2] shadow-card space-y-6">

            <h3 className="font-serif font-bold text-xl text-[#123D2A]">
              Send Us a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">
                    Your Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Rahul Verma"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="rahul@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                  />
                </div>

              </div>

              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">
                  Subject
                </label>

                <input
                  type="text"
                  name="subject"
                  required
                  placeholder="Product Inquiry / Order Status"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-3 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">
                  Message
                </label>

                <textarea
                  rows={4}
                  name="message"
                  required
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3.5 bg-[#123D2A] text-white text-xs font-bold rounded-full hover:bg-[#0B2D1E] flex items-center gap-2 disabled:opacity-60"
              >
                {submitting ? 'SENDING...' : 'SEND MESSAGE'}

                <Send className="w-4 h-4 text-[#C49A52]" />
              </button>

              {submitted && (
                <p className="text-xs font-bold text-emerald-700">
                  Thank you! Your message has been sent successfully.
                </p>
              )}

              {error && (
                <p className="text-xs font-bold text-red-600">
                  {error}
                </p>
              )}

            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;