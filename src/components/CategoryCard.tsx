import React, { useState } from 'react';
import { ProductCategory } from '../types';
import { getCategoryMeta, CategoryMeta } from '../data/constants';
import { ChevronRight, Sparkles } from 'lucide-react';

interface CategoryCardProps {
  category: ProductCategory;
  productCount?: number;
  onClick: (cat: ProductCategory) => void;
  featured?: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  productCount,
  onClick,
  featured = false
}) => {
  const meta: CategoryMeta = getCategoryMeta(category);
  const [imgSrc, setImgSrc] = useState<string>(meta.heroImage);
  const [hasError, setHasError] = useState<boolean>(false);

  const handleImageError = () => {
    if (!hasError && meta.fallbackImage && imgSrc !== meta.fallbackImage) {
      setImgSrc(meta.fallbackImage);
      setHasError(true);
    } else {
      // Safe high-resolution generic furniture placeholder
      setImgSrc('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop');
    }
  };

  return (
    <div
      onClick={() => onClick(category)}
      className={`group relative rounded-xl sm:rounded-2xl overflow-hidden bg-stone-900 border border-[#E7E2DA] cursor-pointer shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-end active:scale-98 select-none ${
        featured ? 'aspect-4/3 sm:aspect-16/10' : 'aspect-16/10 sm:aspect-4/3'
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(category);
        }
      }}
    >
      {/* Background Hero Image with graceful fallback */}
      <img
        src={imgSrc}
        alt={category}
        loading="lazy"
        onError={handleImageError}
        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 opacity-80 group-hover:opacity-90"
      />

      {/* Dynamic Gradient Overlay for high-contrast legible typography across all lighting conditions */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Top Badges */}
      <div className="absolute top-2 left-2 right-2 sm:top-2.5 sm:left-2.5 sm:right-2.5 flex items-center justify-between z-10">
        {meta.badge ? (
          <span className="bg-[#B89047] text-[#121110] text-[8px] sm:text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 sm:px-2 rounded-sm shadow-xs font-serif">
            {meta.badge}
          </span>
        ) : <span />}

        {productCount !== undefined && (
          <span className="bg-black/60 backdrop-blur-xs text-[#FAF8F5] text-[8px] sm:text-[10px] font-medium px-1.5 py-0.5 sm:px-2 rounded-sm border border-white/10">
            {productCount} {productCount === 1 ? 'item' : 'models'}
          </span>
        )}
      </div>

      {/* Content Section */}
      <div className="relative z-10 p-2.5 sm:p-4 text-white">
        <div className="flex items-center justify-between gap-1">
          <h3 className="font-serif text-xs sm:text-lg font-bold text-white group-hover:text-[#E5D4B3] transition-colors line-clamp-1">
            {category}
          </h3>
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#B89047] shrink-0 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all hidden xs:block" />
        </div>

        <p className="text-[10px] sm:text-[11px] text-stone-300 line-clamp-1 mt-0.5 hidden xs:block">
          {meta.description}
        </p>

        {/* Subcategories editorial text */}
        {meta.subcategories && meta.subcategories.length > 0 && (
          <p className="text-[9px] sm:text-[10px] text-[#E5D4B3]/90 truncate mt-1 font-medium">
            {meta.subcategories.slice(0, 3).join(' · ')}
          </p>
        )}
      </div>
    </div>
  );
};
