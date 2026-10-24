/**
 * AMD Furniture UK - Type Definitions
 */

export type ProductCategory =
  | 'Beds'
  | 'Mattresses'
  | 'Sofas'
  | 'Sofa Beds'
  | 'Wardrobes'
  | 'Sliding Door Wardrobes'
  | 'Dining Tables'
  | 'Chest of Drawers'
  | 'Bedside Units'
  | 'Dressing Tables'
  | 'Coffee Tables'
  | 'Other Furniture Units';

export const ALL_CATEGORIES: ProductCategory[] = [
  'Beds',
  'Mattresses',
  'Sofas',
  'Sofa Beds',
  'Wardrobes',
  'Sliding Door Wardrobes',
  'Dining Tables',
  'Chest of Drawers',
  'Bedside Units',
  'Dressing Tables',
  'Coffee Tables',
  'Other Furniture Units'
];

export type ProductStatus = 'Published' | 'Draft';

export type FabricGroup = 'Steel' | 'Chenille' | 'Crushed Velvet' | 'Naples';

export interface ColourOption {
  name: string;
  hex: string;
  fabricGroup?: FabricGroup;
  onDemandOnly?: boolean;
  imageIndex?: number; // Optional index to product image (0, 1, or 2)
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  sku: string;
  category: ProductCategory;
  image: string;
  price: number;
  quantity: number;
  selectedSize: string;
  selectedColour?: ColourOption | null;
  dimensions?: string;
  // Wardrobe specific
  wardrobeMeasurements?: string;
  // Bed specific
  mattressOption?: string;
  mattressPrice?: number;
  drawersCount?: number;
  drawersPrice?: number;
  ottomanBoxesCount?: number;
  ottomanPrice?: number;
  hasGasLift?: boolean;
  gasLiftPrice?: number;
  notes?: string;
}

export interface WardrobeSizeSpec {
  size: string;
  doors: number;
  widthCm: number;
  heightCm: number;
  depthCm: number;
  dimensions: string;
  basePrice: number;
}

export interface BedMattressChoice {
  id: string;
  name: string;
  extraPrice: number; // relative to base with standard spring mattress package
  description: string;
  isIncluded?: boolean;
  isFrameOnly?: boolean;
}

export interface BedOptionsConfig {
  sizes: string[]; // e.g. ["Single", "Double", "King", "Super King"]
  fabricGroups: FabricGroup[];
  colours: ColourOption[];
  drawerOptions: string[];
  mattressOptions: {
    enabled: boolean;
    options: ('Bed frame only' | 'Standard spring mattress' | 'Memory foam mattress' | 'Orthopaedic mattress')[];
  };
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  subcategory?: string;
  description: string;
  price?: number | null; // Null or stripped for Beds in public view!
  displayPrice?: string; // "Price on WhatsApp — Please enquire." for Beds
  status: ProductStatus;
  images: string[]; // Up to 3 images
  sizes: string[];
  colours: ColourOption[];
  fabricGroups?: FabricGroup[];
  bedConfig?: BedOptionsConfig;
  stockStatus: 'In Stock' | 'Low Stock' | 'Made to Order' | 'Out of Stock';
  isFeatured?: boolean;
  isNewArrival?: boolean;
  dimensions?: string;
  material?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostcodeZone {
  id: string;
  prefix: string; // e.g. "WF", "S", "M", "B"
  region: string; // e.g. "Yorkshire & Humber", "Greater Manchester", "West Midlands"
  city?: string; // e.g. "Wakefield", "Sheffield", "Manchester", "Birmingham"
  status: 'Eligible' | 'Manual Confirmation' | 'Unavailable';
  estimatedDays: string; // "Everyday (7 Days) - Next-Day Delivery Available"
  surcharge: number; // £0
  notes?: string;
  isLocal7Day?: boolean; // Flag for 7-day everyday route
}

export interface DeliveryBooking {
  id: string;
  productName: string;
  sku: string;
  customerName: string;
  customerPhone: string;
  postcode: string;
  preferredDate: string;
  category: ProductCategory;
  bedSelections?: {
    size?: string;
    fabricGroup?: string;
    colour?: string;
    drawerOption?: string;
    mattressOption?: string;
  };
  wardrobeSelections?: {
    colour?: string;
    size?: string;
  };
  status: 'Requested' | 'Confirmed' | 'Dispatched' | 'Delivered' | 'Cancelled';
  confirmedDeliveryDate?: string;
  driverNotes?: string;
  notes?: string;
  createdAt: string;
}

export interface InternalBedPricing {
  drawerChargePerDrawer: number; // default £15
  standardSpringMattressPrice: number; // configurable
  memoryFoamUpgradePrice: number; // default £20
  orthopaedicUpgradePrice: number; // default £20
  zoneSurchargePerBed: number; // default £20
}

export interface SiteSettings {
  announcementText: string;
  announcementEnabled: boolean;
  whatsappNumber: string; // "+447576531552"
  storePhone: string;
  storeEmail: string;
  storeAddress: string;
  nextDayCutoffTime: string; // "19:00"
  deliveryGuaranteeNotice: string;
  pricingDefaults: InternalBedPricing;
}
