{/* Contact Details Column */}
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