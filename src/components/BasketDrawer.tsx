import React from 'react';
import { CartItem } from '../types';
import {
  X,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  Truck,
  ShieldCheck,
  Wrench,
  Sparkles,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const BasketDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const hasWardrobe = items.some(item => item.category === 'Wardrobes' || item.category === 'Sliding Door Wardrobes');

  const generateBasketWhatsAppUrl = () => {
    const lines: string[] = [];
    lines.push(`Hello AMD Furniture UK, I would like to place an order from my website basket:\n`);

    items.forEach((item, idx) => {
      lines.push(`🛒 Item ${idx + 1}: ${item.name} (Qty: ${item.quantity})`);
      lines.push(`• Category: ${item.category}`);
      lines.push(`• SKU: ${item.sku}`);
      lines.push(`• Size: ${item.selectedSize}`);
      if (item.wardrobeMeasurements) {
        lines.push(`• Wardrobe Measurements: ${item.wardrobeMeasurements}`);
      }
      if (item.selectedColour) {
        lines.push(`• Colour: ${item.selectedColour.name}`);
      }
      if (item.mattressOption) {
        lines.push(`• Mattress: ${item.mattressOption}`);
      }
      if (item.drawersCount !== undefined && item.drawersCount > 0) {
        lines.push(`• Storage Drawers: ${item.drawersCount} Drawer(s) (+£${item.drawersPrice || item.drawersCount * 15})`);
      }
      if (item.ottomanBoxesCount !== undefined && item.ottomanBoxesCount > 0) {
        lines.push(`• Ottoman Storage Box: ${item.ottomanBoxesCount} Box(es) (+£${item.ottomanPrice || item.ottomanBoxesCount * 60})`);
      }
      if (item.hasGasLift) {
        lines.push(`• Gas Lift Mechanism: Included (+£100)`);
      }
      lines.push(`• Unit Price: £${item.price}`);
      lines.push(`• Line Total: £${item.price * item.quantity}`);
      if (item.image) {
        lines.push(`• Product Image: ${item.image.startsWith('http') ? item.image : `${window.location.origin}${item.image}`}`);
      }
      lines.push(``);
    });

    lines.push(`────────────────────────────`);
    lines.push(`💰 Total Order Price: £${subtotal}`);
    lines.push(`🚚 Free Home Delivery Across the UK: INCLUDED`);
    lines.push(`💵 Cash on Delivery – No Advance Payment Required`);
    if (hasWardrobe) {
      lines.push(`🛠️ FREE Wardrobe Assembly Included`);
    }
    lines.push(`\nPlease confirm stock and schedule our delivery date.`);

    return `https://wa.me/447576531552?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-b border-[#E7E2DA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1C1917] text-[#C5A059] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-[#1C1917]">Your Furniture Basket</h2>
              <span className="text-xs text-stone-500 font-medium">
                {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} selected
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-[#1C1917] hover:bg-stone-200/50 rounded-full transition-colors"
            aria-label="Close basket"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Perks Banner */}
        <div className="bg-[#FAF6EE] px-4 py-2.5 border-b border-[#EFE8DD] text-xs space-y-1">
          <div className="flex items-center gap-2 text-emerald-800 font-semibold">
            <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Free Home Delivery Across the UK</span>
          </div>
          <div className="flex items-center gap-2 text-[#785E2F] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
            <span>Cash on Delivery – No Advance Payment Required</span>
          </div>
          {hasWardrobe && (
            <div className="flex items-center gap-2 text-blue-800 font-semibold">
              <Wrench className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>FREE Wardrobe Assembly Included</span>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-[#F0ECE4]">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E7E2DA] flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#1C1917]">Your basket is empty</h3>
              <p className="text-xs text-stone-500 max-w-xs">
                Select your preferred size, colour, mattress and storage options on any product to add it to your order.
              </p>
              <button
                onClick={onClose}
                className="mt-2 bg-[#1C1917] text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-[#C5A059] hover:text-[#1C1917] transition-all"
              >
                Browse Furniture Collection
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-3">
                {/* Image */}
                <div className="w-20 h-20 bg-[#FAF8F5] rounded-lg border border-[#E7E2DA] overflow-hidden shrink-0 p-1 flex items-center justify-center">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400&auto=format&fit=crop'}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-serif font-bold text-xs text-[#1C1917] line-clamp-1">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-0.5"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-stone-500 space-y-0.5 mt-0.5">
                      <div className="flex items-center gap-1 font-medium text-stone-700">
                        <span>Size: {item.selectedSize}</span>
                      </div>

                      {item.wardrobeMeasurements && (
                        <div className="text-[10px] text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded inline-block font-mono">
                          {item.wardrobeMeasurements}
                        </div>
                      )}

                      {item.selectedColour && (
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-stone-300 inline-block"
                            style={{ backgroundColor: item.selectedColour.hex }}
                          />
                          <span>Colour: <strong className="text-stone-800">{item.selectedColour.name}</strong></span>
                        </div>
                      )}

                      {item.mattressOption && (
                        <div className="text-[10px] text-stone-600">
                          Mattress: <strong className="text-stone-800">{item.mattressOption}</strong>
                        </div>
                      )}

                      {item.drawersCount !== undefined && item.drawersCount > 0 && (
                        <div className="text-[10px] text-stone-600">
                          Drawers: <strong className="text-stone-800">{item.drawersCount} Drawer(s) (+£{item.drawersPrice || item.drawersCount * 15})</strong>
                        </div>
                      )}

                      {item.ottomanBoxesCount !== undefined && item.ottomanBoxesCount > 0 && (
                        <div className="text-[10px] text-stone-600">
                          Ottoman: <strong className="text-stone-800">{item.ottomanBoxesCount} Box(es) (+£{item.ottomanPrice || item.ottomanBoxesCount * 60})</strong>
                        </div>
                      )}

                      {item.hasGasLift && (
                        <div className="text-[10px] text-stone-600">
                          Mechanism: <strong className="text-stone-800">Gas Lift (+£100)</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity and Price row */}
                  <div className="flex items-center justify-between pt-2 mt-1">
                    <div className="flex items-center gap-2 bg-[#FAF8F5] border border-[#DCD7CD] rounded-md px-1.5 py-0.5">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="p-1 text-stone-600 hover:text-[#1C1917] active:scale-95"
                        title="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-[#1C1917] min-w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="p-1 text-stone-600 hover:text-[#1C1917] active:scale-95"
                        title="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-serif font-bold text-sm text-[#1C1917]">
                        £{item.price * item.quantity}
                      </span>
                      {item.quantity > 1 && (
                        <span className="block text-[10px] text-stone-400">
                          (£{item.price} each)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Summary and WhatsApp Action */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-[#FAF8F5] border-t border-[#E7E2DA] space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-800">£{subtotal}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-700">
                <span>UK Home Delivery</span>
                <span className="font-semibold uppercase tracking-wider text-[11px]">Free</span>
              </div>
              {hasWardrobe && (
                <div className="flex items-center justify-between text-blue-700">
                  <span>Wardrobe Assembly</span>
                  <span className="font-semibold uppercase tracking-wider text-[11px]">Free Included</span>
                </div>
              )}
              <div className="flex items-center justify-between text-stone-600">
                <span>Payment Method</span>
                <span className="font-bold text-[#1C1917]">Cash on Delivery</span>
              </div>
              <div className="pt-2 border-t border-[#E7E2DA] flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-[#1C1917]">Final Calculated Total</span>
                <span className="font-serif font-bold text-xl text-[#1C1917]">£{subtotal}</span>
              </div>
            </div>

            {/* Cash on Delivery Notice */}
            <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 leading-tight">
              <strong>Cash on Delivery:</strong> Pay only after your furniture arrives and you inspect it at your home.
            </div>

            {/* WhatsApp Checkout Button */}
            <a
              href={generateBasketWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[46px] py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
            >
              <MessageCircle className="w-4 h-4 fill-white shrink-0" />
              <span>Checkout Order on WhatsApp ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
            </a>

            <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
              <button
                onClick={onClearCart}
                className="text-stone-500 hover:text-rose-600 transition-colors underline"
              >
                Clear basket
              </button>
              <button
                onClick={onClose}
                className="text-stone-600 hover:text-[#1C1917] font-semibold"
              >
                Continue Shopping →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
