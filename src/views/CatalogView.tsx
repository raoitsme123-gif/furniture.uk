import React, { useState, useMemo } from 'react';
import { Product, ProductCategory, ALL_CATEGORIES } from '../types';
import { CATEGORY_DETAILS, WARDROBE_SIZES_SPECS, getCategoryMeta } from '../data/constants';
import { ProductCard } from '../components/ProductCard';
import { CategoryCard } from '../components/CategoryCard';
import { VirtualProductGrid } from '../components/VirtualProductGrid';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ArrowLeft,
  Sliders,
  Wrench,
  Sparkles,
  Layers,
  Grid2X2,
  LayoutGrid
} from 'lucide-react';

interface Props {
  products: Product[];
  currentCategory: ProductCategory | null;
  onSelectCategory: (cat: ProductCategory | null) => void;
  onSelectProduct: (product: Product) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onGoBack?: () => void;
}

const ITEMS_PER_PAGE = 36;

export const CatalogView: React.FC<Props> = ({
  products,
  currentCategory,
  onSelectCategory,
  onSelectProduct,
  searchQuery,
  onSearchChange,
  onGoBack
}) => {
  const [selectedStockStatus, setSelectedStockStatus] = useState<string>('all');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'name' | 'price-asc' | 'price-desc'>('newest');
  const [viewMode, setViewMode] = useState<'marketplace' | 'spacious'>('marketplace');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter only published products
  const publishedProducts = useMemo(() => {
    return products.filter(p => p.status === 'Published');
  }, [products]);

  // Extract all available sizes in current category or total
  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    publishedProducts.forEach(p => {
      if (!currentCategory || p.category === currentCategory) {
        (p.sizes || []).forEach(s => set.add(s));
      }
    });
    return Array.from(set);
  }, [publishedProducts, currentCategory]);

  // Extract all available subcategories for current category
  const availableSubcategories = useMemo(() => {
    if (!currentCategory) return [];
    const meta = getCategoryMeta(currentCategory);
    const set = new Set<string>(meta.subcategories || []);
    // Also include any subcategories present on actual products
    publishedProducts.forEach(p => {
      if (p.category === currentCategory && p.subcategory) {
        set.add(p.subcategory);
      }
    });
    return Array.from(set);
  }, [publishedProducts, currentCategory]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return publishedProducts.filter(p => {
      // Category filter
      if (currentCategory && p.category !== currentCategory) {
        return false;
      }

      // Subcategory filter
      if (selectedSubcategory !== 'all') {
        if (p.subcategory !== selectedSubcategory) {
          return false;
        }
      }

      // Stock status filter
      if (selectedStockStatus !== 'all' && p.stockStatus !== selectedStockStatus) {
        return false;
      }

      // Size filter
      if (selectedSizeFilter !== 'all') {
        if (!p.sizes || !p.sizes.includes(selectedSizeFilter)) {
          return false;
        }
      }

      // Search Query (Name, SKU, Category, Subcategory)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
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
  }, [publishedProducts, currentCategory, selectedSubcategory, selectedStockStatus, selectedSizeFilter, searchQuery]);

  // Sort products - STRICTLY PRESERVE BED PRICING RULES
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'price-asc') {
      list.sort((a, b) => {
        if (a.category === 'Beds') return 1;
        if (b.category === 'Beds') return -1;
        return (a.price || 0) - (b.price || 0);
      });
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => {
        if (a.category === 'Beds') return 1;
        if (b.category === 'Beds') return -1;
        return (b.price || 0) - (a.price || 0);
      });
    }
    return list;
  }, [filteredProducts, sortBy]);

  // Pagination calculation for 600+ capacity
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  // Group products by subcategory for organized display
  const subcategoryGroups = useMemo(() => {
    if (!currentCategory || selectedSubcategory !== 'all') return null;
    const map = new Map<string, Product[]>();
    paginatedProducts.forEach(prod => {
      const groupKey = prod.subcategory || `${currentCategory} Collection`;
      if (!map.has(groupKey)) {
        map.set(groupKey, []);
      }
      map.get(groupKey)!.push(prod);
    });
    // Check if any product has an assigned subcategory
    const hasAnySubcategory = paginatedProducts.some(p => !!p.subcategory);
    if (!hasAnySubcategory || map.size <= 1) return null;
    return Array.from(map.entries());
  }, [currentCategory, selectedSubcategory, paginatedProducts]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const handleCategorySelect = (cat: ProductCategory | null) => {
    onSelectCategory(cat);
    setCurrentPage(1);
    setSelectedSizeFilter('all');
    setSelectedSubcategory('all');
  };

  const currentCategoryMeta = currentCategory ? getCategoryMeta(currentCategory) : null;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-8 pb-20 sm:pb-8">
      {/* Universal Step Back Navigation */}
      <div className="flex items-center justify-between gap-3">
        {onGoBack ? (
          <button
            onClick={onGoBack}
            className="flex items-center gap-1.5 text-xs font-bold text-[#1C1917] bg-white border border-[#DCD7CD] px-3 py-1.5 rounded-lg hover:border-[#C5A059] shadow-2xs transition-all active:scale-95"
            title="Go Back One Step"
          >
            <ArrowLeft className="w-4 h-4 text-[#C5A059]" />
            <span>← Back to Previous Screen</span>
          </button>
        ) : (
          <button
            onClick={() => handleCategorySelect(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#1C1917] bg-white border border-[#DCD7CD] px-3 py-1.5 rounded-lg hover:border-[#C5A059] shadow-2xs transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-[#C5A059]" />
            <span>← View All Categories</span>
          </button>
        )}

        {currentCategory && (
          <button
            onClick={() => handleCategorySelect(null)}
            className="text-xs text-[#A88440] font-semibold hover:underline"
          >
            Show All Products
          </button>
        )}
      </div>

      {/* Category Banner / Hero - Mobile adapted */}
      <div className="relative rounded-xl sm:rounded-2xl bg-[#1C1917] text-white p-4 sm:p-10 overflow-hidden shadow-md">
        {currentCategoryMeta?.heroImage && (
          <div className="absolute inset-0 pointer-events-none">
            <img
              src={currentCategoryMeta.heroImage}
              alt=""
              className="w-full h-full object-cover object-center opacity-30 scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1C1917] via-[#1C1917]/90 to-transparent" />
          </div>
        )}
        <div className="relative z-10 max-w-2xl space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-[#C5A059] text-[#1C1917] px-2 py-0.5 rounded">
              {currentCategory ? currentCategoryMeta?.badge || currentCategory : 'Full Showroom'}
            </span>
            <span className="text-[11px] sm:text-xs text-[#A8A29E]">
              {filteredProducts.length} items
            </span>
          </div>

          <h1 className="font-serif text-xl sm:text-4xl font-bold tracking-tight text-white">
            {currentCategory || 'Complete Furniture Collection'}
          </h1>

          <p className="text-xs sm:text-sm text-[#D6D3D1] leading-relaxed line-clamp-2 sm:line-clamp-none">
            {currentCategoryMeta?.description ||
              'Explore our complete catalogue of British upholstered beds, wardrobes, mattresses, and dining sets. All products delivered UK-wide including Glasgow.'}
          </p>

          {currentCategory === 'Beds' && (
            <div className="pt-1 flex items-center gap-1.5 text-[11px] sm:text-xs text-[#E8D7B8]">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C5A059] shrink-0" />
              <span>Bespoke fabrics. Instant quotes via WhatsApp.</span>
            </div>
          )}
        </div>
      </div>

      {/* Categories Pill Bar - Touch scrollable */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0">
        <button
          onClick={() => handleCategorySelect(null)}
          className={`px-3 sm:px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all ${
            !currentCategory
              ? 'bg-[#1C1917] text-[#FAF8F5] shadow-xs'
              : 'bg-white text-stone-700 border border-[#DCD7CD] hover:border-[#C5A059]'
          }`}
        >
          All ({publishedProducts.length})
        </button>
        {ALL_CATEGORIES.map(cat => {
          const count = publishedProducts.filter(p => p.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-3 sm:px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all ${
                currentCategory === cat
                  ? 'bg-[#C5A059] text-[#1C1917] font-bold shadow-xs'
                  : 'bg-white text-stone-700 border border-[#DCD7CD] hover:border-[#C5A059]'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Visual Category Showcase - Rendered when viewing full showroom */}
      {!currentCategory && (
        <section className="bg-white rounded-xl sm:rounded-2xl border border-[#E7E2DA] p-4 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F4EFEA]">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#A88440] block">
                Showroom Departments
              </span>
              <h2 className="font-serif text-base sm:text-xl font-bold text-[#1C1917]">
                All 12 Furniture Categories
              </h2>
            </div>
            <span className="text-xs text-stone-500 font-medium hidden sm:inline">
              Select any category to view tailored options & sub-categories
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {ALL_CATEGORIES.map(cat => {
              const count = publishedProducts.filter(p => p.category === cat).length;
              return (
                <CategoryCard
                  key={cat}
                  category={cat}
                  productCount={count}
                  onClick={handleCategorySelect}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Sub-Categories Pill Navigation Bar - Rendered directly beneath category ("sub cetagery ka nicha") */}
      {currentCategory && availableSubcategories.length > 0 && (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-[#E7E2DA] p-3.5 sm:p-4 shadow-2xs space-y-2.5 animate-in fade-in">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#C5A059]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#1C1917]">
                {currentCategory} Sub-Categories
              </span>
              <span className="bg-[#FAF6EE] text-[#A88440] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#EBE3D3]">
                {availableSubcategories.length} Sections
              </span>
            </div>
            {selectedSubcategory !== 'all' && (
              <button
                onClick={() => {
                  setSelectedSubcategory('all');
                  setCurrentPage(1);
                }}
                className="text-xs text-[#A88440] hover:underline font-semibold"
              >
                Show All {currentCategory} Sub-Categories
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
            <button
              onClick={() => {
                setSelectedSubcategory('all');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                selectedSubcategory === 'all'
                  ? 'bg-[#1C1917] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-stone-700 border border-[#DCD7CD] hover:border-[#C5A059]'
              }`}
            >
              All {currentCategory} ({publishedProducts.filter(p => p.category === currentCategory).length})
            </button>
            {availableSubcategories.map(sub => {
              const count = publishedProducts.filter(
                p => p.category === currentCategory && p.subcategory === sub
              ).length;
              const isSelected = selectedSubcategory === sub;
              return (
                <button
                  key={sub}
                  onClick={() => {
                    setSelectedSubcategory(isSelected ? 'all' : sub);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#C5A059] text-[#1C1917] font-bold shadow-xs'
                      : 'bg-[#FAF8F5] text-stone-700 border border-[#DCD7CD] hover:border-[#C5A059]'
                  }`}
                >
                  <span>{sub}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-[#1C1917] text-white' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Wardrobe Dynamic Sizes & Exact Measurements Selector (Requirement 1) */}
      {(currentCategory === 'Wardrobes' || currentCategory === 'Sliding Door Wardrobes') && (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-[#E7E2DA] p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A88440] block">
                Wardrobe Sizes & Exact Measurements
              </span>
              <h3 className="font-serif font-bold text-sm sm:text-base text-[#1C1917]">
                Select Your Required Wardrobe Door Size
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-50 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1">
                <Wrench className="w-3 h-3 text-blue-600" />
                FREE Assembly Included
              </span>
              <span className="bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                Cash on Delivery
              </span>
            </div>
          </div>

          {/* Door Size Selector Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {WARDROBE_SIZES_SPECS.map(ws => {
              const isSelected = selectedSizeFilter === ws.size;
              return (
                <button
                  key={ws.size}
                  type="button"
                  onClick={() => {
                    setSelectedSizeFilter(isSelected ? 'all' : ws.size);
                    setCurrentPage(1);
                  }}
                  className={`min-h-[48px] p-2.5 rounded-lg border text-left transition-all active:scale-95 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#1C1917] text-white border-[#1C1917] ring-2 ring-[#C5A059]/40 shadow-sm'
                      : 'bg-[#FAF8F5] text-stone-800 border-[#DCD7CD] hover:border-[#C5A059]'
                  }`}
                >
                  <span className="text-xs font-bold block">{ws.size}</span>
                  <span className={`text-[10px] block ${isSelected ? 'text-[#C5A059]' : 'text-stone-500'}`}>
                    £{ws.basePrice}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Display Exact Measurements for selected door size */}
          {selectedSizeFilter !== 'all' ? (
            <div className="bg-[#FAF6EE] border border-[#EBE3D3] rounded-lg p-3 text-xs flex items-center justify-between flex-wrap gap-2 animate-in fade-in">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span className="font-bold text-[#1C1917]">{selectedSizeFilter}:</span>
                <span className="font-mono text-[#57441B] font-bold">
                  {WARDROBE_SIZES_SPECS.find(s => s.size === selectedSizeFilter)?.dimensions}
                </span>
              </div>
              <button
                onClick={() => setSelectedSizeFilter('all')}
                className="text-xs text-[#A88440] hover:underline font-semibold"
              >
                Clear Size Filter
              </button>
            </div>
          ) : (
            <div className="text-[11px] text-stone-500 italic flex items-center gap-1.5">
              <span>💡 Tap any wardrobe size above to filter and inspect exact width × height × depth measurements.</span>
            </div>
          )}
        </div>
      )}

      {/* Main Content: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 bg-white p-5 rounded-xl border border-[#E7E2DA] shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#EFEBE4]">
            <h3 className="font-serif font-bold text-sm text-[#1C1917] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#C5A059]" />
              Filters
            </h3>
            {(selectedStockStatus !== 'all' || selectedSizeFilter !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedStockStatus('all');
                  setSelectedSizeFilter('all');
                  onSearchChange('');
                  setCurrentPage(1);
                }}
                className="text-xs text-[#A88440] hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Search within results */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1.5">
              Filter by Keyword or SKU
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  onSearchChange(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="e.g. Wingback, AMD-WD..."
                className="w-full bg-[#FAF8F5] border border-[#DCD7CD] rounded-lg px-3 py-2 text-xs outline-hidden focus:border-[#C5A059]"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Stock Status Filter */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2">
              Stock Availability
            </label>
            <div className="space-y-1.5 text-xs">
              {['all', 'In Stock', 'Low Stock', 'Made to Order'].map(status => (
                <label
                  key={status}
                  className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-stone-50"
                >
                  <input
                    type="radio"
                    name="stockStatus"
                    checked={selectedStockStatus === status}
                    onChange={() => {
                      setSelectedStockStatus(status);
                      setCurrentPage(1);
                    }}
                    className="accent-[#C5A059]"
                  />
                  <span className={selectedStockStatus === status ? 'font-semibold text-[#1C1917]' : 'text-stone-600'}>
                    {status === 'all' ? 'All Availability' : status}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Sizes Filter */}
          {availableSizes.length > 0 && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2">
                Available Size
              </label>
              <select
                value={selectedSizeFilter}
                onChange={e => {
                  setSelectedSizeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#FAF8F5] border border-[#DCD7CD] rounded-lg px-3 py-2 text-xs outline-hidden focus:border-[#C5A059]"
              >
                <option value="all">All Sizes</option>
                {availableSizes.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}
          {/* Subcategories Filter in Sidebar */}
          {currentCategory && availableSubcategories.length > 0 && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2 flex items-center justify-between">
                <span>Sub-Category</span>
                {selectedSubcategory !== 'all' && (
                  <button
                    onClick={() => {
                      setSelectedSubcategory('all');
                      setCurrentPage(1);
                    }}
                    className="text-[10px] text-[#A88440] hover:underline"
                  >
                    Reset
                  </button>
                )}
              </label>
              <select
                value={selectedSubcategory}
                onChange={e => {
                  setSelectedSubcategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#FAF8F5] border border-[#DCD7CD] rounded-lg px-3 py-2 text-xs outline-hidden focus:border-[#C5A059]"
              >
                <option value="all">All Sub-Categories ({publishedProducts.filter(p => p.category === currentCategory).length})</option>
                {availableSubcategories.map(sub => {
                  const cnt = publishedProducts.filter(p => p.category === currentCategory && p.subcategory === sub).length;
                  return (
                    <option key={sub} value={sub}>
                      {sub} ({cnt})
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </aside>

        {/* Products Grid & Sorting Header */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          {/* Controls Bar */}
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-[#E7E2DA] flex items-center justify-between gap-2 shadow-2xs">
            <div className="text-[11px] sm:text-xs text-stone-500">
              <span className="font-bold text-[#1C1917]">{paginatedProducts.length}</span> of{' '}
              <span className="font-bold text-[#1C1917]">{sortedProducts.length}</span>
              {selectedSubcategory !== 'all' && (
                <span className="text-[#C5A059] font-semibold ml-1.5">
                  • {selectedSubcategory}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Facebook Marketplace dense vs Spacious view toggle */}
              <div className="flex items-center bg-[#FAF8F5] border border-[#DCD7CD] rounded-lg p-0.5" role="group" aria-label="Layout View">
                <button
                  type="button"
                  onClick={() => setViewMode('marketplace')}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all ${
                    viewMode === 'marketplace'
                      ? 'bg-[#1C1917] text-white shadow-xs'
                      : 'text-stone-600 hover:text-black'
                  }`}
                  title="Facebook Marketplace 2-column mobile layout with big product pictures"
                >
                  <Grid2X2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Marketplace</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('spacious')}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all ${
                    viewMode === 'spacious'
                      ? 'bg-[#1C1917] text-white shadow-xs'
                      : 'text-stone-600 hover:text-black'
                  }`}
                  title="Spacious grid view"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Spacious</span>
                </button>
              </div>

              {/* Mobile filter toggle */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden flex items-center gap-1 text-[11px] sm:text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#DCD7CD] bg-[#FAF8F5]"
              >
                <Filter className="w-3 h-3 text-[#C5A059]" />
                <span>Filters</span>
              </button>

              {/* Sorting Dropdown */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-[#FAF8F5] border border-[#DCD7CD] rounded-lg px-2.5 py-1.5 text-[11px] sm:text-xs text-[#1C1917] outline-hidden focus:border-[#C5A059]"
              >
                <option value="newest">Newest</option>
                <option value="name">Name (A-Z)</option>
                <option value="price-asc">Price (Low-High)</option>
                <option value="price-desc">Price (High-Low)</option>
              </select>
            </div>
          </div>

          {/* Mobile Filter Sheet */}
          {mobileFilterOpen && (
            <div className="lg:hidden p-4 bg-white rounded-xl border border-[#E7E2DA] space-y-3 shadow-md animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h4 className="font-serif font-bold text-xs text-[#1C1917]">Refine Products</h4>
                <button onClick={() => setMobileFilterOpen(false)} className="text-stone-400 p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {currentCategory && availableSubcategories.length > 0 && (
                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-500 block mb-1">Sub-Category</label>
                  <select
                    value={selectedSubcategory}
                    onChange={e => {
                      setSelectedSubcategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full text-xs border border-[#DCD7CD] rounded-lg p-2"
                  >
                    <option value="all">All Sub-Categories</option>
                    {availableSubcategories.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-[10px] uppercase font-bold text-stone-500 block mb-1">Availability</label>
                <select
                  value={selectedStockStatus}
                  onChange={e => {
                    setSelectedStockStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full text-xs border border-[#DCD7CD] rounded-lg p-2"
                >
                  <option value="all">All Availability</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Made to Order">Made to Order</option>
                </select>
              </div>

              {availableSizes.length > 0 && (
                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-500 block mb-1">Size</label>
                  <select
                    value={selectedSizeFilter}
                    onChange={e => {
                      setSelectedSizeFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full text-xs border border-[#DCD7CD] rounded-lg p-2"
                  >
                    <option value="all">All Sizes</option>
                    {availableSizes.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-[#1C1917] text-white text-xs font-bold py-2 rounded-lg"
              >
                Apply Filters
              </button>
            </div>
          )}

          {/* Product Cards Grid: Either grouped by Subcategory ("sub cetagery ka nicha bhi show ho") or flat grid */}
          {subcategoryGroups ? (
            <div className="space-y-6">
              {subcategoryGroups.map(([subName, groupProds]) => (
                <div
                  key={subName}
                  className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-[#E7E2DA] shadow-2xs space-y-3.5"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#F4EFEA] flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                      <h3 className="font-serif font-bold text-sm sm:text-base text-[#1C1917]">
                        {subName}
                      </h3>
                      <span className="text-[10px] sm:text-[11px] font-semibold text-stone-600 bg-[#FAF8F5] border border-[#E7E2DA] px-2 py-0.5 rounded-full">
                        {groupProds.length} {groupProds.length === 1 ? 'product' : 'products'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedSubcategory(subName);
                        setCurrentPage(1);
                      }}
                      className="text-xs text-[#A88440] font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>View only {subName}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <VirtualProductGrid
                    products={groupProds}
                    onSelectProduct={onSelectProduct}
                    viewMode={viewMode}
                  />
                </div>
              ))}
            </div>
          ) : paginatedProducts.length > 0 ? (
            <VirtualProductGrid
              products={paginatedProducts}
              onSelectProduct={onSelectProduct}
              viewMode={viewMode}
            />
          ) : (
            <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-[#E7E2DA] space-y-3">
              <p className="font-serif text-lg font-bold text-[#1C1917]">No products matched</p>
              <button
                onClick={() => {
                  handleCategorySelect(null);
                  setSelectedStockStatus('all');
                  setSelectedSizeFilter('all');
                  setSelectedSubcategory('all');
                  onSearchChange('');
                }}
                className="bg-[#1C1917] text-white text-xs font-bold px-4 py-2 rounded-lg"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-4 flex items-center justify-between border-t border-[#E7E2DA]">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#DCD7CD] bg-white disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden xs:inline">Prev</span>
              </button>

              <span className="text-xs text-stone-600 font-medium">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#DCD7CD] bg-white disabled:opacity-40"
              >
                <span className="hidden xs:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
