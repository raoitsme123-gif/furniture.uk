import { Product } from '../types';
import { BED_FABRICS, SLIDING_WARDROBE_COLOURS, STANDARD_WARDROBE_COLOURS, CHEST_OF_DRAWERS_COLOURS } from './constants';

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Wardrobes (Dynamic Sizes, Measurements & Paragraph Description)
  {
    id: 'prod-amd-wd-001',
    name: 'Brand New Wardrobes – Available in Multiple Sizes and Colours',
    sku: 'AMD-WD-001',
    category: 'Wardrobes',
    subcategory: 'Hinged Mirrored Wardrobes',
    description: `Brand New Wardrobes – Available in Multiple Sizes and Colours\n\n• Available in 2, 3, 4, 5, 6 and 8 door options.\n\n• Available in Black, White, Grey, Oak and Walnut.\n\n• Exact measurements are displayed according to the selected wardrobe size.\n\n• Free Home Delivery Across the UK.\n\n• Cash on Delivery – No Advance Payment Required.\n\n• FREE Wardrobe Assembly Included.\n\n• Check your product before making payment. You are welcome to inspect your wardrobe upon delivery and pay only when you are satisfied with the product.`,
    price: 219,
    status: 'Published',
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [
      '2 Door Wardrobe',
      '3 Door Wardrobe',
      '4 Door Wardrobe',
      '5 Door Wardrobe',
      '6 Door Wardrobe',
      '8 Door Wardrobe'
    ],
    colours: STANDARD_WARDROBE_COLOURS,
    stockStatus: 'In Stock',
    dimensions: 'Exact measurements displayed per selected wardrobe size',
    material: 'Engineered High-Grade Solid Board & Metal Hardware',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-wd-02',
    name: 'Kensington Luxury Hinged Mirror Wardrobe',
    sku: 'AMD-WD-KEN04',
    category: 'Wardrobes',
    subcategory: '4 Door Wardrobes',
    description: `Brand New Wardrobes – Available in Multiple Sizes and Colours\n\n• Available in 2, 3, 4, 5, 6 and 8 door options.\n\n• Available in Black, White, Grey, Oak and Walnut.\n\n• Exact measurements are displayed according to the selected wardrobe size.\n\n• Free Home Delivery Across the UK.\n\n• Cash on Delivery – No Advance Payment Required.\n\n• FREE Wardrobe Assembly Included.\n\n• Check your product before making payment. You are welcome to inspect your wardrobe upon delivery and pay only when you are satisfied with the product.`,
    price: 389,
    status: 'Published',
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: [
      '2 Door Wardrobe',
      '3 Door Wardrobe',
      '4 Door Wardrobe',
      '5 Door Wardrobe',
      '6 Door Wardrobe',
      '8 Door Wardrobe'
    ],
    colours: STANDARD_WARDROBE_COLOURS,
    stockStatus: 'In Stock',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // 2. Bed Category (Exact Title & Paragraph Description)
  {
    id: 'prod-bed-01',
    name: 'Brand New Bed with Foam Mattress – Luxurious Super King, Optional Drawers – Free Home Delivery',
    sku: 'AMD-BED-AMB01',
    category: 'Beds',
    subcategory: 'Ambassador Beds',
    description: `Brand New Beds – Available in Multiple Sizes and Colours\n\n• Available in Single, Double, King and Super King sizes.\n\n• Available in a wide range of colours.\n\n• Available with or without a mattress.\n\n• Standard spring mattress included when a bed is purchased with a mattress.\n\n• Free Home Delivery Across the UK.\n\n• Cash on Delivery – No Advance Payment Required.\n\n• Optional storage drawers and mattress upgrades available at additional costs.`,
    price: 349,
    status: 'Published',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['Single', 'Double', 'King', 'Super King'],
    fabricGroups: ['Steel', 'Chenille', 'Crushed Velvet', 'Naples'],
    colours: [
      ...BED_FABRICS.Steel.colours,
      ...BED_FABRICS.Chenille.colours,
      ...BED_FABRICS['Crushed Velvet'].colours,
      ...BED_FABRICS.Naples.colours
    ],
    bedConfig: {
      sizes: ['Single', 'Double', 'King', 'Super King'],
      fabricGroups: ['Steel', 'Chenille', 'Crushed Velvet', 'Naples'],
      colours: [
        ...BED_FABRICS.Steel.colours,
        ...BED_FABRICS.Chenille.colours,
        ...BED_FABRICS['Crushed Velvet'].colours,
        ...BED_FABRICS.Naples.colours
      ],
      drawerOptions: [
        'No Drawers',
        '1 Storage Drawer',
        '2 Storage Drawers',
        '3 Storage Drawers',
        '4 Storage Drawers'
      ],
      mattressOptions: {
        enabled: true,
        options: ['Bed frame only', 'Standard spring mattress', 'Memory foam mattress', 'Orthopaedic mattress']
      }
    },
    stockStatus: 'In Stock',
    isFeatured: true,
    isNewArrival: true,
    dimensions: 'Headboard Height: 137cm (54 inches)',
    material: 'British Kiln-Dried Hardwood & Luxury Upholstery',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-bed-02',
    name: 'Linear Panel High Headboard Bed',
    sku: 'AMD-BED-LIN02',
    category: 'Beds',
    subcategory: 'Panel & Linear Beds',
    description: 'Sleek architectural design featuring vertical fluted upholstery panels. Minimalist modern luxury crafted with precision tailored seams and sturdy chrome glides.',
    price: 299,
    status: 'Published',
    images: [
      'https://images.unsplash.com/photo-1582582621959-48d27397dc69?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['Double (4ft6 x 6ft3)', 'King (5ft x 6ft6)', 'Super King (6ft x 6ft6)'],
    fabricGroups: ['Steel', 'Chenille', 'Naples'],
    colours: [
      ...BED_FABRICS.Steel.colours,
      ...BED_FABRICS.Chenille.colours,
      ...BED_FABRICS.Naples.colours
    ],
    bedConfig: {
      sizes: ['Double (4ft6 x 6ft3)', 'King (5ft x 6ft6)', 'Super King (6ft x 6ft6)'],
      fabricGroups: ['Steel', 'Chenille', 'Naples'],
      colours: [
        ...BED_FABRICS.Steel.colours,
        ...BED_FABRICS.Chenille.colours,
        ...BED_FABRICS.Naples.colours
      ],
      drawerOptions: [
        'No Drawers',
        '2 Drawers Same Side (Left)',
        '2 Drawers Same Side (Right)',
        '4 Drawers'
      ],
      mattressOptions: {
        enabled: true,
        options: ['Bed frame only', 'Standard spring mattress', 'Memory foam mattress', 'Orthopaedic mattress']
      }
    },
    stockStatus: 'In Stock',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-bed-03',
    name: 'Richmond Gas-Lift Ottoman Storage Bed',
    sku: 'AMD-BED-RIC03',
    category: 'Beds',
    subcategory: 'Ottoman Storage Beds',
    description: 'Deep storage hydraulic ottoman bed with whisper-quiet gas-lift pistons, reinforced slatted steel platform, and hand-tufted chesterfield wingback headboard.',
    price: 379,
    status: 'Published',
    images: [
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['Double (4ft6 x 6ft3)', 'King (5ft x 6ft6)', 'Super King (6ft x 6ft6)'],
    fabricGroups: ['Steel', 'Chenille', 'Naples'],
    colours: BED_FABRICS.Steel.colours.slice(0, 8),
    bedConfig: {
      sizes: ['Double (4ft6 x 6ft3)', 'King (5ft x 6ft6)', 'Super King (6ft x 6ft6)'],
      fabricGroups: ['Steel', 'Chenille', 'Naples'],
      colours: BED_FABRICS.Steel.colours.slice(0, 8),
      drawerOptions: ['No Drawers (Gas Lift System)'],
      mattressOptions: {
        enabled: true,
        options: ['Bed frame only', 'Standard spring mattress', 'Memory foam mattress', 'Orthopaedic mattress']
      }
    },
    stockStatus: 'In Stock',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // 3. Mattresses (Public Configured Price)
  {
    id: 'prod-mat-01',
    name: 'AMD Royal 2000 Pocket Ortho Mattress',
    sku: 'AMD-MAT-2000',
    category: 'Mattresses',
    subcategory: 'Pocket Sprung Mattresses',
    description: 'Engineered with 2,000 individually responsive pocket springs and multi-layered hypoallergenic fillings. Dual-sided hand-tufted design with breathable border vents for superior temperature regulation.',
    price: 269,
    status: 'Published',
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['Single (3ft)', 'Small Double (4ft)', 'Double (4ft6)', 'King (5ft)', 'Super King (6ft)'],
    colours: [{ name: 'Damask White & Silver Border', hex: '#FFFFFF' }],
    stockStatus: 'In Stock',
    isFeatured: true,
    material: '2000 Pocket Springs, Natural Cotton & Wool Blend',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // 4. Sofas (Public Configured Price)
  {
    id: 'prod-sofa-01',
    name: 'Chelsea Luxury 3-Seater Plush Velvet Sofa',
    sku: 'AMD-SOF-CHL03',
    category: 'Sofas',
    subcategory: '3-Seater Sofas',
    description: 'Deep-seat luxury sofa featuring high-resilience foam core cushions wrapped in duck feather topper. Elegant rolled arms with discreet brass stud detailing and tapered solid walnut feet.',
    price: 649,
    status: 'Published',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['3-Seater (W: 215cm)'],
    fabricGroups: ['Steel', 'Chenille'],
    colours: BED_FABRICS.Steel.colours.slice(0, 6),
    stockStatus: 'In Stock',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // 5. Sofa Beds (High-Quality Imagery, Click-Clack & Corner Options)
  {
    id: 'prod-sb-01',
    name: 'Mayfair Dual-Function Click-Clack Sofa Bed',
    sku: 'AMD-SB-MAY01',
    category: 'Sofa Beds',
    subcategory: 'Click-Clack Sofa Beds',
    description: 'Effortless 3-position mechanism converting from a stylish contemporary sofa into a supportive guest double bed in seconds. Finished in durable textured weave fabric with hidden storage compartment under the seat.',
    price: 389,
    status: 'Published',
    images: [
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=1200&auto=format&fit=crop',
      '/images/categories/sofa-beds.jpg'
    ],
    sizes: ['Double Sleeping Area (120 x 190cm)'],
    colours: [
      { name: 'Charcoal Grey', hex: '#36383E' },
      { name: 'Silver Slate', hex: '#7A7D84' },
      { name: 'Navy Blue', hex: '#1B2A4A' }
    ],
    stockStatus: 'In Stock',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-sb-02',
    name: 'Savoy Reversible Storage Corner Sofa Bed',
    sku: 'AMD-SB-SAV02',
    category: 'Sofa Beds',
    subcategory: 'Corner Sofa Beds',
    description: 'Universal L-shaped modular sofa bed with reversible chaise, large under-chaise bedding storage, and smooth pull-out bed conversion mattress for overnight guests.',
    price: 549,
    status: 'Published',
    images: [
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1200&auto=format&fit=crop',
      '/images/categories/sofa-beds.jpg'
    ],
    sizes: ['Corner: 235cm x 150cm (Bed: 140 x 200cm)'],
    colours: [
      { name: 'Warm Greige', hex: '#8C867A' },
      { name: 'Deep Midnight Black', hex: '#1C1917' },
      { name: 'Storm Grey', hex: '#57534E' }
    ],
    stockStatus: 'In Stock',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // 6. Sliding Door Wardrobes (Public Configured Price)
  {
    id: 'prod-sdw-01',
    name: 'Berlin Full Mirror 200cm Sliding Wardrobe',
    sku: 'AMD-SDW-BER20',
    category: 'Sliding Door Wardrobes',
    subcategory: 'Full Mirror Sliding Wardrobes',
    description: 'Grand 200cm sliding wardrobe with double full-length mirrored sliding doors. Includes 2 heavy-duty hanging rails, 8 adjustable storage shelves, and smooth German roller hardware.',
    price: 469,
    status: 'Published',
    images: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['150 cm', '180 cm', '200 cm', '250 cm'],
    colours: SLIDING_WARDROBE_COLOURS,
    stockStatus: 'In Stock',
    isFeatured: true,
    dimensions: 'W: 200cm, H: 215cm, D: 62cm',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // 7. Dining Tables (Public Configured Price)
  {
    id: 'prod-dt-01',
    name: 'Versailles Sintered Stone Dining Table & 6 Velvet Chairs',
    sku: 'AMD-DT-VER06',
    category: 'Dining Tables',
    subcategory: 'Sintered Stone Tables',
    description: 'Stunning heat, scratch, and stain-resistant sintered white marble stone top with sculptural black and brass geometric base. Includes 6 matching quilted velvet dining chairs.',
    price: 799,
    status: 'Published',
    images: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['160 cm (Seats 6)', '180 cm (Seats 8)'],
    colours: [
      { name: 'White Marble & Gold', hex: '#FAF9F6' },
      { name: 'Grey Marble & Black', hex: '#4A4A4A' }
    ],
    stockStatus: 'In Stock',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // 8. Chest of Drawers (Public Configured Price)
  {
    id: 'prod-cd-01',
    name: 'Windsor 5-Drawer High Gloss Chest',
    sku: 'AMD-CD-WIN05',
    category: 'Chest of Drawers',
    subcategory: '5-Drawer Tallboys',
    description: 'Modern vertical 5-tier chest of drawers with seamless integrated finger-pull handles, metal soft-glide runners, and anti-tip wall brackets included.',
    price: 189,
    status: 'Published',
    images: [
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['W: 80cm x H: 110cm x D: 45cm'],
    colours: CHEST_OF_DRAWERS_COLOURS,
    stockStatus: 'In Stock',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // 9. Bedside Units (Public Configured Price)
  {
    id: 'prod-bu-01',
    name: 'Milano 2-Drawer Upholstered Bedside Table',
    sku: 'AMD-BU-MIL02',
    category: 'Bedside Units',
    subcategory: '2-Drawer Nightstands',
    description: 'Handcrafted bedside cabinet upholstered to match our British bed frames. Features a protective tempered glass top and smooth ball-bearing drawers.',
    price: 99,
    status: 'Published',
    images: [
      'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['W: 45cm x H: 55cm x D: 40cm'],
    colours: BED_FABRICS.Steel.colours.slice(0, 6),
    stockStatus: 'In Stock',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // 10. Dressing Tables (Public Configured Price)
  {
    id: 'prod-drt-01',
    name: 'Regency Hollywood Vanity Table with LED Mirror',
    sku: 'AMD-DRT-REG01',
    category: 'Dressing Tables',
    subcategory: 'LED Touch Mirror Vanities',
    description: 'Glamour vanity dressing station with round multi-mode LED touch mirror (Warm, Natural, Cool daylight), twin storage drawers with velvet linings, and matching cushioned stool.',
    price: 279,
    status: 'Published',
    images: [
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['100 cm Width'],
    colours: [
      { name: 'Pure White & Gold', hex: '#FFFFFF' },
      { name: 'Cashmere Grey', hex: '#A8A6A1' }
    ],
    stockStatus: 'In Stock',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // 11. Coffee Tables (High-Quality Imagery, Fluted Wood & Round Marble Options)
  {
    id: 'prod-ct-01',
    name: 'Kyoto Fluted Wood & Sintered Stone Coffee Table',
    sku: 'AMD-CT-KYO01',
    category: 'Coffee Tables',
    subcategory: 'Fluted Wood Tables',
    description: 'Organic rounded coffee table with vertical tamboured fluted wood base and durable scratch-proof marble ceramic surface.',
    price: 169,
    status: 'Published',
    images: [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1200&auto=format&fit=crop',
      '/images/categories/coffee-tables.jpg'
    ],
    sizes: ['Dia: 80cm x H: 45cm'],
    colours: [
      { name: 'Natural Oak', hex: '#C19A6B' },
      { name: 'Smoked Walnut', hex: '#5C4033' },
      { name: 'Matte Black', hex: '#1A1A1A' }
    ],
    stockStatus: 'In Stock',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-ct-02',
    name: 'Mayfair Calacatta Marble & Brushed Brass Coffee Table',
    sku: 'AMD-CT-MAY02',
    category: 'Coffee Tables',
    subcategory: 'Round Marble Coffee Tables',
    description: 'Luxury round coffee table showcasing genuine Calacatta marble patterning, hand-polished chamfered edge, and architectural brushed satin brass frame.',
    price: 219,
    status: 'Published',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop',
      '/images/categories/coffee-tables.jpg'
    ],
    sizes: ['Dia: 90cm x H: 42cm'],
    colours: [
      { name: 'White Calacatta & Brass', hex: '#FAF9F6' },
      { name: 'Nero Black Marble & Brass', hex: '#1C1917' }
    ],
    stockStatus: 'In Stock',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // 12. Other Furniture Units (Public Configured Price)
  {
    id: 'prod-oth-01',
    name: 'Ascot Deep Buttoned Storage Ottoman Blanket Box',
    sku: 'AMD-OTH-ASC01',
    category: 'Other Furniture Units',
    subcategory: 'Storage Ottomans & Blanket Boxes',
    description: 'Deep buttoned foot-of-bed or hallway storage ottoman with soft-close gas-strut hinges. Perfect for linen, duvets, and pillows.',
    price: 119,
    status: 'Published',
    images: [
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['W: 100cm', 'W: 120cm', 'W: 140cm'],
    fabricGroups: ['Steel', 'Chenille', 'Crushed Velvet'],
    colours: BED_FABRICS.Steel.colours.slice(0, 6),
    stockStatus: 'In Stock',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
