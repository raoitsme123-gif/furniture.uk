import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface VirtualProductGridProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  viewMode?: 'marketplace' | 'spacious';
  columns?: {
    mobile: number; // default 2 (Facebook Marketplace style)
    sm: number;     // default 2 or 3
    lg: number;     // default 3 or 4
  };
}

/**
 * Row component that uses IntersectionObserver to mount ProductCards
 * only when near the viewport, drastically reducing DOM nodes and memory for up to 1,000 products.
 */
interface VirtualRowProps {
  rowProducts: Product[];
  onSelectProduct: (p: Product) => void;
  viewMode: 'marketplace' | 'spacious';
  columnsCount: number;
  rowIndex: number;
}

const VirtualRow: React.FC<VirtualRowProps> = React.memo(({
  rowProducts,
  onSelectProduct,
  viewMode,
  columnsCount,
  rowIndex,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(() => rowIndex < 2);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    // Use IntersectionObserver with generous rootMargin (600px)
    // so cards render smoothly *before* they scroll into view
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          // Keep visible once loaded or unmount if memory is critical
          // Keeping recently visible gives 120Hz smooth scrolling without pop-in
        }
      },
      {
        rootMargin: '600px 0px 600px 0px',
        threshold: 0,
      }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, []);

  // Approximate heights for row placeholders based on viewMode
  // Marketplace mobile: ~230px, Spacious: ~380px
  const placeholderHeight = viewMode === 'marketplace' ? 'min-h-[230px] sm:min-h-[300px]' : 'min-h-[340px] sm:min-h-[420px]';

  return (
    <div
      ref={rowRef}
      className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 lg:gap-5 ${placeholderHeight}`}
      style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 260px' }}
    >
      {isVisible ? (
        rowProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onSelectProduct}
            viewMode={viewMode}
          />
        ))
      ) : (
        // Invisible lightweight placeholder retaining layout grid
        rowProducts.map((p) => (
          <div
            key={p.id}
            className="bg-stone-100/60 rounded-xl border border-stone-200/50 animate-pulse"
            aria-hidden="true"
          />
        ))
      )}
    </div>
  );
});

VirtualRow.displayName = 'VirtualRow';

export const VirtualProductGrid: React.FC<VirtualProductGridProps> = ({
  products,
  onSelectProduct,
  viewMode = 'marketplace'
}) => {
  // Determine column count based on viewport width
  const [columnCount, setColumnCount] = useState<number>(() => {
    if (typeof window === 'undefined') return 2;
    if (window.innerWidth >= 1280) return 4;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 2; // Facebook Marketplace 2-column on mobile
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1280) setColumnCount(4);
      else if (width >= 1024) setColumnCount(3);
      else if (width >= 640) return setColumnCount(2);
      else setColumnCount(2);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Partition products into rows of size columnCount
  const rows = useMemo(() => {
    const result: Product[][] = [];
    for (let i = 0; i < products.length; i += columnCount) {
      result.push(products.slice(i, i + columnCount));
    }
    return result;
  }, [products, columnCount]);

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 sm:space-y-4 lg:space-y-5 w-full">
      {rows.map((rowProducts, rowIndex) => (
        <VirtualRow
          key={rowProducts[0]?.id || rowIndex}
          rowProducts={rowProducts}
          onSelectProduct={onSelectProduct}
          viewMode={viewMode}
          columnsCount={columnCount}
          rowIndex={rowIndex}
        />
      ))}
    </div>
  );
};
