import React, { useState, useMemo } from 'react';
import { Product, ProductCategory, ALL_CATEGORIES } from '../types';
import { LUXURY_ASSETS } from '../data/constants';
import { CategoryCard } from '../components/CategoryCard';
import { VirtualProductGrid } from '../components/VirtualProductGrid';
import {
  Truck,
  ShieldCheck,
  Clock,
  ArrowDown,
  MessageCircle,
  CheckCircle2,
  ChevronRight,
  PhoneCall,
  Search,
  Filter,
  Layers,
  Wrench,
  Sparkles
} from 'lucide-react';

interface Props {
  products: Product[];
  onSelectProduct: (p: Product) => void;
  onSelectCategory: (cat: ProductCategory) => void;
  onNavigatePage: (page: string) => void;
}

export const HomeView: React.FC<Props> = ({
  products,
  onSelectProduct,
  onSelectCategory,
  onNavigatePage
}) => {
  const publishedProducts = useMemo(() => {
    return products.filter(p => p.status === 'Published');
  }, [products]);

  // Home category filter state to quickly filter products on the mobile-first homepage
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');
  const [homeSearchQuery, setHomeSearchQuery] = useState<string>('');

  // Filtered products for homepage marketplace display
  const displayedProducts = useMemo(() => {
    return publishedProducts.filter(p => {
      if (selectedCategoryTab !== 'all' && p.category !== selectedCategoryTab) {
        return false;
      }
      if (homeSearchQuery.trim()) {
        const q = homeSearchQuery.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        const matchSubcat = p.subcategory ? p.subcategory.toLowerCase().includes(q) : false;
        if (!matchName && !matchSku && !matchCat && !matchSubcat) {
          return false;
        }
      }
      return true;
    });
  }, [publishedProducts, selectedCategoryTab, homeSearchQuery]);

  const handleCategoryCardClick = (cat: ProductCategory) => {
    setSelectedCategoryTab(cat);
    // Smooth scroll down to the products marketplace section
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToProducts = () => {
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Mobile-first quick filter category tabs
  const POPULAR_TABS: { label: string; value: string }[] = [
    { label: 'All Products', value: 'all' },
    { label: 'Beds', value: 'Beds' },
    { label: 'Wardrobes', value: 'Wardrobes' },
    { label: 'Sliding Wardrobes', value: 'Sliding Door Wardrobes' },
    { label: 'Mattresses', value: 'Mattresses' },
    { label: 'Sofas', value: 'Sofas' },
    { label: 'Dining Tables', value: 'Dining Tables' },
    { label: 'Chest of Drawers', value: 'Chest of Drawers' },
    { label: 'Bedside Units', value: 'Bedside Units' },
    { label: 'Ottomans', value: 'Ottomans' }
  ];

  return (
    <div className="space-y-6 sm:space-y-12 pb-16 sm:pb-20">
      {/* ─────────────────────────────────────────────────────────────
          1. MOBILE-FIRST HERO BANNER (Compact, punchy, high-impact)
         ───────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#121110] text-[#FAF8F5] overflow-hidden border-b border-[#2D2A26]">
        {/* Background Showroom Asset */}
        <div className="absolute inset-0 z-0">
          <img
            src={LUXURY_ASSETS.heroShowroom}
            alt="AMD Furniture UK Showroom"
            className="w-full h-full object-cover object-center filter brightness-[0.70] contrast-[1.05]"
          />
          {/* Gradients ensuring 100% text readability on any mobile phone */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#121110] via-[#121110]/85 to-[#121110]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-3.5 sm:px-6 py-6 sm:py-16 flex flex-col justify-center">
          <div className="max-w-xl space-y-3 sm:space-y-4">
            {/* Mobile Kicker Line */}
            <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#C5A059] uppercase">
              <span className="w-5 h-px bg-[#C5A059]" />
              <span>🇬🇧 British Handcrafted Living · UK</span>
            </div>

            {/* Mobile Headline (Bold, clear, 2 lines max) */}
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight text-balance">
              Handcrafted Luxury Furniture Across The UK
            </h1>

            {/* Mobile Subtitle (Punchy, direct value) */}
            <p className="text-xs sm:text-sm text-stone-300 leading-snug font-normal">
              Plush velvet beds, sliding wardrobes & Italian sintered stone dining. Pay cash on delivery with <strong className="text-white">£0 advance deposit</strong>.
            </p>

            {/* Mobile Dual Action Buttons */}
            <div className="pt-1 grid grid-cols-2 gap-2 sm:flex sm:items-center">
              <button
                type="button"
                onClick={scrollToProducts}
                className="bg-[#C5A059] hover:bg-[#B8934A] text-[#121110] font-bold text-xs sm:text-sm py-3 px-3 sm:px-5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <span>Shop Products</span>
                <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              </button>

              <a
                href="https://wa.me/447576531552?text=Hello%20AMD%20Furniture%20UK,%20I%20would%20like%20to%20enquire%20about%20your%20furniture%20collection."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs sm:text-sm py-3 px-3 sm:px-5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                <span>WhatsApp Us</span>
              </a>
            </div>

            {/* Mobile Trust Strip (Compact 2x2 grid with high-value assurances) */}
            <div className="pt-2.5 border-t border-white/10 grid grid-cols-2 gap-1.5 sm:gap-2.5 text-[10px] sm:text-xs text-stone-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span className="truncate">Free UK & Glasgow Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span className="truncate">Pay on Delivery (COD)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span className="truncate">7-Day Routes (By 7 PM)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span className="truncate">Free Wardrobe Assembly</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. DIRECTLY UNDER BANNER: ALL 12 FURNITURE CATEGORIES
         ───────────────────────────────────────────────────────────── */}
      <section id="categories-grid" className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between gap-2 mb-3 sm:mb-5 pb-2 border-b border-[#E7E2DA]">
          <div>
            <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-[#A88440] block">
              Explore Our Collection
            </span>
            <h2 className="font-serif text-base sm:text-2xl font-bold text-[#1C1917]">
              All 12 Furniture Categories
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigatePage('catalog')}
            className="text-[11px] sm:text-xs font-semibold text-[#1C1917] hover:text-[#C5A059] flex items-center gap-0.5 cursor-pointer"
          >
            <span>Full Catalogue</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
          </button>
        </div>

        {/* 2-Column Mobile Grid for Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
          {ALL_CATEGORIES.map(category => {
            const count = publishedProducts.filter(p => p.category === category).length;
            return (
              <CategoryCard
                key={category}
                category={category}
                productCount={count}
                onClick={handleCategoryCardClick}
              />
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. DIRECTLY UNDER CATEGORIES: ALL PRODUCTS MARKETPLACE
         ───────────────────────────────────────────────────────────── */}
      <section id="products-section" className="max-w-7xl mx-auto px-3 sm:px-4 pt-1">
        {/* Marketplace Filter & Search Header */}
        <div className="bg-white rounded-xl border border-[#E7E2DA] p-3 sm:p-5 shadow-2xs mb-3 sm:mb-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-[#F0ECE4]">
            <div className="flex items-center justify-between sm:justify-start gap-2">
              <h2 className="font-serif text-base sm:text-2xl font-bold text-[#1C1917]">
                Featured Marketplace Products
              </h2>
              <span className="bg-[#1C1917] text-[#FAF8F5] text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-sm">
                {displayedProducts.length} models
              </span>
            </div>

            {/* Mobile Fast In-Line Search */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={homeSearchQuery}
                onChange={e => setHomeSearchQuery(e.target.value)}
                placeholder="Search bed, wardrobe, table..."
                className="w-full bg-[#FAF8F5] border border-[#DCD7CD] focus:border-[#C5A059] rounded-lg pl-8 pr-7 py-2 text-xs text-[#1C1917] outline-hidden placeholder:text-stone-400"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              {homeSearchQuery && (
                <button
                  type="button"
                  onClick={() => setHomeSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-bold p-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Horizontal Swipeable Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {POPULAR_TABS.map(tab => {
              const isActive = selectedCategoryTab === tab.value;
              const count = tab.value === 'all'
                ? publishedProducts.length
                : publishedProducts.filter(p => p.category === tab.value).length;

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setSelectedCategoryTab(tab.value)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all text-[11px] sm:text-xs cursor-pointer flex items-center gap-1 ${
                    isActive
                      ? 'bg-[#1C1917] text-white shadow-xs font-bold'
                      : 'bg-[#FAF8F5] text-stone-700 hover:bg-[#F3EFEA] border border-[#E7E2DA] font-medium'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] ${isActive ? 'text-[#C5A059]' : 'text-stone-400'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dense Facebook Marketplace Product Grid (2 columns on mobile) */}
        {displayedProducts.length > 0 ? (
          <VirtualProductGrid
            products={displayedProducts}
            onSelectProduct={onSelectProduct}
            viewMode="marketplace"
          />
        ) : (
          <div className="bg-white rounded-xl border border-[#E7E2DA] p-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#FAF8F5] mx-auto flex items-center justify-center text-stone-400">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#1C1917]">No products found</h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              No furniture matches "{homeSearchQuery || selectedCategoryTab}".
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategoryTab('all');
                setHomeSearchQuery('');
              }}
              className="bg-[#1C1917] text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg active:scale-95"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. NEXT-DAY BED DELIVERY LOGISTICS (3 Mobile Cards)
         ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="bg-[#1C1917] text-[#FAF8F5] rounded-xl sm:rounded-2xl p-4 sm:p-8 relative overflow-hidden border border-[#383531]">
          <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
            <span className="text-[9px] sm:text-xs font-bold uppercase tracking-widest text-[#C5A059]">
              Transparent UK Logistics
            </span>
            <h2 className="font-serif text-base sm:text-2xl font-bold text-white leading-tight">
              Our Next-Day Delivery & Driver Procedure
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 pt-1">
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4">
                <div className="w-6 h-6 rounded-full bg-[#C5A059] text-[#1C1917] font-bold text-[11px] flex items-center justify-center mb-1.5">
                  1
                </div>
                <h4 className="font-serif text-xs font-bold text-white mb-0.5">Evening Before Dispatch</h4>
                <p className="text-[11px] text-stone-300 leading-relaxed">
                  We confirm your furniture is safely loaded on our direct UK delivery van.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4">
                <div className="w-6 h-6 rounded-full bg-[#C5A059] text-[#1C1917] font-bold text-[11px] flex items-center justify-center mb-1.5">
                  2
                </div>
                <h4 className="font-serif text-xs font-bold text-white mb-0.5">Driver's 1-Hour Call</h4>
                <p className="text-[11px] text-stone-300 leading-relaxed">
                  Driver phones you 60 minutes before arriving at your property.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4">
                <div className="w-6 h-6 rounded-full bg-[#C5A059] text-[#1C1917] font-bold text-[11px] flex items-center justify-center mb-1.5">
                  3
                </div>
                <h4 className="font-serif text-xs font-bold text-white mb-0.5">Inspect & Pay (COD)</h4>
                <p className="text-[11px] text-stone-300 leading-relaxed">
                  Inspect your new furniture upon delivery and pay cash or transfer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. 4-PILLAR VALUE STRIP (MOVED ABOVE FOOTER / CONCIERGE)
         ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="bg-white border border-[#E7E2DA] rounded-xl p-4 sm:p-6 shadow-2xs grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 divide-y-0 sm:divide-y-0 lg:divide-x divide-[#F0ECE4]">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] flex items-center justify-center text-[#C5A059] shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-serif text-xs font-bold text-[#1C1917]">Free UK Delivery</h4>
              <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 leading-tight">
                Covering Glasgow, London, Manchester, Birmingham & all UK postcodes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 lg:pl-6">
            <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] flex items-center justify-center text-[#C5A059] shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-serif text-xs font-bold text-[#1C1917]">Next-Day Bed Route</h4>
              <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 leading-tight">
                7 days routes. Orders placed before 7:00 PM eligible for next-day dispatch.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 lg:pl-6">
            <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] flex items-center justify-center text-[#C5A059] shrink-0">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-serif text-xs font-bold text-[#1C1917]">1-Hour Driver Call</h4>
              <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 leading-tight">
                Our drivers call you 60 minutes prior to arriving at your home.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 lg:pl-6">
            <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] flex items-center justify-center text-[#C5A059] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-serif text-xs font-bold text-[#1C1917]">Cash on Delivery</h4>
              <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 leading-tight">
                No advance deposit required. Inspect furniture before payment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. VIP WHATSAPP CONSULTATION BANNER
         ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="bg-gradient-to-r from-[#FAF8F5] to-[#F5F2EB] border border-[#E7E2DA] rounded-xl p-4 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left shadow-2xs">
          <div className="space-y-1">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#A88440]">
              VIP Furniture Concierge
            </span>
            <h3 className="font-serif text-base sm:text-xl font-bold text-[#1C1917]">
              Need a Custom Size, Fabric Swatches, or Quick Quote?
            </h3>
            <p className="text-[11px] sm:text-xs text-stone-600 max-w-lg">
              Message our British team on WhatsApp at <strong>+44 7576 531552</strong> for instant quotes, bespoke bed customizations, and Glasgow delivery slot reservations.
            </p>
          </div>

          <a
            href="https://wa.me/447576531552?text=Hello%20AMD%20Furniture%20UK,%20I%20would%20like%20to%20enquire%20about%20your%20furniture%20collection."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>WhatsApp: +44 7576 531552</span>
          </a>
        </div>
      </section>
    </div>
  );
};
