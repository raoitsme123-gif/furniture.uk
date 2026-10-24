import { FabricGroup, ColourOption, PostcodeZone, SiteSettings } from '../types';

export const LUXURY_ASSETS = {
  heroShowroom: '/images/luxury/hero_showroom.jpg',
  showcaseBed: '/images/luxury/showcase_bed.jpg',
  showcaseWardrobe: '/images/luxury/showcase_wardrobe.jpg',
  showcaseDining: '/images/luxury/showcase_dining.jpg',
};

/**
 * Exact UK Upholstery Fabrics and Colour Palette
 */
export const BED_FABRICS: Record<FabricGroup, { name: string; description: string; colours: ColourOption[] }> = {
  Steel: {
    name: 'Steel (Plush Velvet)',
    description: 'Smooth, dense brushed pile with a soft metallic sheen and durable easy-clean finish.',
    colours: [
      { name: 'Silver', hex: '#C0C0C0', fabricGroup: 'Steel' },
      { name: 'Grey', hex: '#7A7D84', fabricGroup: 'Steel' },
      { name: 'Charcoal', hex: '#36383E', fabricGroup: 'Steel' },
      { name: 'Black', hex: '#18181A', fabricGroup: 'Steel' },
      { name: 'Cream', hex: '#F3EED9', fabricGroup: 'Steel' },
      { name: 'Champagne', hex: '#E8D7B8', fabricGroup: 'Steel' },
      { name: 'Duck Egg', hex: '#90AFA9', fabricGroup: 'Steel' },
      { name: 'Teal', hex: '#0E6669', fabricGroup: 'Steel' },
      { name: 'Navy Blue', hex: '#1B2A4A', fabricGroup: 'Steel' },
      { name: 'Mink', hex: '#8E7A6E', fabricGroup: 'Steel' },
      { name: 'Mustard', hex: '#D4A017', fabricGroup: 'Steel' },
      { name: 'Blush Pink', hex: '#E0A899', fabricGroup: 'Steel' }
    ]
  },
  Chenille: {
    name: 'Chenille',
    description: 'Rich textured weave with a soft, fuzzy yarn structure, warm tactile feel and vintage character.',
    colours: [
      { name: 'Silver', hex: '#BABABA', fabricGroup: 'Chenille' },
      { name: 'Grey', hex: '#6E7075', fabricGroup: 'Chenille' },
      { name: 'Charcoal', hex: '#2B2C30', fabricGroup: 'Chenille' },
      { name: 'Black', hex: '#111112', fabricGroup: 'Chenille' },
      { name: 'Cream', hex: '#F4EEDC', fabricGroup: 'Chenille' },
      { name: 'Mink', hex: '#8C7869', fabricGroup: 'Chenille' },
      { name: 'Chocolate Brown', hex: '#3D2B1F', fabricGroup: 'Chenille' },
      { name: 'Teal', hex: '#15595E', fabricGroup: 'Chenille' }
    ]
  },
  'Crushed Velvet': {
    name: 'Crushed Velvet',
    description: 'High-glamour shimmering fabric with irregular crushed pile creating deep light reflections.',
    colours: [
      { name: 'Silver Shimmer', hex: '#D2D6DC', fabricGroup: 'Crushed Velvet' },
      { name: 'Grey Glitz', hex: '#8A8E96', fabricGroup: 'Crushed Velvet' },
      { name: 'Black Diamond', hex: '#1A1A1D', fabricGroup: 'Crushed Velvet' },
      { name: 'Champagne Gold', hex: '#E3D2B4', fabricGroup: 'Crushed Velvet' },
      { name: 'Rose Gold Pink', hex: '#DBA4A7', fabricGroup: 'Crushed Velvet' },
      { name: 'Royal Blue', hex: '#1F3A82', fabricGroup: 'Crushed Velvet' },
      { name: 'Truffle Mink', hex: '#7B665A', fabricGroup: 'Crushed Velvet' }
    ]
  },
  Naples: {
    name: 'Naples (Soft Matte Velvet)',
    description: 'Understated elegance with a low-sheen contemporary matte finish and ultra-soft handle.',
    colours: [
      { name: 'Cream', hex: '#EFE8D6', fabricGroup: 'Naples' },
      { name: 'Seal Grey', hex: '#6B6F77', fabricGroup: 'Naples' },
      { name: 'Slate Grey', hex: '#484C55', fabricGroup: 'Naples' },
      { name: 'Black', hex: '#121213', fabricGroup: 'Naples' },
      { name: 'Navy', hex: '#17233B', fabricGroup: 'Naples' },
      { name: 'Olive Green', hex: '#555D42', fabricGroup: 'Naples' },
      { name: 'Burgundy Wine', hex: '#541E28', fabricGroup: 'Naples' },
      { name: 'Ochre Yellow', hex: '#C68B2A', fabricGroup: 'Naples' }
    ]
  }
};

/**
 * Standard Wardrobe Door Sizes and Exact Measurements
 * • 2 Door Wardrobe: 76 cm wide × 184 cm high × 50 cm deep
 * • 3 Door Wardrobe: 114 cm wide × 184 cm high × 50 cm deep
 * • 4 Door Wardrobe: 152 cm wide × 184 cm high × 50 cm deep
 * • 5 Door Wardrobe: 190 cm wide × 184 cm high × 50 cm deep
 * • 6 Door Wardrobe: 228 cm wide × 184 cm high × 50 cm deep
 * • 8 Door Wardrobe: 304 cm wide × 184 cm high × 50 cm deep
 */
export const WARDROBE_SIZES_SPECS = [
  {
    size: '2 Door Wardrobe',
    doors: 2,
    widthCm: 76,
    heightCm: 184,
    depthCm: 50,
    dimensions: '76 cm wide × 184 cm high × 50 cm deep',
    basePrice: 219
  },
  {
    size: '3 Door Wardrobe',
    doors: 3,
    widthCm: 114,
    heightCm: 184,
    depthCm: 50,
    dimensions: '114 cm wide × 184 cm high × 50 cm deep',
    basePrice: 289
  },
  {
    size: '4 Door Wardrobe',
    doors: 4,
    widthCm: 152,
    heightCm: 184,
    depthCm: 50,
    dimensions: '152 cm wide × 184 cm high × 50 cm deep',
    basePrice: 389
  },
  {
    size: '5 Door Wardrobe',
    doors: 5,
    widthCm: 190,
    heightCm: 184,
    depthCm: 50,
    dimensions: '190 cm wide × 184 cm high × 50 cm deep',
    basePrice: 499
  },
  {
    size: '6 Door Wardrobe',
    doors: 6,
    widthCm: 228,
    heightCm: 184,
    depthCm: 50,
    dimensions: '228 cm wide × 184 cm high × 50 cm deep',
    basePrice: 599
  },
  {
    size: '8 Door Wardrobe',
    doors: 8,
    widthCm: 304,
    heightCm: 184,
    depthCm: 50,
    dimensions: '304 cm wide × 184 cm high × 50 cm deep',
    basePrice: 799
  }
];

/**
 * Standard Wardrobes Colours (Exact match swatches & labels)
 * • Walnut – Walnut colour dot (#5C4033)
 * • White – White colour dot (#FFFFFF)
 * • Black – Black colour dot (#1A1A1A)
 * • Grey – Grey colour dot (#808080)
 * • Oak – Oak colour dot (#C19A6B)
 */
export const STANDARD_WARDROBE_COLOURS: ColourOption[] = [
  { name: 'Walnut', hex: '#5C4033' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#1A1A1A' },
  { name: 'Grey', hex: '#808080' },
  { name: 'Oak', hex: '#C19A6B' }
];

/**
 * Sliding Door Wardrobes Colours
 */
export const SLIDING_WARDROBE_COLOURS: ColourOption[] = [
  { name: 'Black', hex: '#1A1A1A' },
  { name: 'Oak', hex: '#C19A6B' },
  { name: 'Grey', hex: '#808080' },
  { name: 'Walnut', hex: '#5C4033' },
  { name: 'White', hex: '#FFFFFF' }
];

/**
 * Chest of Drawers Colours
 */
export const CHEST_OF_DRAWERS_COLOURS: ColourOption[] = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#1A1A1A' },
  { name: 'Oak', hex: '#C19A6B' },
  { name: 'Walnut', hex: '#5C4033' },
  { name: 'Grey', hex: '#808080' }
];

/**
 * Standard Bed Sizes
 */
export const DEFAULT_BED_SIZES = [
  'Single',
  'Double',
  'King',
  'Super King'
];

/**
 * Bed Size Pricing (Base price includes standard spring mattress package)
 */
export const BED_SIZE_BASE_PRICES: Record<string, { frameOnly: number; withStandardMattress: number }> = {
  'Single': { frameOnly: 149, withStandardMattress: 199 },
  'Small Double': { frameOnly: 179, withStandardMattress: 229 },
  'Double': { frameOnly: 199, withStandardMattress: 249 },
  'King': { frameOnly: 239, withStandardMattress: 289 },
  'Super King': { frameOnly: 289, withStandardMattress: 349 }
};

/**
 * Bed Mattress Options and Extra Charges
 * • Standard Spring Mattress – Included in the standard mattress package.
 * • Memory Foam Mattress – £20 extra.
 * • Orthopaedic Firm Mattress – £20 extra.
 * • 1000 Pocket Mattress – £30 extra.
 * • 1500 Pocket Mattress – £40 extra.
 * • 2000 Pocket Mattress – £40 extra.
 * • Sun Mattress – £30 extra.
 * • Bed Without Mattress – Customer deducts mattress charge (£50) to buy bed frame only.
 */
export const BED_MATTRESS_OPTIONS = [
  {
    id: 'standard-spring',
    name: 'Standard Spring Mattress',
    extraPrice: 0,
    description: 'Included in standard mattress package',
    isIncluded: true
  },
  {
    id: 'memory-foam',
    name: 'Memory Foam Mattress',
    extraPrice: 20,
    description: '£20 extra'
  },
  {
    id: 'orthopaedic-firm',
    name: 'Orthopaedic Firm Mattress',
    extraPrice: 20,
    description: '£20 extra'
  },
  {
    id: '1000-pocket',
    name: '1000 Pocket Mattress',
    extraPrice: 30,
    description: '£30 extra'
  },
  {
    id: '1500-pocket',
    name: '1500 Pocket Mattress',
    extraPrice: 40,
    description: '£40 extra'
  },
  {
    id: '2000-pocket',
    name: '2000 Pocket Mattress',
    extraPrice: 40,
    description: '£40 extra'
  },
  {
    id: 'sun-mattress',
    name: 'Sun Mattress',
    extraPrice: 30,
    description: '£30 extra'
  },
  {
    id: 'frame-only',
    name: 'Bed Without Mattress',
    extraPrice: -50,
    description: 'Deduct £50 for bed frame only (no mattress)',
    isFrameOnly: true
  }
];

/**
 * Standard Drawer Configurations for Beds
 */
export const DEFAULT_DRAWER_OPTIONS = [
  'No Drawers',
  '1 Storage Drawer',
  '2 Storage Drawers',
  '3 Storage Drawers',
  '4 Storage Drawers'
];

/**
 * Standard Mattress Options legacy array
 */
export const DEFAULT_MATTRESS_OPTIONS: ('Bed frame only' | 'Standard spring mattress' | 'Memory foam mattress' | 'Orthopaedic mattress')[] = [
  'Bed frame only',
  'Standard spring mattress',
  'Memory foam mattress',
  'Orthopaedic mattress'
];

/**
 * Detailed 7-Days Everyday Local Delivery Routes
 * User requirement: "Our local sides - 7 Day's delivery routes EVERYDAY - Next day deliveries till 7pm you can send orders for next day"
 */
export interface LocalRouteItem {
  city: string;
  prefix: string;
  region: string;
}

export const LOCAL_7DAY_DELIVERY_ROUTES: LocalRouteItem[] = [
  { city: 'Wakefield', prefix: 'WF', region: 'Yorkshire & Humber' },
  { city: 'Sheffield', prefix: 'S', region: 'Yorkshire & Humber' },
  { city: 'Barnsley', prefix: 'S', region: 'Yorkshire & Humber' },
  { city: 'Doncaster', prefix: 'DN', region: 'Yorkshire & Humber' },
  { city: 'Derby', prefix: 'DE', region: 'East Midlands' },
  { city: 'Nottingham', prefix: 'NG', region: 'East Midlands' },
  { city: 'Leicester', prefix: 'LE', region: 'East Midlands' },
  { city: 'Coventry', prefix: 'CV', region: 'West Midlands' },
  { city: 'Birmingham', prefix: 'B', region: 'West Midlands' },
  { city: 'Wolverhampton', prefix: 'WV', region: 'West Midlands' },
  { city: 'Walsall', prefix: 'WS', region: 'West Midlands' },
  { city: 'Dudley', prefix: 'DY', region: 'West Midlands' },
  { city: 'Bradford', prefix: 'BD', region: 'Yorkshire & Humber' },
  { city: 'Huddersfield', prefix: 'HD', region: 'Yorkshire & Humber' },
  { city: 'Halifax', prefix: 'HX', region: 'Yorkshire & Humber' },
  { city: 'Stoke-on-Trent', prefix: 'ST', region: 'West Midlands' },
  { city: 'Telford', prefix: 'TF', region: 'West Midlands' },
  { city: 'Manchester', prefix: 'M', region: 'Greater Manchester' },
  { city: 'Oldham', prefix: 'OL', region: 'Greater Manchester' },
  { city: 'Preston', prefix: 'PR', region: 'North West' },
  { city: 'Liverpool', prefix: 'L', region: 'Merseyside & North West' },
  { city: 'Blackpool', prefix: 'FY', region: 'North West' },
  { city: 'Wigan', prefix: 'WN', region: 'Greater Manchester' },
  { city: 'Bolton', prefix: 'BL', region: 'Greater Manchester' },
  { city: 'Blackburn', prefix: 'BB', region: 'North West' },
  { city: 'Warrington', prefix: 'WA', region: 'North West' },
  { city: 'Chester', prefix: 'CH', region: 'Cheshire & North West' },
  { city: 'Stockport', prefix: 'SK', region: 'Greater Manchester' },
  { city: 'Crewe', prefix: 'CW', region: 'Cheshire' },
  { city: 'Bury', prefix: 'BL', region: 'Greater Manchester' },
  { city: 'Leeds', prefix: 'LS', region: 'Yorkshire & Humber' },
  { city: 'Harrogate', prefix: 'HG', region: 'Yorkshire & Humber' },
  { city: 'York', prefix: 'YO', region: 'Yorkshire & Humber' },
  { city: 'Newcastle', prefix: 'NE', region: 'North East' },
  { city: 'Sunderland', prefix: 'SR', region: 'North East' },
  { city: 'Durham', prefix: 'DH', region: 'North East' },
  { city: 'Darlington', prefix: 'DL', region: 'North East' },
  { city: 'Middlesbrough', prefix: 'TS', region: 'North East' },
  { city: 'Lincoln', prefix: 'LN', region: 'East Midlands' },
  { city: 'Bourne', prefix: 'PE', region: 'East of England' },
  { city: 'Peterborough', prefix: 'PE', region: 'East of England' },
  { city: 'Northamptonshire', prefix: 'NN', region: 'East Midlands' },
  { city: 'Hull', prefix: 'HU', region: 'Yorkshire & Humber' },
  { city: 'Worcester', prefix: 'WR', region: 'West Midlands' },
  { city: 'Shrewsbury', prefix: 'SY', region: 'West Midlands' },
  { city: 'Wrexham', prefix: 'LL', region: 'North Wales & Border' },
  { city: 'Lancaster', prefix: 'LA', region: 'North West' },
  { city: 'Luton', prefix: 'LU', region: 'East of England / Beds' },
  { city: 'Milton Keynes', prefix: 'MK', region: 'Buckinghamshire / South East' }
];

/**
 * Initial Postcode Zones Configuration
 * Complete mapping: Local 7-Day Everyday Routes + London & South East + Scotland + Wales
 */
export const INITIAL_POSTCODE_ZONES: PostcodeZone[] = [
  // 1. OUR LOCAL SIDES - 7 DAYS DELIVERY ROUTES (EVERYDAY) - ORDERS TILL 7:00 PM FOR NEXT-DAY
  {
    id: 'pc-WF',
    prefix: 'WF',
    city: 'Wakefield',
    region: 'Yorkshire & Humber (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-S',
    prefix: 'S',
    city: 'Sheffield, Barnsley',
    region: 'South Yorkshire (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-DN',
    prefix: 'DN',
    city: 'Doncaster',
    region: 'South Yorkshire (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-DE',
    prefix: 'DE',
    city: 'Derby',
    region: 'East Midlands (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-NG',
    prefix: 'NG',
    city: 'Nottingham',
    region: 'East Midlands (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-LE',
    prefix: 'LE',
    city: 'Leicester',
    region: 'East Midlands (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-CV',
    prefix: 'CV',
    city: 'Coventry',
    region: 'West Midlands (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-B',
    prefix: 'B',
    city: 'Birmingham',
    region: 'West Midlands (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-WV',
    prefix: 'WV',
    city: 'Wolverhampton',
    region: 'West Midlands (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-WS',
    prefix: 'WS',
    city: 'Walsall',
    region: 'West Midlands (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-DY',
    prefix: 'DY',
    city: 'Dudley',
    region: 'West Midlands (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-BD',
    prefix: 'BD',
    city: 'Bradford',
    region: 'West Yorkshire (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-HD',
    prefix: 'HD',
    city: 'Huddersfield',
    region: 'West Yorkshire (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-HX',
    prefix: 'HX',
    city: 'Halifax',
    region: 'West Yorkshire (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-ST',
    prefix: 'ST',
    city: 'Stoke-on-Trent',
    region: 'Staffordshire / Midlands (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-TF',
    prefix: 'TF',
    city: 'Telford',
    region: 'Shropshire / West Midlands (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-M',
    prefix: 'M',
    city: 'Manchester',
    region: 'Greater Manchester (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-OL',
    prefix: 'OL',
    city: 'Oldham',
    region: 'Greater Manchester (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-PR',
    prefix: 'PR',
    city: 'Preston',
    region: 'Lancashire (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-L',
    prefix: 'L',
    city: 'Liverpool',
    region: 'Merseyside (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-FY',
    prefix: 'FY',
    city: 'Blackpool',
    region: 'Lancashire (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-WN',
    prefix: 'WN',
    city: 'Wigan',
    region: 'Greater Manchester (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-BL',
    prefix: 'BL',
    city: 'Bolton, Bury',
    region: 'Greater Manchester (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-BB',
    prefix: 'BB',
    city: 'Blackburn',
    region: 'Lancashire (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-WA',
    prefix: 'WA',
    city: 'Warrington',
    region: 'Cheshire (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-CH',
    prefix: 'CH',
    city: 'Chester',
    region: 'Cheshire (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-SK',
    prefix: 'SK',
    city: 'Stockport',
    region: 'Greater Manchester (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-CW',
    prefix: 'CW',
    city: 'Crewe',
    region: 'Cheshire (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-LS',
    prefix: 'LS',
    city: 'Leeds',
    region: 'West Yorkshire (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-HG',
    prefix: 'HG',
    city: 'Harrogate',
    region: 'North Yorkshire (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-YO',
    prefix: 'YO',
    city: 'York',
    region: 'North Yorkshire (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-NE',
    prefix: 'NE',
    city: 'Newcastle',
    region: 'Tyne and Wear (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-SR',
    prefix: 'SR',
    city: 'Sunderland',
    region: 'Tyne and Wear (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-DH',
    prefix: 'DH',
    city: 'Durham',
    region: 'County Durham (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-DL',
    prefix: 'DL',
    city: 'Darlington, Durham',
    region: 'County Durham (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-TS',
    prefix: 'TS',
    city: 'Middlesbrough',
    region: 'Teesside / North East (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-LN',
    prefix: 'LN',
    city: 'Lincoln',
    region: 'Lincolnshire (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-PE',
    prefix: 'PE',
    city: 'Peterborough, Bourne',
    region: 'East of England (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-NN',
    prefix: 'NN',
    city: 'Northamptonshire',
    region: 'East Midlands (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-HU',
    prefix: 'HU',
    city: 'Hull',
    region: 'East Yorkshire (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-WR',
    prefix: 'WR',
    city: 'Worcester',
    region: 'West Midlands (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-SY',
    prefix: 'SY',
    city: 'Shrewsbury',
    region: 'Shropshire / West Midlands (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-LL',
    prefix: 'LL',
    city: 'Wrexham',
    region: 'North Wales & Border (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-LA',
    prefix: 'LA',
    city: 'Lancaster',
    region: 'Lancashire (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-LU',
    prefix: 'LU',
    city: 'Luton',
    region: 'Bedfordshire / South East (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },
  {
    id: 'pc-MK',
    prefix: 'MK',
    city: 'Milton Keynes',
    region: 'Buckinghamshire (Local Sides)',
    status: 'Eligible',
    isLocal7Day: true,
    estimatedDays: 'Everyday (7 Days) - Next-Day Delivery',
    surcharge: 0,
    notes: '7 Days delivery route (EVERYDAY). Next day deliveries available: orders sent till 7:00 PM eligible for next day delivery.'
  },

  // 2. LONDON & SURROUNDING HOME COUNTIES
  ...['OX', 'CB', 'AL', 'BR', 'CM', 'CO', 'CR', 'DA', 'E', 'EC', 'EN', 'GU', 'HA', 'HP', 'IG', 'KT', 'ME', 'N', 'NW', 'RG', 'RH', 'RM', 'SE', 'SG', 'SL', 'SM', 'SS', 'SW', 'TW', 'UB', 'W', 'WD'].map(p => ({
    id: `pc-${p}`,
    prefix: p,
    region: 'London & Home Counties',
    status: 'Eligible' as const,
    estimatedDays: '1-2 Days (Next-Day Eligible)',
    surcharge: 0,
    notes: 'Standard fast delivery route. Eligible for next-day bed delivery if confirmed by 7:00 PM.'
  })),

  // 3. SCOTLAND (INCLUDING GLASGOW 'G' METRO)
  ...['PA', 'KA', 'ML', 'FK', 'G', 'EH', 'KY', 'DG', 'TD', 'CA', 'PH'].map(p => ({
    id: `pc-${p}`,
    prefix: p,
    region: p === 'G' ? 'Scotland (Glasgow Metro & Clyde)' : 'Scotland & Northern Routes',
    status: 'Eligible' as const,
    estimatedDays: p === 'G' ? '1-2 Days (Direct Glasgow Route)' : '2-3 Days',
    surcharge: 0,
    notes: p === 'G' ? 'UK-wide delivery includes frequent weekly direct Glasgow routes.' : 'Direct Scottish route. Advance scheduling available.'
  })),

  // 4. WALES & WEST COUNTRY
  ...['SN', 'BS', 'CF', 'GL', 'HR', 'NP', 'BA', 'SA'].map(p => ({
    id: `pc-${p}`,
    prefix: p,
    region: 'Wales & West Country',
    status: 'Eligible' as const,
    estimatedDays: '2 Days',
    surcharge: 0,
    notes: 'Regular scheduled route. Driver calls 1 hour before arrival.'
  }))
];

/**
 * Default Website Settings
 */
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  announcementText:
    'AMD Furniture UK | 7 Days Delivery Routes (EVERYDAY) | Next-day deliveries till 7:00 PM order cut-off | Covering Wakefield, Sheffield, Manchester, Birmingham, Leeds, Newcastle & UK-wide',
  announcementEnabled: true,
  whatsappNumber: '+447576531552',
  storePhone: '+44 7576 531552',
  storeEmail: 'enquiries@amdfurniture.co.uk',
  storeAddress: 'AMD Furniture UK Headquarters, United Kingdom',
  nextDayCutoffTime: '19:00',
  deliveryGuaranteeNotice:
    'Delivery depends on stock, postcode, route and confirmation by AMD Furniture. Next-day delivery available everyday for enquiries confirmed before 7:00 PM on our local 7-day delivery routes. Delivery dates confirmed directly with our logistics team.',
  pricingDefaults: {
    drawerChargePerDrawer: 15,
    standardSpringMattressPrice: 60,
    memoryFoamUpgradePrice: 20,
    orthopaedicUpgradePrice: 20,
    zoneSurchargePerBed: 20
  }
};

export interface CategoryMeta {
  description: string;
  heroImage: string;
  fallbackImage: string;
  badge: string;
  subcategories: string[];
}

/**
 * Standard Subcategories mapped by Category
 */
export const CATEGORY_SUBCATEGORIES: Record<string, string[]> = {
  Beds: [
    'Ambassador Beds',
    'Panel & Linear Beds',
    'Wingback Beds',
    'Ottoman Storage Beds',
    'Gas Lift Beds',
    'Divan Beds'
  ],
  Mattresses: [
    'Pocket Sprung Mattresses',
    'Memory Foam Mattresses',
    'Orthopaedic Firm Mattresses',
    'Hybrid Mattresses'
  ],
  Sofas: [
    '3-Seater Sofas',
    '2-Seater Sofas',
    'Corner & L-Shape Sofas',
    'Chesterfield Sofas',
    'Recliner Sofas'
  ],
  'Sofa Beds': [
    'Click-Clack Sofa Beds',
    'Corner Sofa Beds',
    'Pull-Out Bed Sofas',
    'Storage Sofa Beds',
    'Daybeds'
  ],
  Wardrobes: [
    '2 Door Wardrobes',
    '3 Door Wardrobes',
    '4 Door Wardrobes',
    '5 Door Wardrobes',
    '6 & 8 Door Wardrobes',
    'Hinged Mirrored Wardrobes'
  ],
  'Sliding Door Wardrobes': [
    '150 cm Sliding Wardrobes',
    '180 cm Sliding Wardrobes',
    '200 cm Sliding Wardrobes',
    '250 cm Sliding Wardrobes',
    'Full Mirror Sliding Wardrobes'
  ],
  'Dining Tables': [
    'Sintered Stone Tables',
    'Marble Effect Tables',
    'Solid Wood Dining Tables',
    'Extendable Dining Tables',
    'Dining Table & Chair Sets'
  ],
  'Chest of Drawers': [
    '3-Drawer Chests',
    '4-Drawer Chests',
    '5-Drawer Tallboys',
    'Wide 6-Drawer Chests'
  ],
  'Bedside Units': [
    '1-Drawer Nightstands',
    '2-Drawer Nightstands',
    'Upholstered Bedsides',
    'Mirrored Bedside Cabinets'
  ],
  'Dressing Tables': [
    'LED Touch Mirror Vanities',
    'Hollywood Glamour Tables',
    'Compact Dressing Stations',
    'Stool & Mirror Sets'
  ],
  'Coffee Tables': [
    'Round Marble Coffee Tables',
    'Fluted Wood Tables',
    'Nest of Coffee Tables',
    'Tempered Glass Coffee Tables',
    'Storage Coffee Tables'
  ],
  'Other Furniture Units': [
    'Storage Ottomans & Blanket Boxes',
    'TV Media Consoles',
    'Hallway Benches & Consoles',
    'Accent Bookcases'
  ]
};

/**
 * Category Metadata with High-Resolution Photography, Icons and Descriptions
 */
export const CATEGORY_DETAILS: Record<string, CategoryMeta> = {
  Beds: {
    description: 'Handcrafted British upholstered beds, wingback headboards, gas-lift ottoman storage and bespoke frames.',
    heroImage: '/images/luxury/showcase_bed.jpg',
    fallbackImage: '/images/luxury/showcase_bed.jpg',
    badge: 'Bespoke Fabrics',
    subcategories: CATEGORY_SUBCATEGORIES.Beds
  },
  Mattresses: {
    description: 'Supportive pocket sprung, memory foam, and orthopaedic mattresses engineered for deep rest.',
    heroImage: '/images/luxury/showcase_bed.jpg',
    fallbackImage: '/images/luxury/showcase_bed.jpg',
    badge: 'Dual Sided',
    subcategories: CATEGORY_SUBCATEGORIES.Mattresses
  },
  Sofas: {
    description: 'Sumptuous velvet, chenille, and linen corner sofas, 3-seaters, and Chesterfield suites.',
    heroImage: '/images/luxury/hero_showroom.jpg',
    fallbackImage: '/images/luxury/hero_showroom.jpg',
    badge: 'Deep Cushion',
    subcategories: CATEGORY_SUBCATEGORIES.Sofas
  },
  'Sofa Beds': {
    description: 'Effortless conversion guest beds combining supreme daily seating comfort with overnight luxury.',
    heroImage: '/images/luxury/hero_showroom.jpg',
    fallbackImage: '/images/categories/sofa-beds.jpg',
    badge: 'Dual Purpose',
    subcategories: CATEGORY_SUBCATEGORIES['Sofa Beds']
  },
  Wardrobes: {
    description: 'Spacious hinged 2-door, 3-door, and 4-door wardrobes finished in oak, walnut, grey, and white.',
    heroImage: '/images/luxury/showcase_wardrobe.jpg',
    fallbackImage: '/images/luxury/showcase_wardrobe.jpg',
    badge: 'Full Hanging',
    subcategories: CATEGORY_SUBCATEGORIES.Wardrobes
  },
  'Sliding Door Wardrobes': {
    description: 'Modern space-saving sliding wardrobes with mirrored panels, smooth aluminium tracks, and ledges.',
    heroImage: '/images/luxury/showcase_wardrobe.jpg',
    fallbackImage: '/images/luxury/showcase_wardrobe.jpg',
    badge: 'Mirrored Options',
    subcategories: CATEGORY_SUBCATEGORIES['Sliding Door Wardrobes']
  },
  'Dining Tables': {
    description: 'Solid wood, sintered stone, and marble effect dining tables paired with velvet dining chairs.',
    heroImage: '/images/luxury/showcase_dining.jpg',
    fallbackImage: '/images/luxury/showcase_dining.jpg',
    badge: 'Family Dining',
    subcategories: CATEGORY_SUBCATEGORIES['Dining Tables']
  },
  'Chest of Drawers': {
    description: '4-drawer, 5-drawer, and wide 6-drawer chests with smooth metal runners and premium finishes.',
    heroImage: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1200&auto=format&fit=crop',
    fallbackImage: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=1200&auto=format&fit=crop',
    badge: 'Deep Storage',
    subcategories: CATEGORY_SUBCATEGORIES['Chest of Drawers']
  },
  'Bedside Units': {
    description: 'Chic 1-drawer and 2-drawer nightstands to complement your bed frame and bedroom decor.',
    heroImage: 'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?q=80&w=1200&auto=format&fit=crop',
    fallbackImage: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1200&auto=format&fit=crop',
    badge: 'Compact Style',
    subcategories: CATEGORY_SUBCATEGORIES['Bedside Units']
  },
  'Dressing Tables': {
    description: 'Vanity tables with LED mirror options, matching stools, and dedicated cosmetic drawers.',
    heroImage: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1200&auto=format&fit=crop',
    fallbackImage: 'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?q=80&w=1200&auto=format&fit=crop',
    badge: 'Luxury Vanity',
    subcategories: CATEGORY_SUBCATEGORIES['Dressing Tables']
  },
  'Coffee Tables': {
    description: 'Statement living room centerpieces in fluted oak, marble finishes, tempered glass, and brass.',
    heroImage: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1200&auto=format&fit=crop',
    fallbackImage: '/images/categories/coffee-tables.jpg',
    badge: 'Living Accent',
    subcategories: CATEGORY_SUBCATEGORIES['Coffee Tables']
  },
  'Other Furniture Units': {
    description: 'TV media consoles, hallway consoles, storage ottomans, and accent bookcases.',
    heroImage: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1200&auto=format&fit=crop',
    fallbackImage: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?q=80&w=1200&auto=format&fit=crop',
    badge: 'Bespoke Additions',
    subcategories: CATEGORY_SUBCATEGORIES['Other Furniture Units']
  }
};

/**
 * Normalization helper to look up category metadata safely for both
 * singular and plural forms (e.g. 'Sofa Bed' vs 'Sofa Beds', 'Coffee Table' vs 'Coffee Tables')
 */
export function getCategoryMeta(categoryName?: string | null): CategoryMeta {
  if (!categoryName) {
    return {
      description: 'Explore handcrafted British luxury beds, wardrobes, dining and living furniture.',
      heroImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop',
      fallbackImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop',
      badge: 'All Categories',
      subcategories: []
    };
  }

  // Exact match
  if (CATEGORY_DETAILS[categoryName]) {
    return CATEGORY_DETAILS[categoryName];
  }

  // Singular / Plural aliases
  const aliasMap: Record<string, string> = {
    'Sofa Bed': 'Sofa Beds',
    'Coffee Table': 'Coffee Tables',
    'Bed': 'Beds',
    'Mattress': 'Mattresses',
    'Sofa': 'Sofas',
    'Wardrobe': 'Wardrobes',
    'Sliding Wardrobe': 'Sliding Door Wardrobes',
    'Dining Table': 'Dining Tables',
    'Chest of Drawer': 'Chest of Drawers',
    'Bedside Unit': 'Bedside Units',
    'Dressing Table': 'Dressing Tables',
    'Other Furniture Unit': 'Other Furniture Units'
  };

  const targetKey = aliasMap[categoryName] || categoryName;
  if (CATEGORY_DETAILS[targetKey]) {
    return CATEGORY_DETAILS[targetKey];
  }

  return {
    description: `Explore our collection of handcrafted ${categoryName} designed for UK homes.`,
    heroImage: '/images/luxury/hero_showroom.jpg',
    fallbackImage: '/images/luxury/hero_showroom.jpg',
    badge: 'Featured',
    subcategories: []
  };
}

