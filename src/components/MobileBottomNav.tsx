import React from 'react';
import { Home, Grid, Truck, MessageCircle, ArrowLeft } from 'lucide-react';

interface Props {
  currentPage: string;
  onNavigatePage: (page: string) => void;
  onOpenCategories: () => void;
  canGoBack?: boolean;
  onGoBack?: () => void;
}

export const MobileBottomNav: React.FC<Props> = ({
  currentPage,
  onNavigatePage,
  onOpenCategories,
  canGoBack,
  onGoBack
}) => {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E7E2DA] shadow-lg px-2 py-1.5 flex items-center justify-around safe-area-bottom">
      {/* 1. Universal Back button on mobile */}
      {canGoBack && onGoBack && (
        <button
          onClick={onGoBack}
          className="flex flex-col items-center justify-center p-1 min-w-[52px] rounded-lg text-[#C5A059] active:scale-95 transition-all"
          title="Go Back One Step"
        >
          <div className="w-6 h-6 rounded-full bg-[#FAF8F5] border border-[#DCD7CD] flex items-center justify-center shadow-2xs">
            <ArrowLeft className="w-3.5 h-3.5 text-[#C5A059]" />
          </div>
          <span className="text-[10px] font-bold text-[#1C1917] mt-0.5">Back</span>
        </button>
      )}

      {/* 2. Home */}
      <button
        onClick={() => onNavigatePage('home')}
        className={`flex flex-col items-center justify-center p-1 min-w-[52px] rounded-lg transition-colors ${
          currentPage === 'home' ? 'text-[#C5A059]' : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Home</span>
      </button>

      {/* 3. 12 Categories */}
      <button
        onClick={onOpenCategories}
        className={`flex flex-col items-center justify-center p-1 min-w-[52px] rounded-lg transition-colors ${
          currentPage === 'catalog' ? 'text-[#C5A059]' : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <Grid className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Categories</span>
      </button>

      {/* 4. UK Delivery */}
      <button
        onClick={() => onNavigatePage('delivery')}
        className={`flex flex-col items-center justify-center p-1 min-w-[52px] rounded-lg transition-colors ${
          currentPage === 'delivery' ? 'text-[#C5A059]' : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <Truck className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Delivery</span>
      </button>

      {/* 5. WhatsApp Direct Quick Tap */}
      <a
        href="https://wa.me/447576531552?text=Hello%20AMD%20Furniture%20UK,%20I%20would%20like%20to%20enquire%20about%20your%20furniture%20collection."
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center p-1 min-w-[54px] text-emerald-600 active:scale-95 transition-transform"
      >
        <div className="w-6 h-6 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-xs">
          <MessageCircle className="w-3.5 h-3.5 fill-white" />
        </div>
        <span className="text-[10px] font-bold text-emerald-700 mt-0.5">WhatsApp</span>
      </a>
    </div>
  );
};
