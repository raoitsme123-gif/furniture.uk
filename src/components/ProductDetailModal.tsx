import React, { useState, useMemo } from 'react';
import {
  Product,
  FabricGroup,
  ColourOption,
  CartItem
} from '../types';
import {
  BED_FABRICS,
  DEFAULT_BED_SIZES,
  WARDROBE_SIZES_SPECS,
  STANDARD_WARDROBE_COLOURS,
  BED_SIZE_BASE_PRICES,
  BED_MATTRESS_OPTIONS,
  LUXURY_ASSETS
} from '../data/constants';
import {
  X,
  MessageCircle,
  Truck,
  ShieldCheck,
  Calendar,
  Maximize2,
  Check,
  Info,
  MapPin,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Wrench,
  ShoppingBag,
  Share2,
  Copy,
  Layers,
  Box,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { ImageLightbox } from './ImageLightbox';
import { api } from '../services/api';

interface Props {
  product: Product;
  onClose: () => void;
  onAddToCart?: (item: CartItem) => void;
  onOpenBasket?: () => void;
}

export const ProductDetailModal: React.FC<Props> = ({
  product,
  onClose,
  onAddToCart,
  onOpenBasket
}) => {
  const isWardrobe = product.category === 'Wardrobes' || product.category === 'Sliding Door Wardrobes';
  const isBed = product.category === 'Beds';

  const isDining = product.category === 'Dining Tables';
  const defaultFallbackImage = isBed
    ? LUXURY_ASSETS.showcaseBed
    : isWardrobe
    ? LUXURY_ASSETS.showcaseWardrobe
    : isDining
    ? LUXURY_ASSETS.showcaseDining
    : LUXURY_ASSETS.heroShowroom;

  // Images state
  const images = product.images && product.images.length > 0
    ? product.images
    : [defaultFallbackImage];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imageToastMessage, setImageToastMessage] = useState<string | null>(null);
  const [isSharingImage, setIsSharingImage] = useState(false);
  const [addedToCartToast, setAddedToCartToast] = useState(false);

  // ──────────────────────────────────────────────────────────────────────────
  // 1. WARDROBE CONFIGURATION
  // ──────────────────────────────────────────────────────────────────────────
  const wardrobeSizes = WARDROBE_SIZES_SPECS;
  const [selectedWardrobeSize, setSelectedWardrobeSize] = useState<string>(
    wardrobeSizes[2]?.size || '4 Door Wardrobe'
  );

  const selectedWardrobeSpec = useMemo(() => {
    return wardrobeSizes.find(s => s.size === selectedWardrobeSize) || wardrobeSizes[2];
  }, [wardrobeSizes, selectedWardrobeSize]);

  const wardrobeColours: ColourOption[] = STANDARD_WARDROBE_COLOURS;
  const [selectedWardrobeColour, setSelectedWardrobeColour] = useState<ColourOption>(
    wardrobeColours[0] // Walnut default
  );

  // ──────────────────────────────────────────────────────────────────────────
  // 2. BED CONFIGURATION
  // ──────────────────────────────────────────────────────────────────────────
  const availableFabrics: FabricGroup[] =
    product.fabricGroups && product.fabricGroups.length > 0
      ? product.fabricGroups
      : ['Steel', 'Chenille', 'Crushed Velvet', 'Naples'];

  const [selectedFabric, setSelectedFabric] = useState<FabricGroup>(availableFabrics[0] || 'Steel');

  const bedColours = useMemo(() => {
    const fabricData = BED_FABRICS[selectedFabric];
    return fabricData ? fabricData.colours : [];
  }, [selectedFabric]);

  const [selectedBedColour, setSelectedBedColour] = useState<ColourOption | null>(
    bedColours[0] || null
  );

  const handleFabricChange = (fabric: FabricGroup) => {
    setSelectedFabric(fabric);
    const fabricData = BED_FABRICS[fabric];
    if (fabricData && fabricData.colours.length > 0) {
      setSelectedBedColour(fabricData.colours[0]);
    }
  };

  const bedSizes = ['Single', 'Double', 'King', 'Super King'];
  const [selectedBedSize, setSelectedBedSize] = useState<string>('Super King');

  // Mattress selection
  const [selectedMattressId, setSelectedMattressId] = useState<string>('standard-spring');
  const selectedMattress = useMemo(() => {
    return BED_MATTRESS_OPTIONS.find(m => m.id === selectedMattressId) || BED_MATTRESS_OPTIONS[0];
  }, [selectedMattressId]);

  // Storage Drawers (Customer chooses 0, 1, 2, 3, or 4 drawers @ £15/drawer)
  const [drawerCount, setDrawerCount] = useState<number>(0);

  // Ottoman Storage Box (Customer chooses 0, 1, 2 boxes @ £60/box)
  const [ottomanCount, setOttomanCount] = useState<number>(0);

  // Gas Lift Mechanism (+£100)
  const [hasGasLift, setHasGasLift] = useState<boolean>(false);

  // ──────────────────────────────────────────────────────────────────────────
  // 3. GENERIC PRODUCT OPTIONS (Sofas, Dining, etc.)
  // ──────────────────────────────────────────────────────────────────────────
  const genericSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['Standard'];
  const [selectedGenericSize, setSelectedGenericSize] = useState<string>(genericSizes[0] || 'Standard');

  const genericColours: ColourOption[] =
    product.colours && product.colours.length > 0
      ? product.colours
      : [{ name: 'Standard Finish', hex: '#808080' }];
  const [selectedGenericColour, setSelectedGenericColour] = useState<ColourOption>(genericColours[0]);

  // ──────────────────────────────────────────────────────────────────────────
  // 4. REAL-TIME PRICE CALCULATION
  // ──────────────────────────────────────────────────────────────────────────
  const calculatedPrice = useMemo(() => {
    if (isWardrobe) {
      return selectedWardrobeSpec.basePrice;
    }

    if (isBed) {
      const baseObj = BED_SIZE_BASE_PRICES[selectedBedSize] || {
        frameOnly: 199,
        withStandardMattress: 249
      };

      // Base bundle price includes standard spring mattress
      let total = baseObj.withStandardMattress;

      // Add or deduct mattress option
      total += selectedMattress.extraPrice;

      // Add storage drawers: £15 per drawer
      total += drawerCount * 15;

      // Add Ottoman storage boxes: £60 per box
      total += ottomanCount * 60;

      // Add Gas Lift: £100 extra
      if (hasGasLift) {
        total += 100;
      }

      return total;
    }

    return product.price || 199;
  }, [
    isWardrobe,
    selectedWardrobeSpec,
    isBed,
    selectedBedSize,
    selectedMattress,
    drawerCount,
    ottomanCount,
    hasGasLift,
    product.price
  ]);

  // Active colour selection depending on category
  const activeColour: ColourOption = isWardrobe
    ? selectedWardrobeColour
    : isBed
    ? selectedBedColour || { name: 'Standard', hex: '#808080' }
    : selectedGenericColour;

  // Active size string
  const activeSizeStr = isWardrobe
    ? selectedWardrobeSize
    : isBed
    ? selectedBedSize
    : selectedGenericSize;

  // ──────────────────────────────────────────────────────────────────────────
  // 5. POSTCODE CHECKER
  // ──────────────────────────────────────────────────────────────────────────
  const [postcode, setPostcode] = useState('');
  const [postcodeResult, setPostcodeResult] = useState<any | null>(null);
  const [postcodeError, setPostcodeError] = useState('');
  const [isCheckingPostcode, setIsCheckingPostcode] = useState(false);

  // Advance Delivery Booking state
  const [preferredDate, setPreferredDate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bookingSuccessMessage, setBookingSuccessMessage] = useState('');

  const validatePostcode = async () => {
    if (!postcode.trim()) {
      setPostcodeError('Please enter your UK postcode.');
      return;
    }
    const clean = postcode.trim().toUpperCase();
    const ukPostcodePattern = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;
    if (!ukPostcodePattern.test(clean)) {
      setPostcodeError('Please enter a valid UK postcode (e.g. WF1 2AA, S1 1AA, M1 1AA, B1 1AA).');
      return;
    }

    setPostcodeError('');
    setIsCheckingPostcode(true);
    try {
      const res = await api.checkPostcode(clean);
      setPostcodeResult(res);
    } catch {
      setPostcodeError('Unable to check delivery zone at this moment.');
    } finally {
      setIsCheckingPostcode(false);
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // 6. WHATSAPP ENQUIRY TEXT GENERATION WITH EXACT SPECS & IMAGES
  // ──────────────────────────────────────────────────────────────────────────
  const currentImageUrl = images[activeImageIndex] || images[0];
  const fullAbsoluteImageUrl = currentImageUrl.startsWith('http')
    ? currentImageUrl
    : `${window.location.origin}${currentImageUrl}`;

  const currentProductUrl = `${window.location.origin}/?product=${product.id}`;

  const buildWhatsAppMessage = () => {
    const lines: string[] = [];
    lines.push(`Hello AMD Furniture UK, I would like to order / enquire about:`);
    lines.push(``);
    lines.push(`• Product: ${isBed ? 'Brand New Bed with Foam Mattress – Luxurious Super King, Optional Drawers – Free Home Delivery' : product.name}`);
    lines.push(`• SKU: ${product.sku}`);
    lines.push(`• Product Image: ${fullAbsoluteImageUrl}`);
    lines.push(`• Selected Size: ${activeSizeStr}`);

    if (isWardrobe) {
      lines.push(`• Exact Measurements: ${selectedWardrobeSpec.dimensions}`);
      lines.push(`• Selected Colour: ${selectedWardrobeColour.name}`);
      lines.push(`• FREE Wardrobe Assembly Included: YES`);
    } else if (isBed) {
      lines.push(`• Selected Fabric: ${selectedFabric}`);
      lines.push(`• Selected Colour: ${selectedBedColour?.name || 'Standard'}`);
      lines.push(`• Mattress Option: ${selectedMattress.name} (${selectedMattress.description})`);
      lines.push(`• Storage Drawers: ${drawerCount > 0 ? `${drawerCount} Drawer(s) (+£${drawerCount * 15})` : 'No Drawers'}`);
      lines.push(`• Ottoman Storage Box: ${ottomanCount > 0 ? `${ottomanCount} Box(es) (+£${ottomanCount * 60})` : 'None'}`);
      lines.push(`• Gas Lift Mechanism: ${hasGasLift ? 'Included (+£100)' : 'None'}`);
    } else {
      lines.push(`• Selected Colour: ${activeColour.name}`);
    }

    lines.push(`• Final Calculated Price: £${calculatedPrice}`);
    lines.push(`• Free Home Delivery: INCLUDED Across UK`);
    lines.push(`• Payment: Cash on Delivery – No Advance Payment Required`);

    if (postcode.trim()) {
      lines.push(`• Customer Postcode: ${postcode.trim().toUpperCase()}`);
    }
    if (preferredDate) {
      lines.push(`• Preferred Delivery Date: ${preferredDate}`);
    }

    lines.push(`• Product Link: ${currentProductUrl}`);
    lines.push(``);
    lines.push(`Please confirm delivery availability and finalize this order.`);

    return lines.join('\n');
  };

  const generateWhatsAppUrl = () => {
    const msg = buildWhatsAppMessage();
    return `https://wa.me/447576531552?text=${encodeURIComponent(msg)}`;
  };

  // ──────────────────────────────────────────────────────────────────────────
  // 7. PRODUCT IMAGE SHARING ON WHATSAPP IMPLEMENTATION
  // ──────────────────────────────────────────────────────────────────────────
  const handleShareWithImage = async () => {
    setIsSharingImage(true);
    const messageText = buildWhatsAppMessage();

    try {
      // 1. Fetch image as blob
      const response = await fetch(fullAbsoluteImageUrl, { mode: 'cors' });
      const blob = await response.blob();
      const ext = blob.type.includes('png') ? 'png' : 'jpg';
      const file = new File([blob], `amd-furniture-${product.sku}.${ext}`, { type: blob.type || 'image/jpeg' });

      // 2. Check if native Web Share API with files is supported
      if (
        typeof navigator !== 'undefined' &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: product.name,
          text: messageText,
          files: [file]
        });
        setIsSharingImage(false);
        return;
      }

      // 3. Desktop / Clipboard fallback: copy image to clipboard and open WhatsApp
      if (typeof navigator !== 'undefined' && navigator.clipboard && window.ClipboardItem) {
        try {
          // Convert to png for clipboard if needed
          const clipboardItem = new ClipboardItem({ [blob.type]: blob });
          await navigator.clipboard.write([clipboardItem]);
          setImageToastMessage('📸 Product image copied to clipboard! Opening WhatsApp... Just press Ctrl+V (or Paste) in the chat to attach.');
        } catch {
          // If image clipboard fails, copy message text
          await navigator.clipboard.writeText(messageText);
          setImageToastMessage('📋 Order enquiry copied! Opening WhatsApp chat...');
        }
      }
    } catch (err) {
      console.warn('Image share fallback:', err);
      setImageToastMessage('Opening WhatsApp with order enquiry and image preview link...');
    } finally {
      setIsSharingImage(false);
      setTimeout(() => {
        window.open(generateWhatsAppUrl(), '_blank');
      }, 700);
      setTimeout(() => {
        setImageToastMessage(null);
      }, 5000);
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // 8. ADD TO BASKET HANDLER
  // ──────────────────────────────────────────────────────────────────────────
  const handleAddToCartClick = () => {
    const cartItem: CartItem = {
      id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      productId: product.id,
      name: isBed ? 'Brand New Bed with Foam Mattress – Luxurious Super King, Optional Drawers – Free Home Delivery' : product.name,
      sku: product.sku,
      category: product.category,
      image: fullAbsoluteImageUrl,
      price: calculatedPrice,
      quantity: 1,
      selectedSize: activeSizeStr,
      selectedColour: activeColour,
      dimensions: isWardrobe ? selectedWardrobeSpec.dimensions : product.dimensions,
      wardrobeMeasurements: isWardrobe ? selectedWardrobeSpec.dimensions : undefined,
      mattressOption: isBed ? selectedMattress.name : undefined,
      drawersCount: isBed ? drawerCount : undefined,
      drawersPrice: isBed ? drawerCount * 15 : undefined,
      ottomanBoxesCount: isBed ? ottomanCount : undefined,
      ottomanPrice: isBed ? ottomanCount * 60 : undefined,
      hasGasLift: isBed ? hasGasLift : undefined,
      gasLiftPrice: isBed && hasGasLift ? 100 : undefined
    };

    if (onAddToCart) {
      onAddToCart(cartItem);
    }
    setAddedToCartToast(true);
    setTimeout(() => setAddedToCartToast(false), 3500);
  };

  // Min date for picker: tomorrow
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
        <div className="bg-white w-full sm:max-w-5xl h-full sm:h-auto sm:max-h-[92vh] sm:rounded-2xl shadow-2xl border-0 sm:border border-[#E7E2DA] overflow-hidden flex flex-col">
          {/* Header with Back Button */}
          <div className="px-4 sm:px-6 py-3 bg-[#FAF8F5] border-b border-[#EFEBE4] flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-2.5">
              <button
                onClick={onClose}
                className="flex items-center gap-1 text-xs font-bold text-[#1C1917] hover:text-[#C5A059] bg-white border border-[#DCD7CD] px-2.5 py-1 rounded-lg transition-colors active:scale-95 shadow-2xs"
                title="Go Back"
              >
                <ArrowLeft className="w-4 h-4 text-[#C5A059]" />
                <span>Back</span>
              </button>
              <span className="bg-[#1C1917] text-[#FAF8F5] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                {product.category}
              </span>
              <span className="font-mono text-xs text-stone-500">SKU: {product.sku}</span>
            </div>

            <div className="flex items-center gap-2">
              {onOpenBasket && (
                <button
                  onClick={onOpenBasket}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#1C1917] bg-[#F5F2EB] hover:bg-[#EBE5DA] px-3 py-1.5 rounded-lg border border-[#DCD7CD] transition-all"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Basket</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-stone-500 hover:text-[#1C1917] hover:bg-stone-200/60 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {imageToastMessage && (
            <div className="bg-[#1C1917] text-white text-xs px-4 py-2.5 flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>{imageToastMessage}</span>
              </div>
              <button onClick={() => setImageToastMessage(null)} className="text-stone-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Added to cart toast */}
          {addedToCartToast && (
            <div className="bg-emerald-700 text-white text-xs px-4 py-2.5 flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Added to basket with all selected options! Ready for checkout.</span>
              </div>
              {onOpenBasket && (
                <button
                  onClick={onOpenBasket}
                  className="underline font-bold text-xs hover:text-emerald-100"
                >
                  View Basket →
                </button>
              )}
            </div>
          )}

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 pb-36 sm:pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              {/* Left Column: Image Gallery (Up to 3 images) */}
              <div className="lg:col-span-5 flex flex-col gap-3 sm:gap-4">
                {/* Main Image */}
                <div
                  onClick={() => setIsLightboxOpen(true)}
                  className="relative group bg-[#FAF8F5] rounded-xl sm:rounded-2xl border border-[#EBE6DD] overflow-hidden aspect-4/3 flex items-center justify-center cursor-zoom-in shadow-xs p-2 active:opacity-95"
                >
                  <img
                    src={images[activeImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-102"
                  />

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setActiveImageIndex((activeImageIndex - 1 + images.length) % images.length);
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setActiveImageIndex((activeImageIndex + 1) % images.length);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5 opacity-90 shadow-md">
                    <Maximize2 className="w-3 h-3 text-[#C5A059]" />
                    <span>Tap to view full image</span>
                  </div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex items-center gap-2">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all p-0.5 bg-[#FAF8F5] ${
                          idx === activeImageIndex
                            ? 'border-[#C5A059] ring-2 ring-[#C5A059]/30 shadow-sm'
                            : 'border-[#E5E0D8] opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover rounded" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Guarantees Box */}
                <div className="bg-[#FAF8F5] border border-[#EFEBE4] rounded-xl p-3.5 space-y-2.5 text-xs text-[#44403C]">
                  <div className="flex items-start gap-2.5">
                    <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#1C1917] block">Free Home Delivery Across the UK</span>
                      <span className="text-[11px] text-stone-500">Everyday 7-day delivery routes across Yorkshire, Midlands, Manchester & UK.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#1C1917] block">Cash on Delivery – No Advance Payment Required</span>
                      <span className="text-[11px] text-stone-500">Inspect your furniture at delivery and pay only when satisfied.</span>
                    </div>
                  </div>

                  {isWardrobe && (
                    <div className="flex items-start gap-2.5">
                      <Wrench className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#1C1917] block">FREE Wardrobe Assembly Included</span>
                        <span className="text-[11px] text-stone-500">Professional room-of-choice assembly included at zero extra cost.</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#1C1917] block">Driver Calls 1 Hour Before Arrival</span>
                      <span className="text-[11px] text-stone-500">Accurate delivery time slot confirmed on morning of arrival.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Customizer & Options */}
              <div className="lg:col-span-7 flex flex-col space-y-5">
                {/* Category & Subcategory Breadcrumbs */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#A88440] bg-[#FAF6EE] px-2 py-0.5 rounded border border-[#EBE3D3]">
                    {product.category}
                  </span>
                  {product.subcategory && (
                    <span className="text-[10px] font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                      {product.subcategory}
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-stone-400">
                    SKU: {product.sku}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#1C1917] tracking-tight leading-snug">
                    {isBed
                      ? 'Brand New Bed with Foam Mattress – Luxurious Super King, Optional Drawers – Free Home Delivery'
                      : isWardrobe
                      ? 'Brand New Wardrobes – Available in Multiple Sizes and Colours'
                      : product.name}
                  </h1>
                </div>

                {/* DYNAMIC LIVE PRICE CARD */}
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA] flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block mb-0.5">
                      Final Calculated Price
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917]">
                        £{calculatedPrice}
                      </span>
                      <span className="text-xs text-emerald-700 font-semibold">
                        Free UK Delivery
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-1 rounded">
                      Cash on Delivery
                    </span>
                    {isWardrobe && (
                      <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold px-2 py-1 rounded">
                        Free Assembly Included
                      </span>
                    )}
                  </div>
                </div>

                {/* ──────────────────────────────────────────────────────── */}
                {/* WARDROBE SECTION: DYNAMIC SIZES, MEASUREMENTS & COLOURS */}
                {/* ──────────────────────────────────────────────────────── */}
                {isWardrobe && (
                  <div className="space-y-4">
                    {/* Wardrobe Door Size Selection */}
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1C1917] block mb-1.5">
                        Select Wardrobe Size: <span className="text-[#C5A059] font-serif normal-case text-sm font-bold">{selectedWardrobeSize}</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {wardrobeSizes.map(ws => (
                          <button
                            key={ws.size}
                            type="button"
                            onClick={() => setSelectedWardrobeSize(ws.size)}
                            className={`min-h-[46px] p-2.5 rounded-lg border text-left transition-all active:scale-95 flex flex-col justify-between ${
                              selectedWardrobeSize === ws.size
                                ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-sm ring-2 ring-[#C5A059]/40'
                                : 'bg-white text-stone-800 border-[#DCD7CD] hover:border-[#C5A059]'
                            }`}
                          >
                            <span className="text-xs font-bold block">{ws.size}</span>
                            <span className={`text-[10px] block ${selectedWardrobeSize === ws.size ? 'text-[#C5A059]' : 'text-stone-500'}`}>
                              £{ws.basePrice}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Exact Measurements Display */}
                    <div className="bg-[#F5F2EB] border border-[#E0D9CC] rounded-xl p-3.5 space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#785E2F] flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-[#C5A059]" />
                        Exact Measurements for {selectedWardrobeSpec.size}:
                      </div>
                      <div className="font-mono text-xs sm:text-sm font-bold text-[#1C1917]">
                        {selectedWardrobeSpec.dimensions}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Width: {selectedWardrobeSpec.widthCm} cm • Height: {selectedWardrobeSpec.heightCm} cm • Depth: {selectedWardrobeSpec.depthCm} cm
                      </div>
                    </div>

                    {/* Wardrobe Colour Swatches */}
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1C1917] block mb-1.5">
                        Select Wardrobe Colour: <span className="text-[#C5A059] font-medium normal-case text-sm font-bold">{selectedWardrobeColour.name}</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                        {wardrobeColours.map(col => {
                          const isSelected = selectedWardrobeColour.name === col.name;
                          return (
                            <button
                              key={col.name}
                              type="button"
                              onClick={() => setSelectedWardrobeColour(col)}
                              className={`min-h-[44px] p-2 rounded-lg border text-left flex items-center gap-2 transition-all active:scale-95 ${
                                isSelected
                                  ? 'border-[#C5A059] ring-2 ring-[#C5A059]/40 bg-[#FAF8F5] font-semibold'
                                  : 'border-[#E7E2DA] bg-white hover:border-[#C5A059]'
                              }`}
                            >
                              <span
                                className="w-5 h-5 rounded-full border border-stone-300 shadow-2xs shrink-0 flex items-center justify-center"
                                style={{ backgroundColor: col.hex }}
                              >
                                {isSelected && (
                                  <Check className={`w-3 h-3 ${col.hex === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                                )}
                              </span>
                              <span className="text-xs text-[#1C1917] truncate">{col.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Wardrobe Paragraph Description */}
                    <div className="border-t border-[#EFEBE4] pt-3 text-xs text-[#44403C] space-y-2">
                      <h3 className="font-serif font-bold text-sm text-[#1C1917]">
                        Brand New Wardrobes – Available in Multiple Sizes and Colours
                      </h3>
                      <ul className="space-y-1.5 list-disc pl-4 text-stone-600">
                        <li>Available in 2, 3, 4, 5, 6 and 8 door options.</li>
                        <li>Available in Black, White, Grey, Oak and Walnut.</li>
                        <li>Exact measurements are displayed according to the selected wardrobe size.</li>
                        <li><strong>Free Home Delivery Across the UK.</strong></li>
                        <li><strong>Cash on Delivery – No Advance Payment Required.</strong></li>
                        <li><strong className="text-blue-800">FREE Wardrobe Assembly Included.</strong></li>
                        <li>
                          <strong>Check your product before making payment.</strong> You are welcome to inspect your wardrobe upon delivery and pay only when you are satisfied with the product.
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* ──────────────────────────────────────────────────────── */}
                {/* BED SECTION: TITLE, DESCRIPTION, SIZES, MATTRESS, EXTRAS */}
                {/* ──────────────────────────────────────────────────────── */}
                {isBed && (
                  <div className="space-y-4">
                    {/* Step 1: Bed Size */}
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1C1917] block mb-1.5">
                        1. Bed Size: <span className="text-[#C5A059] font-medium normal-case text-sm font-bold">{selectedBedSize}</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {bedSizes.map(sz => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setSelectedBedSize(sz)}
                            className={`min-h-[46px] p-2.5 rounded-lg border text-center transition-all active:scale-95 ${
                              selectedBedSize === sz
                                ? 'bg-[#1C1917] text-white border-[#1C1917] font-bold shadow-xs ring-2 ring-[#C5A059]/40'
                                : 'bg-white text-stone-800 border-[#DCD7CD] hover:border-[#C5A059]'
                            }`}
                          >
                            <span className="text-xs font-bold block">{sz}</span>
                            <span className={`text-[10px] block ${selectedBedSize === sz ? 'text-[#C5A059]' : 'text-stone-500'}`}>
                              £{BED_SIZE_BASE_PRICES[sz]?.withStandardMattress} pkg
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 2: Fabric & Colour */}
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1C1917] block mb-1.5">
                        2. Upholstery Fabric & Colour: <span className="text-[#C5A059] font-medium normal-case text-sm font-bold">{selectedFabric} - {selectedBedColour?.name}</span>
                      </label>
                      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-2 scrollbar-none">
                        {availableFabrics.map(fab => (
                          <button
                            key={fab}
                            type="button"
                            onClick={() => handleFabricChange(fab)}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold shrink-0 transition-all ${
                              selectedFabric === fab
                                ? 'bg-[#1C1917] text-white'
                                : 'bg-white text-stone-700 border border-[#DCD7CD] hover:border-[#C5A059]'
                            }`}
                          >
                            {fab}
                          </button>
                        ))}
                      </div>

                      {/* Swatches */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        {bedColours.map((col, idx) => {
                          const isSelected = selectedBedColour?.name === col.name;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedBedColour(col)}
                              className={`min-h-[40px] p-2 rounded-lg border text-left flex items-center gap-2 transition-all ${
                                isSelected
                                  ? 'border-[#C5A059] ring-2 ring-[#C5A059]/40 bg-[#FAF8F5] font-semibold'
                                  : 'border-[#E7E2DA] bg-white hover:border-[#C5A059]'
                              }`}
                            >
                              <span
                                className="w-4 h-4 rounded-full border border-stone-300 shadow-2xs shrink-0 flex items-center justify-center"
                                style={{ backgroundColor: col.hex }}
                              >
                                {isSelected && (
                                  <Check className={`w-2.5 h-2.5 ${col.hex === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                                )}
                              </span>
                              <span className="text-[11px] text-[#1C1917] truncate">{col.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step 3: Bed Mattress Options and Extra Charges */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#1C1917]">
                          3. Mattress Selection:
                        </label>
                        <span className="text-xs text-[#C5A059] font-bold">
                          {selectedMattress.name}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {BED_MATTRESS_OPTIONS.map(mat => {
                          const isSelected = selectedMattressId === mat.id;
                          return (
                            <button
                              key={mat.id}
                              type="button"
                              onClick={() => setSelectedMattressId(mat.id)}
                              className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                                isSelected
                                  ? 'border-[#C5A059] bg-[#FAF8F5] ring-2 ring-[#C5A059]/30'
                                  : 'border-[#E7E2DA] bg-white hover:border-[#C5A059]'
                              }`}
                            >
                              <div>
                                <span className="text-xs font-semibold text-[#1C1917] block">
                                  {mat.name}
                                </span>
                                <span className="text-[10px] text-stone-500 block">
                                  {mat.description}
                                </span>
                              </div>
                              <div className="text-right shrink-0 pl-2">
                                <span
                                  className={`text-xs font-bold ${
                                    mat.extraPrice > 0
                                      ? 'text-[#C5A059]'
                                      : mat.extraPrice < 0
                                      ? 'text-emerald-700'
                                      : 'text-stone-600'
                                  }`}
                                >
                                  {mat.extraPrice > 0
                                    ? `+£${mat.extraPrice}`
                                    : mat.extraPrice < 0
                                    ? `-£${Math.abs(mat.extraPrice)}`
                                    : 'Included'}
                                </span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-[#C5A059] ml-auto mt-0.5" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step 4: Storage Drawers and Optional Extras */}
                    <div className="space-y-3 pt-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1C1917] block">
                        4. Storage & Optional Extras:
                      </label>

                      {/* Optional Storage Drawer – £15 per drawer */}
                      <div className="p-3 bg-white border border-[#E7E2DA] rounded-xl flex items-center justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold text-[#1C1917] block">
                            Optional Storage Drawers
                          </span>
                          <span className="text-[11px] text-stone-500">
                            £15 per drawer (Choice of 0, 1, 2, 3 or 4 drawers)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {[0, 1, 2, 4].map(num => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setDrawerCount(num)}
                              className={`px-2.5 py-1 text-xs rounded-md font-semibold border transition-all ${
                                drawerCount === num
                                  ? 'bg-[#1C1917] text-white border-[#1C1917]'
                                  : 'bg-[#FAF8F5] text-stone-700 border-[#DCD7CD] hover:border-[#C5A059]'
                              }`}
                            >
                              {num === 0 ? 'None' : `${num} (+£${num * 15})`}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Ottoman Storage Box – £60 extra per box */}
                      <div className="p-3 bg-white border border-[#E7E2DA] rounded-xl flex items-center justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold text-[#1C1917] block">
                            Ottoman Storage Box
                          </span>
                          <span className="text-[11px] text-stone-500">
                            Upholstered blanket box for foot of bed (£60 extra per box)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {[0, 1, 2].map(num => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setOttomanCount(num)}
                              className={`px-2.5 py-1 text-xs rounded-md font-semibold border transition-all ${
                                ottomanCount === num
                                  ? 'bg-[#1C1917] text-white border-[#1C1917]'
                                  : 'bg-[#FAF8F5] text-stone-700 border-[#DCD7CD] hover:border-[#C5A059]'
                              }`}
                            >
                              {num === 0 ? 'None' : `${num} (+£${num * 60})`}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Gas Lift Mechanism – £100 extra */}
                      <div className="p-3 bg-white border border-[#E7E2DA] rounded-xl flex items-center justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold text-[#1C1917] block">
                            Gas Lift Mechanism
                          </span>
                          <span className="text-[11px] text-stone-500">
                            Hydro-assist under-bed full-frame storage compartment (£100 extra)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setHasGasLift(!hasGasLift)}
                          className={`px-3 py-1.5 text-xs rounded-md font-semibold border transition-all flex items-center gap-1.5 ${
                            hasGasLift
                              ? 'bg-[#1C1917] text-white border-[#1C1917]'
                              : 'bg-[#FAF8F5] text-stone-700 border-[#DCD7CD] hover:border-[#C5A059]'
                          }`}
                        >
                          {hasGasLift && <Check className="w-3.5 h-3.5 text-[#C5A059]" />}
                          <span>{hasGasLift ? 'Added (+£100)' : 'Add +£100'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Bed Paragraph Description */}
                    <div className="border-t border-[#EFEBE4] pt-3 text-xs text-[#44403C] space-y-2">
                      <h3 className="font-serif font-bold text-sm text-[#1C1917]">
                        Brand New Beds – Available in Multiple Sizes and Colours
                      </h3>
                      <ul className="space-y-1.5 list-disc pl-4 text-stone-600">
                        <li>Available in Single, Double, King and Super King sizes.</li>
                        <li>Available in a wide range of colours.</li>
                        <li>Available with or without a mattress.</li>
                        <li>Standard spring mattress included when a bed is purchased with a mattress.</li>
                        <li><strong>Free Home Delivery Across the UK.</strong></li>
                        <li><strong>Cash on Delivery – No Advance Payment Required.</strong></li>
                        <li>Optional storage drawers and mattress upgrades available at additional costs.</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* ──────────────────────────────────────────────────────── */}
                {/* GENERIC CATEGORIES: Sofas, Dining Tables, Coffee Tables */}
                {/* ──────────────────────────────────────────────────────── */}
                {!isWardrobe && !isBed && (
                  <div className="space-y-4">
                    {genericColours.length > 1 && (
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-[#1C1917] block mb-1.5">
                          Select Finish: <span className="text-[#C5A059] font-bold">{selectedGenericColour.name}</span>
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {genericColours.map((col, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedGenericColour(col)}
                              className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all ${
                                selectedGenericColour.name === col.name
                                  ? 'border-[#C5A059] bg-[#FAF8F5] ring-2 ring-[#C5A059]/30'
                                  : 'border-[#E7E2DA] bg-white hover:border-[#C5A059]'
                              }`}
                            >
                              <span
                                className="w-4 h-4 rounded-full border border-stone-300 shadow-2xs shrink-0"
                                style={{ backgroundColor: col.hex }}
                              />
                              <span className="text-xs text-[#1C1917] truncate">{col.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {genericSizes.length > 1 && (
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-[#1C1917] block mb-1.5">
                          Select Dimension: <span className="text-[#C5A059] font-bold">{selectedGenericSize}</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {genericSizes.map(sz => (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => setSelectedGenericSize(sz)}
                              className={`p-2.5 rounded-lg border text-center text-xs font-semibold ${
                                selectedGenericSize === sz
                                  ? 'bg-[#1C1917] text-white border-[#1C1917]'
                                  : 'bg-white text-stone-800 border-[#DCD7CD]'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-stone-600 leading-relaxed pt-1">
                      {product.description}
                    </div>
                  </div>
                )}

                {/* ──────────────────────────────────────────────────────── */}
                {/* POSTCODE DELIVERY ROUTE CHECKER */}
                {/* ──────────────────────────────────────────────────────── */}
                <div className="bg-[#FAF8F5] p-3.5 sm:p-4 rounded-xl border border-[#E7E2DA]">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1C1917] flex items-center gap-1.5 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                    Check Delivery to Your UK Postcode
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={postcode}
                      onChange={e => {
                        setPostcode(e.target.value);
                        setPostcodeError('');
                      }}
                      placeholder="e.g. WF1, S1, DN1, M1, B1, LS1"
                      className="flex-1 bg-white border border-[#DCD7CD] rounded-lg px-3 py-2 text-xs uppercase outline-hidden focus:border-[#C5A059] min-h-[44px]"
                    />
                    <button
                      type="button"
                      onClick={validatePostcode}
                      disabled={isCheckingPostcode}
                      className="bg-[#1C1917] hover:bg-[#C5A059] hover:text-[#1C1917] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors min-h-[44px] active:scale-95"
                    >
                      {isCheckingPostcode ? '...' : 'Check'}
                    </button>
                  </div>
                  {postcodeError && <p className="text-xs text-rose-600 mt-1.5">{postcodeError}</p>}

                  {postcodeResult && (
                    <div className="mt-2.5 p-3 bg-white rounded-lg border border-[#E7E2DA] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-stone-800">Route Region:</span>
                        <span className="text-[#C5A059] font-bold">{postcodeResult.region}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-stone-800">Estimated Transit:</span>
                        <span className="text-emerald-700 font-semibold">{postcodeResult.estimatedDays}</span>
                      </div>
                      <div className="text-[11px] text-emerald-800 font-medium">
                        ✓ Eligible for Free Home Delivery & Cash on Delivery!
                      </div>
                    </div>
                  )}
                </div>

                {/* ──────────────────────────────────────────────────────── */}
                {/* PRIMARY ACTIONS: ADD TO BASKET & WHATSAPP WITH IMAGE */}
                {/* ──────────────────────────────────────────────────────── */}
                <div className="space-y-2.5 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* 1. Add to Basket Button */}
                    <button
                      type="button"
                      onClick={handleAddToCartClick}
                      className="w-full min-h-[48px] py-3 bg-[#1C1917] hover:bg-stone-800 active:bg-black text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                      <span>Add to Basket (£{calculatedPrice})</span>
                    </button>

                    {/* 2. WhatsApp Order with Product Image */}
                    <button
                      type="button"
                      onClick={handleShareWithImage}
                      disabled={isSharingImage}
                      className="w-full min-h-[48px] py-3 bg-[#25D366] hover:bg-[#20BD5A] active:bg-[#1E9E4B] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                    >
                      <Share2 className="w-4 h-4 fill-white shrink-0" />
                      <span>{isSharingImage ? 'Preparing Picture...' : 'Order via WhatsApp with Photo'}</span>
                    </button>
                  </div>

                  {/* Direct WhatsApp Click-to-Chat Fallback */}
                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                      Cash on Delivery • Free UK Delivery
                    </span>
                    <a
                      href={generateWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#25D366] hover:underline font-semibold flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Direct WhatsApp Link</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Fixed Bottom CTA Bar */}
          <div className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md p-3 border-t border-[#E7E2DA] shadow-2xl z-30 flex items-center gap-2">
            <button
              onClick={handleAddToCartClick}
              className="flex-1 min-h-[46px] bg-[#1C1917] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Basket (£{calculatedPrice})</span>
            </button>
            <button
              onClick={handleShareWithImage}
              className="flex-1 min-h-[46px] bg-[#25D366] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp + Photo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox for Fullscreen Image Viewing */}
      <ImageLightbox
        images={images}
        currentIndex={activeImageIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onSelectIndex={setActiveImageIndex}
        productName={product.name}
      />
    </>
  );
};
