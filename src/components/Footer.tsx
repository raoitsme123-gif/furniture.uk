import React from 'react';
import { ALL_CATEGORIES, ProductCategory } from '../types';
import { MessageCircle, Phone, Mail, MapPin, Truck, ShieldCheck, Lock, ArrowUp } from 'lucide-react';

interface Props {
  onSelectCategory: (cat: ProductCategory | null) => void;
  onNavigatePage: (page: string) => void;
}

export const Footer: React.FC<Props> = ({ onSelectCategory, onNavigatePage }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1C1917] text-[#FAF8F5] border-t border-[#383531] relative">
      {/* UK Delivery Bar above footer */}
      <div className="bg-[#262320] border-b border-white/5 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 text-[#E8D7B8]">
            <Truck className="w-5 h-5 text-[#C5A059] shrink-0" />
            <span>
              <strong className="text-white">UK-Wide Delivery Network:</strong> Fast scheduled routes to{' '}
              <strong className="text-[#C5A059]">Glasgow</strong>, Edinburgh, Manchester, Birmingham, London,
              Cardiff & all UK regions.
            </span>
          </div>
          <button
            onClick={() => onNavigatePage('delivery')}
            className="text-xs text-[#C5A059] hover:underline font-semibold shrink-0"
          >
            Read Full Delivery Policy & Timelines →
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-sm bg-[#C5A059] flex items-center justify-center text-[#1C1917] font-serif font-bold text-lg shadow-sm">
                A
              </span>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-white">
                AMD FURNITURE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#A8A29E] leading-relaxed max-w-sm">
              Premium British furniture retailer delivering handcrafted luxury upholstered beds, spacious sliding wardrobes, elegant dining sets, and living suites directly to your door across the UK.
            </p>

            <div className="pt-2 space-y-2 text-xs text-[#D6D3D1]">
              <a
                href="https://wa.me/447576531552"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-[#C5A059] transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0">
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                </div>
                <span>WhatsApp: +44 7576 531552 (Direct Enquiries)</span>
              </a>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>Customer Care: +44 7576 531552 (Mon - Sun, 9am - 8pm)</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>Enquiries: enquiries@amdfurniture.co.uk</span>
              </div>

              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>AMD Furniture UK Logistics Hub, United Kingdom</span>
              </div>
            </div>
          </div>

          {/* Col 2: Categories (1-6) */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#E8D7B8] tracking-wider uppercase">
              Furniture Collections
            </h4>
            <ul className="space-y-1.5 text-xs text-[#A8A29E]">
              {ALL_CATEGORIES.slice(0, 6).map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      onNavigatePage('catalog');
                      scrollToTop();
                    }}
                    className="hover:text-white transition-colors text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Categories (7-12) */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#E8D7B8] tracking-wider uppercase">
              Living & Storage
            </h4>
            <ul className="space-y-1.5 text-xs text-[#A8A29E]">
              {ALL_CATEGORIES.slice(6, 12).map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      onNavigatePage('catalog');
                      scrollToTop();
                    }}
                    className="hover:text-white transition-colors text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Customer Services & Information */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#E8D7B8] tracking-wider uppercase">
              Customer Services
            </h4>
            <ul className="space-y-2 text-xs text-[#A8A29E]">
              <li>
                <button
                  onClick={() => {
                    onNavigatePage('delivery');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  UK Delivery Information
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigatePage('about');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  About AMD Furniture
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigatePage('contact');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  Contact & Showrooms
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigatePage('returns');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  Returns & Refunds Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigatePage('privacy');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  Privacy & Data Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigatePage('terms');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => {
                    onNavigatePage('admin');
                    scrollToTop();
                  }}
                  className="text-[#C5A059] hover:underline flex items-center gap-1 font-semibold"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin Management Portal</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78716C]">
          <p>© {new Date().getFullYear()} AMD Furniture UK. All Rights Reserved. Handcrafted in the United Kingdom.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-[#A8A29E]">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" /> UK Fire Safety Compliant
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded bg-white/5 hover:bg-white/10 text-[#C5A059] transition-colors"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
