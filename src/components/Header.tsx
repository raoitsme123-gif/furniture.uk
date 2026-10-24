import React, { useState } from 'react';
import {
  Search,
  MessageCircle,
  Menu,
  X,
  ChevronDown,
  Truck,
  ArrowLeft,
  Lock,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { ALL_CATEGORIES, ProductCategory } from '../types';

interface Props {
  currentCategory?: string | null;
  onSelectCategory: (cat: ProductCategory | null) => void;
  onNavigatePage: (page: string) => void;
  currentPage: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
  canGoBack?: boolean;
  onGoBack?: () => void;
  cartItemCount?: number;
  onOpenBasket?: () => void;
}

export const Header: React.FC<Props> = ({
  currentCategory,
  onSelectCategory,
  onNavigatePage,
  currentPage,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  canGoBack,
  onGoBack,
  cartItemCount = 0,
  onOpenBasket
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const handleCategoryClick = (cat: ProductCategory | null) => {
    onSelectCategory(cat);
    onNavigatePage('catalog');
    setCategoryDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleNavClick = (page: string) => {
    onNavigatePage(page);
    setMobileMenuOpen(false);
    setCategoryDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E7E2DA] shadow-xs">
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left actions: Back Arrow & Mobile Menu Button */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Universal Back Arrow - Easy 1-step back on mobile & desktop */}
          {canGoBack && onGoBack && (
            <button
              onClick={onGoBack}
              className="py-1.5 px-2.5 -ml-1 text-[#1C1917] hover:text-[#C5A059] bg-[#FAF8F5] hover:bg-[#F5F2EB] border border-[#DCD7CD] rounded-lg transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
              title="Go Back One Step"
              aria-label="Go Back One Step"
            >
              <ArrowLeft className="w-4 h-4 text-[#C5A059]" />
              <span className="text-xs font-bold text-[#1C1917]">Back</span>
            </button>
          )}

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#1C1917] hover:bg-[#F5F2EB] rounded-lg transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('home')}
          className="cursor-pointer flex flex-col items-start select-none group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#161412] flex items-center justify-center text-[#E5D4B3] font-serif font-bold text-base shadow-sm group-hover:bg-[#C5A059] group-hover:text-[#121110] transition-all border border-[#B89047]/80 ring-1 ring-[#B89047]/30">
              <span>A</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-2xl font-bold tracking-[0.06em] text-[#161412] group-hover:text-[#9E7832] transition-colors leading-none">
                AMD FURNITURE
              </span>
              <span className="text-[8.5px] sm:text-[9.5px] tracking-[0.22em] text-[#9E7832] font-semibold uppercase mt-1">
                BRITISH BESPOKE ATELIER · UK
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <form
            onSubmit={e => {
              e.preventDefault();
              onSearchSubmit();
            }}
            className="relative w-full"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search beds, wardrobes, dining, sofas, SKU..."
              className="w-full bg-[#FAF8F5] border border-[#DCD7CD] focus:border-[#C5A059] focus:bg-white text-xs sm:text-sm text-[#1C1917] rounded-full pl-4 pr-10 py-2.5 outline-hidden transition-all shadow-2xs placeholder:text-[#A8A29E]"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-stone-500 hover:text-[#C5A059] transition-colors rounded-full"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Basket & Direct WhatsApp Callout Button */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">

          {onOpenBasket && (
            <button
              onClick={onOpenBasket}
              className="relative py-2 px-2.5 sm:px-3 sm:py-2.5 rounded-full border border-[#DCD7CD] bg-[#FAF8F5] hover:bg-[#F5F2EB] text-[#1C1917] transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
              title="View Shopping Basket"
              aria-label="View Shopping Basket"
            >
              <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
              <span className="hidden sm:inline text-xs font-bold">Basket</span>
              {cartItemCount > 0 ? (
                <span className="bg-[#1C1917] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-4 text-center leading-none">
                  {cartItemCount}
                </span>
              ) : (
                <span className="text-[10px] text-stone-400 font-medium hidden sm:inline">0</span>
              )}
            </button>
          )}

          <a
            href="https://wa.me/447576531552?text=Hello%20AMD%20Furniture%20UK,%20I%20would%20like%20to%20enquire%20about%20your%20furniture%20collection."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 sm:gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-full font-medium text-xs sm:text-sm shadow-sm transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4 shrink-0 fill-white" />
            <span className="hidden sm:inline font-semibold">Enquire on WhatsApp</span>
            <span className="sm:hidden font-semibold">WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-2.5">
        <form
          onSubmit={e => {
            e.preventDefault();
            onSearchSubmit();
          }}
          className="relative w-full"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search beds, wardrobes, sofas, SKU..."
            className="w-full bg-[#FAF8F5] border border-[#DCD7CD] focus:border-[#C5A059] text-xs text-[#1C1917] rounded-full pl-3.5 pr-9 py-2 outline-hidden"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-stone-500"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Desktop Main Navigation Bar */}
      <nav className="hidden lg:block border-t border-[#F0ECE4] bg-white">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs tracking-wide">
          <div className="flex items-center space-x-1">
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                onMouseEnter={() => setCategoryDropdownOpen(true)}
                className={`flex items-center gap-1.5 px-3.5 py-3 font-semibold uppercase tracking-wider transition-colors border-b-2 ${
                  categoryDropdownOpen
                    ? 'border-[#C5A059] text-[#C5A059] bg-[#FAF8F5]'
                    : 'border-transparent text-[#1C1917] hover:text-[#C5A059]'
                }`}
              >
                <span>All 12 Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Dropdown */}
              {categoryDropdownOpen && (
                <div
                  onMouseLeave={() => setCategoryDropdownOpen(false)}
                  className="absolute left-0 top-full w-[640px] bg-white border border-[#E7E2DA] shadow-xl rounded-b-xl p-5 grid grid-cols-2 gap-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="col-span-2 pb-2 mb-1 border-b border-[#F4EFEA] flex items-center justify-between">
                    <span className="font-serif text-sm font-bold text-[#1C1917] uppercase tracking-wider">
                      Browse Full Furniture Collection
                    </span>
                    <button
                      onClick={() => handleCategoryClick(null)}
                      className="text-xs text-[#C5A059] font-medium hover:underline"
                    >
                      View All Products ({ALL_CATEGORIES.length} Categories) →
                    </button>
                  </div>

                  {ALL_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className={`flex items-center justify-between p-2.5 rounded-lg text-left transition-all group ${
                        currentCategory === cat ? 'bg-[#F9F6F0] font-bold text-[#A88440]' : 'hover:bg-[#FAF8F5] text-[#292524]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] opacity-40 group-hover:opacity-100 transition-opacity"></span>
                        <span className="text-xs tracking-normal font-medium">{cat}</span>
                      </div>
                      {cat === 'Beds' && (
                        <span className="text-[10px] bg-[#E8D7B8] text-[#1C1917] px-2 py-0.5 rounded font-semibold">
                          Bespoke
                        </span>
                      )}
                      {cat === 'Sliding Door Wardrobes' && (
                        <span className="text-[10px] bg-stone-100 text-[#57534E] px-2 py-0.5 rounded font-medium">
                          Mirrored
                        </span>
                      )}
                    </button>
                  ))}

                  {/* Admin Portal inside Menu */}
                  <div className="col-span-2 pt-3 mt-1 border-t border-[#F4EFEA] flex items-center justify-between">
                    <span className="text-[11px] text-stone-400 font-medium">Authorized Store Management</span>
                    <button
                      onClick={() => handleNavClick('admin')}
                      className="text-xs text-[#A88440] hover:text-[#1C1917] font-semibold flex items-center gap-1.5 py-1 px-3 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] hover:border-[#C5A059] transition-all"
                    >
                      <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Admin Management Portal</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Quick Links to Popular Categories */}
            <button
              onClick={() => handleCategoryClick('Beds')}
              className={`px-3 py-3 font-medium transition-colors border-b-2 ${
                currentCategory === 'Beds' && currentPage === 'catalog'
                  ? 'border-[#C5A059] text-[#C5A059]'
                  : 'border-transparent text-[#44403C] hover:text-[#C5A059]'
              }`}
            >
              Beds
            </button>
            <button
              onClick={() => handleCategoryClick('Mattresses')}
              className={`px-3 py-3 font-medium transition-colors border-b-2 ${
                currentCategory === 'Mattresses' && currentPage === 'catalog'
                  ? 'border-[#C5A059] text-[#C5A059]'
                  : 'border-transparent text-[#44403C] hover:text-[#C5A059]'
              }`}
            >
              Mattresses
            </button>
            <button
              onClick={() => handleCategoryClick('Wardrobes')}
              className={`px-3 py-3 font-medium transition-colors border-b-2 ${
                currentCategory === 'Wardrobes' && currentPage === 'catalog'
                  ? 'border-[#C5A059] text-[#C5A059]'
                  : 'border-transparent text-[#44403C] hover:text-[#C5A059]'
              }`}
            >
              Wardrobes
            </button>
            <button
              onClick={() => handleCategoryClick('Sliding Door Wardrobes')}
              className={`px-3 py-3 font-medium transition-colors border-b-2 ${
                currentCategory === 'Sliding Door Wardrobes' && currentPage === 'catalog'
                  ? 'border-[#C5A059] text-[#C5A059]'
                  : 'border-transparent text-[#44403C] hover:text-[#C5A059]'
              }`}
            >
              Sliding Wardrobes
            </button>
            <button
              onClick={() => handleCategoryClick('Sofas')}
              className={`px-3 py-3 font-medium transition-colors border-b-2 ${
                currentCategory === 'Sofas' && currentPage === 'catalog'
                  ? 'border-[#C5A059] text-[#C5A059]'
                  : 'border-transparent text-[#44403C] hover:text-[#C5A059]'
              }`}
            >
              Sofas
            </button>
            <button
              onClick={() => handleCategoryClick('Dining Tables')}
              className={`px-3 py-3 font-medium transition-colors border-b-2 ${
                currentCategory === 'Dining Tables' && currentPage === 'catalog'
                  ? 'border-[#C5A059] text-[#C5A059]'
                  : 'border-transparent text-[#44403C] hover:text-[#C5A059]'
              }`}
            >
              Dining Tables
            </button>
            <button
              onClick={() => handleCategoryClick(null)}
              className={`px-3 py-3 font-medium transition-colors border-b-2 ${
                !currentCategory && currentPage === 'catalog'
                  ? 'border-[#C5A059] text-[#C5A059]'
                  : 'border-transparent text-[#44403C] hover:text-[#C5A059]'
              }`}
            >
              All Products
            </button>
          </div>

          {/* Service Links & Admin Panel */}
          <div className="flex items-center space-x-3 text-xs font-medium text-[#57534E]">
            <button
              onClick={() => handleNavClick('delivery')}
              className={`hover:text-[#C5A059] transition-colors flex items-center gap-1 ${
                currentPage === 'delivery' ? 'text-[#C5A059] font-semibold' : ''
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>UK Delivery</span>
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`hover:text-[#C5A059] transition-colors ${
                currentPage === 'about' ? 'text-[#C5A059] font-semibold' : ''
              }`}
            >
              About AMD
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`hover:text-[#C5A059] transition-colors ${
                currentPage === 'contact' ? 'text-[#C5A059] font-semibold' : ''
              }`}
            >
              Contact
            </button>

            {/* Admin Panel is housed strictly inside Categories Menu and Mobile Menu Drawer */}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[60px] bottom-0 bg-white z-50 overflow-y-auto p-4 border-t border-[#E7E2DA] flex flex-col justify-between animate-in slide-in-from-top duration-200">
          <div>
            {canGoBack && onGoBack && (
              <button
                onClick={() => {
                  onGoBack();
                  setMobileMenuOpen(false);
                }}
                className="w-full mb-3 py-2 px-3 bg-[#FAF8F5] border border-[#E7E2DA] rounded-lg text-xs font-bold text-[#1C1917] flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4 text-[#C5A059]" />
                <span>Go Back One Step</span>
              </button>
            )}

            <div className="pb-3 border-b border-[#F0ECE4] mb-3">
              <span className="font-serif text-sm font-bold text-[#1C1917] uppercase tracking-wider block mb-2">
                All Furniture Categories
              </span>
              <div className="grid grid-cols-1 gap-1">
                {ALL_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`w-full text-left py-2 px-3 rounded-md text-xs font-medium flex items-center justify-between ${
                      currentCategory === cat ? 'bg-[#F9F6F0] text-[#C5A059] font-bold' : 'text-[#292524] hover:bg-stone-50'
                    }`}
                  >
                    <span>{cat}</span>
                    {cat === 'Beds' && (
                      <span className="text-[10px] bg-[#E8D7B8] px-1.5 py-0.5 rounded text-[#1C1917] font-semibold">
                        Bespoke
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <button
                onClick={() => handleNavClick('delivery')}
                className="w-full text-left py-2 px-3 text-xs font-semibold text-[#1C1917] flex items-center gap-2 hover:bg-stone-50 rounded"
              >
                <Truck className="w-4 h-4 text-[#C5A059]" />
                UK Delivery & Glasgow Routes
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className="w-full text-left py-2 px-3 text-xs font-semibold text-[#1C1917] hover:bg-stone-50 rounded"
              >
                About AMD Furniture UK
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className="w-full text-left py-2 px-3 text-xs font-semibold text-[#1C1917] hover:bg-stone-50 rounded"
              >
                Contact & Showroom Enquiries
              </button>

              {/* Admin Panel in Mobile Menu */}
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full text-left py-2 px-3 text-xs font-bold text-[#A88440] flex items-center gap-2 bg-[#FAF8F5] border border-[#E7E2DA] rounded mt-2"
              >
                <Lock className="w-4 h-4 text-[#C5A059]" />
                Admin Panel Portal
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F0ECE4] mt-6">
            <a
              href="https://wa.me/447576531552"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#25D366] text-white rounded-lg flex items-center justify-center gap-2 font-semibold text-xs shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp: +44 7576 531552
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
