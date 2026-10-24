import React, { useState } from 'react';
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  Layers,
  Sparkles,
  Send,
  Calendar,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { BED_FABRICS } from '../data/constants';
import { api } from '../services/api';

interface InfoViewProps {
  onGoBack?: () => void;
}

export const AboutView: React.FC<InfoViewProps> = ({ onGoBack }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16 space-y-12 sm:space-y-16">
      {/* Universal Step Back Navigation */}
      {onGoBack && (
        <div>
          <button
            onClick={onGoBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1C1917] bg-white border border-[#DCD7CD] px-3 py-1.5 rounded-lg hover:border-[#C5A059] shadow-2xs transition-all active:scale-95"
            title="Go Back One Step"
          >
            <ArrowLeft className="w-4 h-4 text-[#C5A059]" />
            <span>← Back to Previous Screen</span>
          </button>
        </div>
      )}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#A88440]">
          British Craftsmanship & Heritage
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1917]">
          About AMD Furniture UK
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Founded with a commitment to high-calibre British handcrafted furniture, AMD Furniture UK provides bespoke upholstered beds, sliding wardrobes, dining collections, and living room furniture delivered nationwide.
        </p>
      </div>

      {/* Story & Craft */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-5">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
            Handmade Frames & Luxury Fabrics
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Every bed frame is built with kiln-dried timber sourced sustainably, reinforced with solid hardwood corner blocks and heavy-duty steel brackets. Headboards are hand-pleated and deep-buttoned by skilled British upholsterers with decades of experience.
          </p>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            We offer four signature British upholstery fabric groups: brushed plush <strong>Steel</strong>, heritage textured <strong>Chenille</strong>, glamourous shimmering <strong>Crushed Velvet</strong>, and soft contemporary matte <strong>Naples</strong> velvet.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl space-y-1">
              <Award className="w-5 h-5 text-[#C5A059]" />
              <span className="font-serif font-bold text-sm text-[#1C1917] block">UK Safety Standards</span>
              <span className="text-xs text-stone-500">BS 7177 & Crib 5 fire retardant compliance.</span>
            </div>
            <div className="p-4 bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl space-y-1">
              <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
              <span className="font-serif font-bold text-sm text-[#1C1917] block">Bespoke Options</span>
              <span className="text-xs text-stone-500">Tailored headboard heights, drawer setups & sizes.</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <img
            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop"
            alt="British Wingback Bed"
            className="rounded-2xl object-cover h-72 w-full shadow-md"
          />
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop"
            alt="Mirrored Sliding Wardrobe"
            className="rounded-2xl object-cover h-72 w-full shadow-md mt-6"
          />
        </div>
      </div>

      {/* Fabric Swatch Guide */}
      <div className="bg-[#FAF8F5] p-8 sm:p-12 rounded-3xl border border-[#E7E2DA] space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A88440]">
            Upholstery Collection
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
            Our 4 Authentic Fabric Collections
          </h2>
          <p className="text-xs text-stone-500">
            Each fabric is carefully graded for rub-counts, touch, and light reflectance:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(BED_FABRICS).map(([group, data]) => (
            <div key={group} className="bg-white p-5 rounded-xl border border-[#E7E2DA] space-y-3 shadow-2xs">
              <h4 className="font-serif font-bold text-sm text-[#1C1917]">{data.name}</h4>
              <p className="text-xs text-stone-500 leading-relaxed">{data.description}</p>
              <div className="pt-2">
                <span className="text-[10px] text-stone-400 font-semibold uppercase block mb-1.5">
                  Available Shades ({data.colours.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {data.colours.map((c, i) => (
                    <span
                      key={i}
                      title={c.name}
                      className="w-5 h-5 rounded-full border border-stone-300 shadow-2xs"
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ContactView: React.FC<InfoViewProps> = ({ onGoBack }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [postcode, setPostcode] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Please provide your name and contact phone number.');
      return;
    }

    try {
      await api.submitBooking({
        customerName: name,
        customerPhone: phone,
        postcode: postcode.toUpperCase() || 'UK',
        preferredDate: preferredDate || 'As soon as possible',
        notes: message,
        productName: 'General Website Enquiry',
        sku: 'ENQUIRY-GENERAL',
        category: 'Other Furniture Units'
      });
      setSubmitted(true);
    } catch (err: any) {
      alert('Enquiry submitted. You can also message us directly on WhatsApp!');
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16 space-y-8 sm:space-y-12">
      {/* Universal Step Back Navigation */}
      {onGoBack && (
        <div>
          <button
            onClick={onGoBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1C1917] bg-white border border-[#DCD7CD] px-3 py-1.5 rounded-lg hover:border-[#C5A059] shadow-2xs transition-all active:scale-95"
            title="Go Back One Step"
          >
            <ArrowLeft className="w-4 h-4 text-[#C5A059]" />
            <span>← Back to Previous Screen</span>
          </button>
        </div>
      )}

      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#A88440]">
          Get in Touch
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1917]">
          Contact AMD Furniture UK
        </h1>
        <p className="text-sm text-stone-600">
          Our British team is available 7 days a week to help with custom orders, bespoke fabric choices, quotes, and delivery questions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Information & WhatsApp */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#1C1917] text-white p-6 sm:p-8 rounded-2xl space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#E8D7B8]">
              Immediate WhatsApp Assistance
            </h3>
            <p className="text-xs text-[#D6D3D1] leading-relaxed">
              For instant bed prices, photos, and delivery confirmation, message our team on WhatsApp:
            </p>

            <a
              href="https://wa.me/447576531552?text=Hello%20AMD%20Furniture%20UK,%20I%20have%20an%20enquiry%20regarding%20your%20furniture."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20BD5A] text-white p-4 rounded-xl flex items-center gap-3 font-bold text-sm shadow-md transition-transform hover:scale-[1.02]"
            >
              <MessageCircle className="w-6 h-6 fill-white shrink-0" />
              <div>
                <span className="block text-xs font-normal">Direct WhatsApp</span>
                <span className="text-base">+44 7576 531552</span>
              </div>
            </a>

            <div className="pt-4 border-t border-white/10 space-y-4 text-xs text-[#A8A29E]">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold block">Opening Hours</span>
                  <span>Monday – Sunday: 9:00 am – 8:00 pm</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold block">Telephone</span>
                  <span>+44 7576 531552</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold block">Email</span>
                  <span>enquiries@amdfurniture.co.uk</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold block">United Kingdom Hub</span>
                  <span>AMD Furniture UK Logistics Network, Serving Glasgow & Nationwide</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enquiry Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-[#E7E2DA] shadow-xs">
          <h3 className="font-serif text-xl font-bold text-[#1C1917] mb-2">
            Send an Enquiry / Advance Booking Request
          </h3>
          <p className="text-xs text-stone-500 mb-6">
            Fill in your details and our team will get back to you promptly.
          </p>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-serif font-bold text-lg text-emerald-900">Thank You For Your Enquiry</h4>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Your details have been recorded in our dispatch system. To speed up your order or receive instant photos, tap below to open WhatsApp.
              </p>
              <a
                href="https://wa.me/447576531552?text=Hello%20AMD%20Furniture,%20I%20just%20sent%20an%20enquiry%20through%20your%20website."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-lg text-xs font-bold shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                Chat on WhatsApp
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. James Smith"
                    className="w-full bg-[#FAF8F5] border border-[#DCD7CD] rounded-lg px-3.5 py-2.5 text-xs outline-hidden focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Phone / Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. 07123 456789"
                    className="w-full bg-[#FAF8F5] border border-[#DCD7CD] rounded-lg px-3.5 py-2.5 text-xs outline-hidden focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    UK Postcode
                  </label>
                  <input
                    type="text"
                    value={postcode}
                    onChange={e => setPostcode(e.target.value)}
                    placeholder="e.g. G1 1AA or E1 6AN"
                    className="w-full bg-[#FAF8F5] border border-[#DCD7CD] rounded-lg px-3.5 py-2.5 text-xs uppercase outline-hidden focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                    Preferred Delivery Date (Advance Booking)
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={e => setPreferredDate(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#DCD7CD] rounded-lg px-3.5 py-2.5 text-xs outline-hidden focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Enquiry Details / Bed Specifications
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tell us what size, fabric, or furniture items you are looking for..."
                  className="w-full bg-[#FAF8F5] border border-[#DCD7CD] rounded-lg px-3.5 py-2.5 text-xs outline-hidden focus:border-[#C5A059]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1C1917] hover:bg-[#C5A059] hover:text-[#1C1917] text-white font-bold text-xs sm:text-sm py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Enquiry to AMD Furniture</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const ReturnsView: React.FC<InfoViewProps> = ({ onGoBack }) => (
  <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-6">
    {onGoBack && (
      <div>
        <button
          onClick={onGoBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1C1917] bg-white border border-[#DCD7CD] px-3 py-1.5 rounded-lg hover:border-[#C5A059] shadow-2xs transition-all active:scale-95"
          title="Go Back One Step"
        >
          <ArrowLeft className="w-4 h-4 text-[#C5A059]" />
          <span>← Back to Previous Screen</span>
        </button>
      </div>
    )}
    <h1 className="font-serif text-3xl font-bold text-[#1C1917]">Returns & Refunds Policy</h1>
    <div className="prose text-xs sm:text-sm text-stone-600 space-y-4">
      <p>
        At AMD Furniture UK, customer satisfaction is paramount. As many of our upholstered bed frames are made to order to your chosen fabric and drawer specifications, please review our terms below.
      </p>
      <h3 className="font-serif text-lg font-bold text-[#1C1917] text-stone-800">1. Delivery Inspection</h3>
      <p>
        Customers must inspect their items upon arrival while the delivery team is on site. Any visible carton damage or transit tears should be noted immediately to the driver.
      </p>
      <h3 className="font-serif text-lg font-bold text-[#1C1917] text-stone-800">2. 14-Day Right to Return (Standard Stock)</h3>
      <p>
        For standard boxed furniture (such as non-customised dining chairs or coffee tables), you have 14 days from delivery to notify us of a return. Items must be in their original packaging, unbuilt, and in resaleable condition.
      </p>
      <h3 className="font-serif text-lg font-bold text-[#1C1917] text-stone-800">3. Mattresses & Hygiene</h3>
      <p>
        For health and hygiene reasons under UK Consumer Rights legislation, mattresses cannot be returned once their protective sealed plastic wrapping has been opened or slept upon, unless structurally defective.
      </p>
      <h3 className="font-serif text-lg font-bold text-[#1C1917] text-stone-800">4. Contacting Customer Support</h3>
      <p>
        To discuss any return, please contact our logistics desk via WhatsApp at <strong>+44 7576 531552</strong> with your SKU and photos.
      </p>
    </div>
  </div>
);

export const PrivacyView: React.FC<InfoViewProps> = ({ onGoBack }) => (
  <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-6">
    {onGoBack && (
      <div>
        <button
          onClick={onGoBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1C1917] bg-white border border-[#DCD7CD] px-3 py-1.5 rounded-lg hover:border-[#C5A059] shadow-2xs transition-all active:scale-95"
          title="Go Back One Step"
        >
          <ArrowLeft className="w-4 h-4 text-[#C5A059]" />
          <span>← Back to Previous Screen</span>
        </button>
      </div>
    )}
    <h1 className="font-serif text-3xl font-bold text-[#1C1917]">Privacy & Data Policy</h1>
    <div className="prose text-xs sm:text-sm text-stone-600 space-y-4">
      <p>
        AMD Furniture UK is committed to protecting your privacy in full compliance with the UK Data Protection Act 2018 and UK GDPR regulations.
      </p>
      <h3 className="font-serif text-lg font-bold text-[#1C1917] text-stone-800">1. Information We Collect</h3>
      <p>
        We only collect information necessary to fulfill your enquiries and arrange delivery, including your name, contact phone number, delivery address/postcode, and product preferences.
      </p>
      <h3 className="font-serif text-lg font-bold text-[#1C1917] text-stone-800">2. How We Use Your Details</h3>
      <p>
        Your phone number is used exclusively to provide pre-delivery evening updates and for our driver to call approximately 1 hour before arrival. We do not sell or trade customer lists to third-party marketing companies.
      </p>
    </div>
  </div>
);

export const TermsView: React.FC<InfoViewProps> = ({ onGoBack }) => (
  <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-6">
    {onGoBack && (
      <div>
        <button
          onClick={onGoBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1C1917] bg-white border border-[#DCD7CD] px-3 py-1.5 rounded-lg hover:border-[#C5A059] shadow-2xs transition-all active:scale-95"
          title="Go Back One Step"
        >
          <ArrowLeft className="w-4 h-4 text-[#C5A059]" />
          <span>← Back to Previous Screen</span>
        </button>
      </div>
    )}
    <h1 className="font-serif text-3xl font-bold text-[#1C1917]">Terms & Conditions</h1>
    <div className="prose text-xs sm:text-sm text-stone-600 space-y-4">
      <p>
        Welcome to AMD Furniture UK. By accessing this website or placing orders through our WhatsApp consultation channel, you agree to these terms:
      </p>
      <h3 className="font-serif text-lg font-bold text-[#1C1917] text-stone-800">1. Pricing & Quotes</h3>
      <p>
        Bed prices are provided upon individual enquiry based on chosen bespoke dimensions, upholstery fabric, drawer configurations, and delivery zone. Quoted prices on WhatsApp are valid for 14 days.
      </p>
      <h3 className="font-serif text-lg font-bold text-[#1C1917] text-stone-800">2. Delivery Logistics</h3>
      <p>
        AMD Furniture delivers throughout the UK, including Glasgow. Delivery schedules depend on stock availability, courier routes, and confirmation. No delivery date is guaranteed until confirmed by our logistics coordinator.
      </p>
      <h3 className="font-serif text-lg font-bold text-[#1C1917] text-stone-800">3. Access & Measurements</h3>
      <p>
        Customers are responsible for ensuring that headboards, wardrobe boxes, and tables fit through doorways, staircases, and hallways.
      </p>
    </div>
  </div>
);
