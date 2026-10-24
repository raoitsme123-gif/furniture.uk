import React, { memo, useState } from 'react';
import { Product } from '../types';
import { MessageCircle, ArrowRight, Sparkles, CheckCircle2, Truck } from 'lucide-react';
import { LUXURY_ASSETS } from '../data/constants';

interface Props {
  product: Product;
  onSelect: (product: Product) => void;
  viewMode?: 'marketplace' | 'spacious';
}

const ProductCardComponent: React.FC<Props> = ({
  product,
  onSelect,
  viewMode = 'marketplace'
}) => {
  const isBed = product.category === 'Beds';
  const isWardrobe = product.category === 'Wardrobes' || product.category === 'Sliding Door Wardrobes';
  const isDining = product.category === 'Dining Tables';
  const fallbackImage = isBed
    ? LUXURY_ASSETS.showcaseBed
    : isWardrobe
    ? LUXURY_ASSETS.showcaseWardrobe
    : isDining
    ? LUXURY_ASSETS.showcaseDining
    : LUXURY_ASSETS.heroShowroom;

  const [imageSrc, setImageSrc] = useState<string>(
    product.images && product.images.length > 0 ? product.images[0] : fallbackImage
  );

  const generateQuickWhatsAppLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    let msg = `Hello AMD Furniture UK, I am interested in: ${product.name} (SKU: ${product.sku}).`;
    if (isBed) {
      msg += ` Please provide the price and delivery availability for my postcode.`;
    } else if (product.price) {
      msg += ` Price: £${product.price}. Please confirm stock and delivery timeline.`;
    }
    return `https://wa.me/447576531552?text=${encodeURIComponent(msg)}`;
  };

  /* -------------------------------------------------------------
   * 1. FACEBOOK MARKETPLACE COMPACT DENSE MODE (DEFAULT)
   * Designed specifically so mobile screens display 4 to 6 products
   * with prominent high-definition photos at the same time.
   * ------------------------------------------------------------- */
  if (viewMode === 'marketplace') {
    return (
      <div
        onClick={() => onSelect(product)}
        className="group bg-white rounded-xl border border-[#E7E2DA] hover:border-[#C5A059] shadow-2xs hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden cursor-pointer active:scale-[0.98] select-none"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(product);
          }
        }}
      >
        {/* Facebook Marketplace-style Image Container: Dominant visual, aspect 1:1 or 4:3 */}
        <div className="relative aspect-square xs:aspect-4/3 bg-[#FAF8F5] overflow-hidden flex items-center justify-center p-1 sm:p-2">
          <img
            src={imageSrc}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={() => {
              if (imageSrc !== fallbackImage) setImageSrc(fallbackImage);
            }}
            className="w-full h-full object-contain object-center group-hover:scale-103 transition-transform duration-300 rounded"
          />

          {/* Micro badges on image */}
          <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 z-10 max-w-[80%] pointer-events-none">
            <span className="bg-[#1C1917]/85 backdrop-blur-xs text-[#FAF8F5] text-[8px] sm:text-[9px] font-semibold px-1.5 py-0.5 rounded tracking-wider uppercase truncate">
              {product.category}
            </span>
            {product.subcategory && (
              <span className="bg-white/95 backdrop-blur-xs text-[#57441B] font-semibold text-[7px] sm:text-[8px] px-1 py-0.5 rounded shadow-2xs border border-[#E7E2DA] truncate">
                {product.subcategory}
              </span>
            )}
          </div>

          {/* Quick Floating WhatsApp button on photo */}
          <a
            href={generateQuickWhatsAppLink({ stopPropagation: () => {} } as any)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-1.5 right-1.5 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white flex items-center justify-center shadow-md transition-transform hover:scale-110 active:scale-90"
            title="Instant WhatsApp Enquiry"
            aria-label="Enquire on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
          </a>

          {/* Multiple photos count */}
          {product.images && product.images.length > 1 && (
            <span className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[8px] px-1.5 py-0.5 rounded font-medium">
              {product.images.length} photos
            </span>
          )}
        </div>

        {/* Facebook Marketplace-style Content: Price FIRST in bold, then Title, then Location/Delivery */}
        <div className="p-2 sm:p-3 flex-1 flex flex-col justify-between">
          <div>
            {/* 1. BOLD PRICE FIRST (Exact Facebook Marketplace Pattern) */}
            <div className="flex items-baseline justify-between gap-1">
              <span className="font-serif font-bold text-sm sm:text-lg text-[#1C1917] tracking-tight leading-none">
                {isBed ? (
                  <span>From £{product.price || 199}</span>
                ) : product.price !== undefined && product.price !== null ? (
                  <span>£{product.price}</span>
                ) : (
                  <span className="text-xs text-stone-600 font-sans font-medium">Price on Enquiry</span>
                )}
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200 shrink-0">
                COD
              </span>
            </div>

            {/* 2. COMPACT TITLE (1-2 lines) */}
            <h3 className="text-[11px] sm:text-xs font-medium text-stone-800 line-clamp-2 mt-1 leading-snug group-hover:text-[#C5A059] transition-colors">
              {product.name}
            </h3>
          </div>

          {/* 3. SUBTITLE: Location / Free UK Delivery / In Stock */}
          <div className="pt-1.5 mt-1 border-t border-[#F5F2EB] flex items-center justify-between text-[9px] sm:text-[10px] text-stone-500">
            <span className="truncate flex items-center gap-1">
              <Truck className="w-3 h-3 text-[#C5A059] shrink-0" />
              <span>Free UK Delivery</span>
            </span>
            <span className="text-stone-400 font-mono shrink-0 hidden xs:inline">
              {product.sku}
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
   * 2. SPACIOUS / DETAILED MODE
   * Full descriptive card with swatches and direct option buttons.
   * ------------------------------------------------------------- */
  return (
    <div
      onClick={() => onSelect(product)}
      className="group bg-white rounded-xl sm:rounded-2xl border border-[#EBE6DD] hover:border-[#C5A059]/60 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer active:scale-[0.99]"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(product);
        }
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-4/3 bg-[#FAF8F5] overflow-hidden flex items-center justify-center p-2">
        <img
          src={imageSrc}
          alt={product.name}
          loading="lazy"
          decoding="async"
          onError={() => {
            if (imageSrc !== fallbackImage) setImageSrc(fallbackImage);
          }}
          className="w-full h-full object-contain object-center group-hover:scale-102 transition-transform duration-300 rounded"
        />

        {/* Category & Subcategory Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10 max-w-[70%]">
          <span className="bg-[#1C1917]/85 backdrop-blur-xs text-[#FAF8F5] text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 sm:px-2 rounded tracking-wider uppercase truncate">
            {product.category}
          </span>
          {product.subcategory && (
            <span className="bg-white/95 backdrop-blur-xs text-[#57441B] font-semibold text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded shadow-2xs border border-[#E7E2DA] truncate">
              {product.subcategory}
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-[#C5A059] text-[#1C1917] text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase flex items-center gap-0.5 shadow-2xs w-fit">
              <Sparkles className="w-2 h-2" />
              New
            </span>
          )}
        </div>

        {/* Stock Status Badge */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
          <span
            className={`text-[8px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded-full tracking-wide shadow-2xs ${
              product.stockStatus === 'In Stock'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : product.stockStatus === 'Low Stock'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-stone-100 text-stone-700 border border-stone-200'
            }`}
          >
            {product.stockStatus}
          </span>
        </div>

        {/* Multi-image indicator */}
        {product.images && product.images.length > 1 && (
          <div className="absolute bottom-1.5 right-2 sm:bottom-2.5 sm:right-3 bg-black/60 backdrop-blur-xs text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-medium">
            {product.images.length} photos
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[9px] sm:text-[10px] font-mono text-[#8C867A] uppercase tracking-wider block mb-0.5 sm:mb-1">
            SKU: {product.sku}
          </span>

          <h3 className="font-serif text-xs sm:text-base font-bold text-[#1C1917] group-hover:text-[#C5A059] transition-colors line-clamp-2 mb-1.5 sm:mb-2 leading-snug">
            {product.name}
          </h3>

          {/* Colour Swatches */}
          {product.colours && product.colours.length > 0 && (
            <div className="flex items-center gap-1 mb-2 flex-wrap">
              <div className="flex items-center gap-1">
                {product.colours.slice(0, 4).map((col, idx) => (
                  <span
                    key={idx}
                    title={col.name}
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-stone-300 shadow-2xs inline-block shrink-0"
                    style={{ backgroundColor: col.hex }}
                  />
                ))}
                {product.colours.length > 4 && (
                  <span className="text-[9px] sm:text-[10px] text-stone-500 font-semibold pl-0.5">
                    +{product.colours.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <p className="text-[10px] sm:text-[11px] text-stone-500 line-clamp-1 mb-2 hidden sm:block">
              Sizes: <span className="text-stone-700 font-medium">{product.sizes.join(', ')}</span>
            </p>
          )}
        </div>

        {/* Price & Action Area */}
        <div className="pt-2 sm:pt-3 border-t border-[#F0ECE4] mt-1 sm:mt-2">
          <div className="mb-2 sm:mb-3">
            {isBed ? (
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-stone-400 block font-medium">
                    Bed & Mattress From
                  </span>
                  <span className="text-base sm:text-2xl font-serif font-bold text-[#1C1917]">
                    £{product.price || 199}
                  </span>
                </div>
                <span className="text-[9px] sm:text-[11px] text-[#A88440] font-semibold hidden xs:flex items-center gap-0.5">
                  Select Options →
                </span>
              </div>
            ) : product.price !== undefined && product.price !== null ? (
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-stone-400 block font-medium">
                    UK Price
                  </span>
                  <span className="text-base sm:text-2xl font-serif font-bold text-[#1C1917]">
                    £{product.price}
                  </span>
                </div>
                <span className="text-[9px] sm:text-[11px] text-emerald-600 font-medium hidden xs:flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> 2-Day Delivery
                </span>
              </div>
            ) : (
              <div className="text-[11px] sm:text-xs font-semibold text-stone-600">
                Contact us for price.
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                onSelect(product);
              }}
              className="w-full min-h-[38px] sm:min-h-[42px] bg-[#FAF8F5] hover:bg-[#F2ECE1] text-[#1C1917] font-semibold text-[11px] sm:text-xs py-1.5 sm:py-2 px-2 rounded-lg border border-[#DCD7CD] transition-colors flex items-center justify-center gap-1 active:bg-[#EBE5DA]"
            >
              <span>Options</span>
              <ArrowRight className="w-3 h-3 text-[#C5A059]" />
            </button>

            <a
              href={`https://wa.me/447576531552?text=${encodeURIComponent(
                `Hello AMD Furniture UK, I am interested in: ${product.name} (SKU: ${product.sku}). ${
                  isBed
                    ? 'Please provide the price and delivery availability for my postcode.'
                    : `Price: £${product.price || 'N/A'}. Please confirm stock.`
                }`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="w-full min-h-[38px] sm:min-h-[42px] bg-[#25D366] hover:bg-[#20BD5A] active:bg-[#1E9E4B] text-white font-semibold text-[11px] sm:text-xs py-1.5 sm:py-2 px-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white shrink-0" />
              <span className="truncate">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Strict React.memo comparison ensures the component NEVER re-renders
 * during parent state updates, filter adjustments, or list scrolling
 * unless this specific product's data or the viewMode has changed.
 */
export const ProductCard = memo(ProductCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.viewMode === nextProps.viewMode &&
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.price === nextProps.product.price &&
    prevProps.product.stockStatus === nextProps.product.stockStatus &&
    prevProps.product.updatedAt === nextProps.product.updatedAt &&
    prevProps.product.images?.[0] === nextProps.product.images?.[0] &&
    prevProps.product.name === nextProps.product.name
  );
});

ProductCard.displayName = 'ProductCard';
