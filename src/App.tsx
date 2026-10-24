import React, { useState, useEffect } from 'react';
import { Product, ProductCategory, SiteSettings, ALL_CATEGORIES, CartItem } from './types';
import { api } from './services/api';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { BasketDrawer } from './components/BasketDrawer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomeView } from './views/HomeView';
import { CatalogView } from './views/CatalogView';
import { DeliveryView } from './views/DeliveryView';
import { AboutView, ContactView, ReturnsView, PrivacyView, TermsView } from './views/InfoViews';
import { AdminView } from './views/AdminView';
import { getCategoryMeta } from './data/constants';
import { X, ChevronRight, ArrowLeft } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Cart / Basket state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('amd_furniture_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isBasketOpen, setIsBasketOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('amd_furniture_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Could not save cart to storage', e);
    }
  }, [cartItems]);

  const handleAddToCart = (item: CartItem) => {
    setCartItems(prev => {
      // Check if identical item (same product, size, colour, mattress, drawers) exists
      const existingIdx = prev.findIndex(
        i =>
          i.productId === item.productId &&
          i.selectedSize === item.selectedSize &&
          i.selectedColour?.name === item.selectedColour?.name &&
          i.mattressOption === item.mattressOption &&
          i.drawersCount === item.drawersCount &&
          i.ottomanBoxesCount === item.ottomanBoxesCount &&
          i.hasGasLift === item.hasGasLift
      );
      if (existingIdx !== -1) {
        const next = [...prev];
        next[existingIdx].quantity += item.quantity;
        return next;
      }
      return [...prev, item];
    });
    setIsBasketOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCartItems(prev =>
      prev
        .map(i => {
          if (i.id === id) {
            const nextQty = i.quantity + delta;
            return nextQty > 0 ? { ...i, quantity: nextQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Navigation state & history for back button
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageHistory, setPageHistory] = useState<string[]>(['home']);
  const [currentCategory, setCurrentCategory] = useState<ProductCategory | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Mobile category bottom sheet
  const [mobileCategorySheetOpen, setMobileCategorySheetOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodData = await api.getProducts();
        setProducts(prodData.products || []);
      } catch (err) {
        console.error('Failed to load products:', err);
      }

      try {
        const setData = await api.getSettings();
        setSettings(setData.settings);
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNavigatePage = (page: string) => {
    setPageHistory(prev => [...prev, page]);
    setCurrentPage(page);
    setMobileCategorySheetOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (cat: ProductCategory | null) => {
    setPageHistory(prev => [...prev, 'catalog']);
    setCurrentCategory(cat);
    setCurrentPage('catalog');
    setMobileCategorySheetOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = () => {
    setPageHistory(prev => [...prev, 'catalog']);
    setCurrentPage('catalog');
    setMobileCategorySheetOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoBack = () => {
    if (selectedProduct) {
      setSelectedProduct(null);
      return;
    }
    if (pageHistory.length > 1) {
      const nextHistory = [...pageHistory];
      nextHistory.pop(); // remove current page
      const prevPage = nextHistory[nextHistory.length - 1] || 'home';
      setPageHistory(nextHistory);
      setCurrentPage(prevPage);
    } else {
      setCurrentPage('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const canGoBack = currentPage !== 'home' || !!selectedProduct;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1917] selection:bg-[#C5A059] selection:text-white overflow-x-hidden">
      {/* 1. Continuously Moving Announcement Bar */}
      <AnnouncementBar settings={settings} />

      {/* 2. Main Header with Back Arrow support, Basket and Menu Admin link */}
      <Header
        currentCategory={currentCategory}
        onSelectCategory={handleSelectCategory}
        onNavigatePage={handleNavigatePage}
        currentPage={currentPage}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        canGoBack={canGoBack}
        onGoBack={handleGoBack}
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenBasket={() => setIsBasketOpen(true)}
      />

      {/* 3. Global Sub-Header Breadcrumb / Back Bar (When not on Home page) */}
      {currentPage !== 'home' && (
        <div className="bg-[#F5F1E9] border-b border-[#E7E2DA] px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-1.5 text-xs font-bold text-[#1C1917] hover:text-[#C5A059] transition-colors py-1 px-2.5 rounded-lg bg-white border border-[#DCD7CD] shadow-2xs active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>← Back</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
              <button
                onClick={() => handleNavigatePage('home')}
                className="hover:text-[#1C1917] transition-colors"
              >
                Home
              </button>
              <span>/</span>
              <span className="text-[#1C1917] capitalize font-semibold">
                {currentPage === 'catalog'
                  ? currentCategory || 'All Products'
                  : currentPage}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Main Views */}
      <main className="flex-1 pb-16 md:pb-0">
        {currentPage === 'home' && (
          <HomeView
            products={products}
            onSelectProduct={setSelectedProduct}
            onSelectCategory={handleSelectCategory}
            onNavigatePage={handleNavigatePage}
          />
        )}

        {currentPage === 'catalog' && (
          <CatalogView
            products={products}
            currentCategory={currentCategory}
            onSelectCategory={setCurrentCategory}
            onSelectProduct={setSelectedProduct}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onGoBack={handleGoBack}
          />
        )}

        {currentPage === 'delivery' && <DeliveryView onGoBack={handleGoBack} />}
        {currentPage === 'about' && <AboutView onGoBack={handleGoBack} />}
        {currentPage === 'contact' && <ContactView onGoBack={handleGoBack} />}
        {currentPage === 'returns' && <ReturnsView onGoBack={handleGoBack} />}
        {currentPage === 'privacy' && <PrivacyView onGoBack={handleGoBack} />}
        {currentPage === 'terms' && <TermsView onGoBack={handleGoBack} />}
        {currentPage === 'admin' && <AdminView onGoBack={handleGoBack} />}
      </main>

      {/* 5. Footer */}
      <Footer onSelectCategory={handleSelectCategory} onNavigatePage={handleNavigatePage} />

      {/* 6. Mobile Bottom Navigation Bar (Visible only on phone screens) */}
      {currentPage !== 'admin' && (
        <MobileBottomNav
          currentPage={currentPage}
          onNavigatePage={handleNavigatePage}
          onOpenCategories={() => setMobileCategorySheetOpen(true)}
          canGoBack={canGoBack}
          onGoBack={handleGoBack}
        />
      )}

      {/* 7. Mobile Category Sheet */}
      {mobileCategorySheetOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white rounded-t-2xl max-h-[80vh] flex flex-col p-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="font-serif font-bold text-base text-[#1C1917]">
                All 12 Furniture Categories
              </span>
              <button
                onClick={() => setMobileCategorySheetOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto divide-y divide-stone-100 py-2">
              <button
                onClick={() => handleSelectCategory(null)}
                className="w-full py-3 px-2 text-left text-xs font-bold text-[#C5A059] flex items-center justify-between"
              >
                <span>View Full Catalogue (All Products)</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {ALL_CATEGORIES.map(cat => {
                const meta = getCategoryMeta(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => handleSelectCategory(cat)}
                    className={`w-full py-2.5 px-2 text-left text-xs font-medium flex items-center justify-between rounded-lg transition-colors ${
                      currentCategory === cat ? 'text-[#C5A059] font-bold bg-[#FAF8F5]' : 'text-stone-800 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={meta.heroImage}
                        alt=""
                        className="w-8 h-8 rounded-md object-cover border border-[#E7E2DA] shrink-0"
                      />
                      <span className="truncate">{cat}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 8. Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onOpenBasket={() => setIsBasketOpen(true)}
        />
      )}

      {/* 9. Interactive Shopping Basket Drawer */}
      <BasketDrawer
        isOpen={isBasketOpen}
        onClose={() => setIsBasketOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
