import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import crypto from 'crypto';
import JSZip from 'jszip';
import { fileURLToPath } from 'url';
import { Product, SiteSettings, PostcodeZone, DeliveryBooking } from './src/types';
import { INITIAL_PRODUCTS } from './src/data/seedProducts';
import { DEFAULT_SITE_SETTINGS, INITIAL_POSTCODE_ZONES } from './src/data/constants';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const UPLOADS_DIR = path.resolve(DATA_DIR, 'uploads');
const SRC_DATA_DIR = path.resolve(__dirname, 'src', 'data');
const PUBLIC_DIR = path.resolve(__dirname, 'public');
const PUBLIC_DATA_DIR = path.resolve(PUBLIC_DIR, 'data');
const PUBLIC_PRODUCTS_IMAGES_DIR = path.resolve(PUBLIC_DIR, 'images', 'products');

const PRODUCTS_FILE = path.resolve(DATA_DIR, 'products.json');
const SRC_PRODUCTS_FILE = path.resolve(SRC_DATA_DIR, 'products.json');
const PUBLIC_PRODUCTS_FILE = path.resolve(PUBLIC_DATA_DIR, 'products.json');
const SETTINGS_FILE = path.resolve(DATA_DIR, 'settings.json');
const POSTCODES_FILE = path.resolve(DATA_DIR, 'postcodes.json');
const BOOKINGS_FILE = path.resolve(DATA_DIR, 'bookings.json');
const AUTH_FILE = path.resolve(DATA_DIR, 'auth.json');

// Ensure all persistent and source directories exist
[DATA_DIR, UPLOADS_DIR, SRC_DATA_DIR, PUBLIC_DIR, PUBLIC_DATA_DIR, PUBLIC_PRODUCTS_IMAGES_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Helper data accessors
function readJson<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return fallback;
}

function writeJson<T>(filePath: string, data: T) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const tmpPath = `${filePath}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmpPath, filePath);
}

// Initial seed loading
function initFileIfMissing<T>(filePath: string, defaultData: T) {
  if (!fs.existsSync(filePath)) {
    writeJson(filePath, defaultData);
  }
}

// Ensure products source file is initialized
initFileIfMissing(SRC_PRODUCTS_FILE, INITIAL_PRODUCTS);
initFileIfMissing(PUBLIC_PRODUCTS_FILE, INITIAL_PRODUCTS);

// Prefer SRC_PRODUCTS_FILE if exists, then DATA_DIR
const initialProductData = readJson<Product[]>(SRC_PRODUCTS_FILE, INITIAL_PRODUCTS);
initFileIfMissing(PRODUCTS_FILE, initialProductData);
initFileIfMissing(SETTINGS_FILE, DEFAULT_SITE_SETTINGS);
initFileIfMissing(POSTCODES_FILE, INITIAL_POSTCODE_ZONES);
initFileIfMissing(BOOKINGS_FILE, []);
initFileIfMissing(AUTH_FILE, {
  adminPassword: process.env.ADMIN_PASSWORD || 'AMD@Furniture2026',
  activeSessions: [] as string[]
});

/**
 * CRITICAL: Automatic Product-to-Source-Code Saving Function
 * Automatically transfers every product added, edited, or deleted into
 * the project source files:
 * 1. data/products.json (Runtime server)
 * 2. src/data/products.json (Source code repository)
 * 3. public/data/products.json (Static Netlify export build)
 */
function saveProductsCatalogue(products: Product[]) {
  // 1. Server runtime persistence
  writeJson(PRODUCTS_FILE, products);

  // 2. Direct Source Code File persistence
  try {
    writeJson(SRC_PRODUCTS_FILE, products);
  } catch (err) {
    console.warn('Warning: Could not sync to src/data/products.json:', err);
  }

  // 3. Static Netlify / public directory persistence
  try {
    writeJson(PUBLIC_PRODUCTS_FILE, products);
  } catch (err) {
    console.warn('Warning: Could not sync to public/data/products.json:', err);
  }
}

// Multer Storage Configuration: Saves uploaded pictures directly into public/images/products/
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, PUBLIC_PRODUCTS_IMAGES_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .slice(0, 30);
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    cb(null, `${safeBase}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|webp)$/i;
    if (allowed.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image format. Supported types: JPG, JPEG, PNG, WebP.'));
    }
  }
});

// Product sanitization helper
function sanitizeProductForPublic(product: Product): Product {
  const cloned = { ...product };
  if (cloned.price !== undefined && cloned.price !== null) {
    cloned.displayPrice = cloned.category === 'Beds' ? `From £${cloned.price}` : `£${cloned.price}`;
  } else {
    cloned.displayPrice = 'Contact us for price.';
  }
  return cloned;
}

// Authentication middleware
function verifyAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Admin credentials required.' });
  }
  const token = authHeader.split(' ')[1];
  const authData = readJson<{ adminPassword: string; activeSessions: string[] }>(AUTH_FILE, {
    adminPassword: 'AMD@Furniture2026',
    activeSessions: []
  });

  if (!authData.activeSessions.includes(token)) {
    return res.status(401).json({ error: 'Session expired or invalid. Please re-enter your password.' });
  }
  next();
}

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Serve uploaded images statically both from public/images and data/uploads
  app.use('/images', express.static(path.resolve(PUBLIC_DIR, 'images')));
  app.use('/images/products', express.static(PUBLIC_PRODUCTS_IMAGES_DIR));
  app.use('/uploads', express.static(UPLOADS_DIR));
  app.use('/data', express.static(PUBLIC_DATA_DIR));
  app.use(express.static(PUBLIC_DIR));

  // --- AUTH ENDPOINTS ---
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }
    const authData = readJson<{ adminPassword: string; activeSessions: string[] }>(AUTH_FILE, {
      adminPassword: 'AMD@Furniture2026',
      activeSessions: []
    });

    if (password === authData.adminPassword) {
      const token = `amd_sess_${crypto.randomBytes(32).toString('hex')}`;
      authData.activeSessions.push(token);
      if (authData.activeSessions.length > 50) {
        authData.activeSessions.shift();
      }
      writeJson(AUTH_FILE, authData);
      return res.json({ success: true, token, message: 'Authentication successful.' });
    } else {
      return res.status(401).json({ error: 'Incorrect administrator password.' });
    }
  });

  app.get('/api/auth/verify', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({ authenticated: false });
    }
    const token = authHeader.split(' ')[1];
    const authData = readJson<{ adminPassword: string; activeSessions: string[] }>(AUTH_FILE, {
      adminPassword: 'AMD@Furniture2026',
      activeSessions: []
    });
    const authenticated = authData.activeSessions.includes(token);
    res.json({ authenticated });
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const authData = readJson<{ adminPassword: string; activeSessions: string[] }>(AUTH_FILE, {
        adminPassword: 'AMD@Furniture2026',
        activeSessions: []
      });
      authData.activeSessions = authData.activeSessions.filter(s => s !== token);
      writeJson(AUTH_FILE, authData);
    }
    res.json({ success: true });
  });

  app.post('/api/auth/change-password', verifyAdmin, (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    }
    const authData = readJson<{ adminPassword: string; activeSessions: string[] }>(AUTH_FILE, {
      adminPassword: 'AMD@Furniture2026',
      activeSessions: []
    });
    if (currentPassword !== authData.adminPassword) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }
    authData.adminPassword = newPassword;
    writeJson(AUTH_FILE, authData);
    res.json({ success: true, message: 'Admin password updated successfully.' });
  });

  // --- PUBLIC PRODUCT ENDPOINTS ---
  app.get('/api/products', (_req: Request, res: Response) => {
    const products = readJson<Product[]>(PRODUCTS_FILE, []);
    const published = products.filter(p => p.status === 'Published');
    const sanitized = published.map(sanitizeProductForPublic);
    res.json({ products: sanitized, total: sanitized.length });
  });

  app.get('/api/products/:id', (req: Request, res: Response) => {
    const products = readJson<Product[]>(PRODUCTS_FILE, []);
    const product = products.find(p => p.id === req.params.id || p.sku.toLowerCase() === req.params.id.toLowerCase());
    if (!product || product.status !== 'Published') {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ product: sanitizeProductForPublic(product) });
  });

  // --- PROTECTED ADMIN PRODUCT ENDPOINTS ---
  app.get('/api/admin/products', verifyAdmin, (_req: Request, res: Response) => {
    const products = readJson<Product[]>(PRODUCTS_FILE, []);
    res.json({ products, total: products.length });
  });

  app.post('/api/admin/products', verifyAdmin, (req: Request, res: Response) => {
    const products = readJson<Product[]>(PRODUCTS_FILE, []);
    const data = req.body;

    if (!data.name || !data.sku || !data.category) {
      return res.status(400).json({ error: 'Name, SKU, and Category are required.' });
    }

    // Check duplicate SKU
    const existing = products.find(p => p.sku.trim().toLowerCase() === data.sku.trim().toLowerCase());
    if (existing) {
      return res.status(409).json({ error: `SKU '${data.sku}' already exists. SKUs must be unique.` });
    }

    const newProduct: Product = {
      id: `prod_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      name: data.name.trim(),
      sku: data.sku.trim().toUpperCase(),
      category: data.category,
      subcategory: data.subcategory ? String(data.subcategory).trim() : undefined,
      description: data.description || '',
      price: data.price !== undefined && data.price !== null ? Number(data.price) : undefined,
      status: data.status === 'Published' ? 'Published' : 'Draft',
      images: Array.isArray(data.images) ? data.images.slice(0, 3) : [],
      sizes: Array.isArray(data.sizes) ? data.sizes : [],
      colours: Array.isArray(data.colours) ? data.colours : [],
      fabricGroups: Array.isArray(data.fabricGroups) ? data.fabricGroups : undefined,
      bedConfig: data.bedConfig || undefined,
      stockStatus: data.stockStatus || 'In Stock',
      isFeatured: !!data.isFeatured,
      isNewArrival: !!data.isNewArrival,
      dimensions: data.dimensions || '',
      material: data.material || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    products.unshift(newProduct);
    // CRITICAL: Synchronize to source code files automatically!
    saveProductsCatalogue(products);

    res.status(201).json({ success: true, product: newProduct });
  });

  app.put('/api/admin/products/:id', verifyAdmin, (req: Request, res: Response) => {
    const products = readJson<Product[]>(PRODUCTS_FILE, []);
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const data = req.body;
    // Check duplicate SKU if changed
    if (data.sku && data.sku.trim().toUpperCase() !== products[index].sku) {
      const duplicate = products.find(
        p => p.id !== req.params.id && p.sku.trim().toLowerCase() === data.sku.trim().toLowerCase()
      );
      if (duplicate) {
        return res.status(409).json({ error: `SKU '${data.sku}' already belongs to another product.` });
      }
    }

    const updated: Product = {
      ...products[index],
      ...data,
      id: products[index].id,
      sku: data.sku ? data.sku.trim().toUpperCase() : products[index].sku,
      subcategory: data.subcategory !== undefined ? (data.subcategory ? String(data.subcategory).trim() : undefined) : products[index].subcategory,
      images: Array.isArray(data.images) ? data.images.slice(0, 3) : products[index].images,
      price: data.price !== undefined && data.price !== null ? Number(data.price) : products[index].price,
      updatedAt: new Date().toISOString()
    };

    products[index] = updated;
    // CRITICAL: Synchronize to source code files automatically!
    saveProductsCatalogue(products);

    res.json({ success: true, product: updated });
  });

  app.delete('/api/admin/products/:id', verifyAdmin, (req: Request, res: Response) => {
    const products = readJson<Product[]>(PRODUCTS_FILE, []);
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const deleted = products.splice(index, 1)[0];
    // CRITICAL: Synchronize to source code files automatically!
    saveProductsCatalogue(products);

    res.json({ success: true, message: `Product '${deleted.name}' deleted successfully.` });
  });

  // --- IMAGE UPLOAD ENDPOINT: SAVES TO public/images/products/ (SOURCE FILES) ---
  app.post('/api/upload', verifyAdmin, upload.array('images', 3), (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No image files selected.' });
    }

    // Also copy to data/uploads for backwards compatibility
    for (const f of files) {
      try {
        const dest = path.resolve(UPLOADS_DIR, f.filename);
        fs.copyFileSync(f.path, dest);
      } catch (err) {
        console.warn('Backup copy to uploads failed:', err);
      }
    }

    const uploaded = files.map(f => ({
      originalName: f.originalname,
      filename: f.filename,
      // Public path served by Vite in dev and directly bundled on Netlify!
      url: `/images/products/${f.filename}`,
      size: f.size
    }));

    res.json({
      success: true,
      files: uploaded,
      urls: uploaded.map(u => u.url)
    });
  });

  // --- ONE-CLICK EXPORT COMPLETE CATALOGUE AS ZIP (FOR NETLIFY DEPLOYMENT) ---
  app.get('/api/admin/catalogue/export-zip', verifyAdmin, async (_req: Request, res: Response) => {
    try {
      const zip = new JSZip();
      const products = readJson<Product[]>(PRODUCTS_FILE, []);

      // 1. Add complete products.json
      zip.file('src/data/products.json', JSON.stringify(products, null, 2));
      zip.file('public/data/products.json', JSON.stringify(products, null, 2));

      // 2. Add all image files in public/images/products
      if (fs.existsSync(PUBLIC_PRODUCTS_IMAGES_DIR)) {
        const imageFiles = fs.readdirSync(PUBLIC_PRODUCTS_IMAGES_DIR);
        for (const file of imageFiles) {
          const filePath = path.resolve(PUBLIC_PRODUCTS_IMAGES_DIR, file);
          const stat = fs.statSync(filePath);
          if (stat.isFile()) {
            const fileData = fs.readFileSync(filePath);
            zip.file(`public/images/products/${file}`, fileData);
          }
        }
      }

      // 3. Add Netlify deployment instructions README
      const readme = `# AMD FURNITURE UK - COMPLETE CATALOGUE EXPORT PACKAGE

This archive contains all ${products.length} products and their uploaded images added via the AMD Furniture UK admin panel.

## Folder Structure
- \`src/data/products.json\`: The master catalogue file.
- \`public/data/products.json\`: Static catalogue fallback for Netlify.
- \`public/images/products/\`: All uploaded product images.

## Netlify Deployment Steps:
1. Extract this zip file into your AMD Furniture UK project folder to ensure all latest products and images are updated.
2. Run \`npm run build\` to verify production build.
3. Push to your Git repository (GitHub / GitLab) connected to Netlify, or drag-and-drop the \`dist\` folder into Netlify.
4. Your website is live with all products, colors, swatches, and images!
`;
      zip.file('README_NETLIFY_DEPLOYMENT.md', readme);

      const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="amd_furniture_catalogue_source_package_${new Date().toISOString().split('T')[0]}.zip"`
      );
      res.send(buffer);
    } catch (err: any) {
      console.error('Error generating catalogue ZIP:', err);
      res.status(500).json({ error: 'Failed to generate catalogue ZIP file' });
    }
  });

  // --- JSON EXPORT & IMPORT ---
  app.get('/api/admin/catalogue/export-json', verifyAdmin, (_req: Request, res: Response) => {
    const products = readJson<Product[]>(PRODUCTS_FILE, []);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="amd_products_${new Date().toISOString().split('T')[0]}.json"`
    );
    res.send(JSON.stringify(products, null, 2));
  });

  app.post('/api/admin/catalogue/import-json', verifyAdmin, (req: Request, res: Response) => {
    const { products: incoming } = req.body;
    if (!Array.isArray(incoming)) {
      return res.status(400).json({ error: 'Invalid format. Expected JSON array of products.' });
    }

    const current = readJson<Product[]>(PRODUCTS_FILE, []);
    const existingSkus = new Set(current.map(p => p.sku.toLowerCase()));

    let imported = 0;
    let skipped = 0;

    for (const item of incoming) {
      if (!item.name || !item.sku || !item.category) {
        skipped++;
        continue;
      }
      if (existingSkus.has(item.sku.toLowerCase())) {
        // Update existing product
        const idx = current.findIndex(p => p.sku.toLowerCase() === item.sku.toLowerCase());
        if (idx !== -1) {
          current[idx] = { ...current[idx], ...item, updatedAt: new Date().toISOString() };
          imported++;
        }
      } else {
        current.push({
          ...item,
          id: item.id || `prod_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        existingSkus.add(item.sku.toLowerCase());
        imported++;
      }
    }

    saveProductsCatalogue(current);
    res.json({ success: true, imported, skipped, total: current.length });
  });

  // --- SETTINGS & PRICING ENDPOINTS ---
  app.get('/api/settings', (_req: Request, res: Response) => {
    const settings = readJson<SiteSettings>(SETTINGS_FILE, DEFAULT_SITE_SETTINGS);
    const publicSettings = {
      announcementText: settings.announcementText,
      announcementEnabled: settings.announcementEnabled,
      whatsappNumber: settings.whatsappNumber,
      storePhone: settings.storePhone,
      storeEmail: settings.storeEmail,
      storeAddress: settings.storeAddress,
      nextDayCutoffTime: settings.nextDayCutoffTime,
      deliveryGuaranteeNotice: settings.deliveryGuaranteeNotice
    };
    res.json({ settings: publicSettings });
  });

  app.get('/api/admin/settings', verifyAdmin, (_req: Request, res: Response) => {
    const settings = readJson<SiteSettings>(SETTINGS_FILE, DEFAULT_SITE_SETTINGS);
    res.json({ settings });
  });

  app.put('/api/admin/settings', verifyAdmin, (req: Request, res: Response) => {
    const current = readJson<SiteSettings>(SETTINGS_FILE, DEFAULT_SITE_SETTINGS);
    const updated = { ...current, ...req.body };
    writeJson(SETTINGS_FILE, updated);
    res.json({ success: true, settings: updated });
  });

  // --- POSTCODES & DELIVERY ROUTE ENDPOINTS ---
  app.get('/api/postcodes', (_req: Request, res: Response) => {
    const zones = readJson<PostcodeZone[]>(POSTCODES_FILE, INITIAL_POSTCODE_ZONES);
    res.json({ zones });
  });

  app.post('/api/postcodes/check', (req: Request, res: Response) => {
    const { postcode } = req.body;
    if (!postcode || typeof postcode !== 'string') {
      return res.status(400).json({ error: 'Please enter a valid UK postcode.' });
    }

    const clean = postcode.toUpperCase().replace(/\s+/g, '');
    const zones = readJson<PostcodeZone[]>(POSTCODES_FILE, INITIAL_POSTCODE_ZONES);
    const sortedZones = [...zones].sort((a, b) => b.prefix.length - a.prefix.length);

    let match: PostcodeZone | null = null;
    for (const z of sortedZones) {
      if (clean.startsWith(z.prefix.toUpperCase())) {
        match = z;
        break;
      }
    }

    const isGlasgow = clean.startsWith('G');
    const isLocal7Day = !!(match && (match.isLocal7Day || match.region.includes('Local Sides')));

    if (match) {
      return res.json({
        found: true,
        postcode: postcode.toUpperCase(),
        prefix: match.prefix,
        city: match.city || '',
        region: match.region,
        status: match.status,
        estimatedDays: match.estimatedDays,
        surcharge: match.surcharge,
        isGlasgow,
        isLocal7Day,
        notes: match.notes,
        isNextDayEligible: isLocal7Day || match.region.includes('London') || isGlasgow,
        cutoffNotice: isLocal7Day
          ? '7 DAYS DELIVERY ROUTES (EVERYDAY) - Next day deliveries till 7:00 PM: you can send orders for next day!'
          : 'Standard UK delivery route. Estimated 1-2 working days.'
      });
    }

    return res.json({
      found: false,
      postcode: postcode.toUpperCase(),
      region: 'UK Mainland Extended Delivery Area',
      status: 'Eligible',
      estimatedDays: '2-3 Working Days',
      surcharge: 0,
      isGlasgow: false,
      isLocal7Day: false,
      notes: 'AMD Furniture delivers UK-wide. Final delivery time arranged after order confirmation.'
    });
  });

  app.post('/api/admin/postcodes', verifyAdmin, (req: Request, res: Response) => {
    const zones = req.body.zones;
    if (!Array.isArray(zones)) {
      return res.status(400).json({ error: 'Zones array is required.' });
    }
    writeJson(POSTCODES_FILE, zones);
    res.json({ success: true, zones });
  });

  // --- ADVANCE DELIVERY BOOKINGS ENDPOINTS ---
  app.post('/api/bookings', (req: Request, res: Response) => {
    const bookings = readJson<DeliveryBooking[]>(BOOKINGS_FILE, []);
    const data = req.body;

    if (!data.customerName || !data.customerPhone || !data.postcode) {
      return res.status(400).json({ error: 'Customer name, phone number, and postcode are required.' });
    }

    const newBooking: DeliveryBooking = {
      id: `bk_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      productName: data.productName || 'General Enquiry',
      sku: data.sku || 'N/A',
      category: data.category || 'Beds',
      customerName: data.customerName.trim(),
      customerPhone: data.customerPhone.trim(),
      postcode: data.postcode.trim().toUpperCase(),
      preferredDate: data.preferredDate || 'Earliest Available',
      bedSelections: data.bedSelections,
      wardrobeSelections: data.wardrobeSelections,
      status: 'Requested',
      notes: data.notes || '',
      createdAt: new Date().toISOString()
    };

    bookings.unshift(newBooking);
    writeJson(BOOKINGS_FILE, bookings);
    res.status(201).json({ success: true, booking: newBooking });
  });

  app.get('/api/admin/bookings', verifyAdmin, (_req: Request, res: Response) => {
    const bookings = readJson<DeliveryBooking[]>(BOOKINGS_FILE, []);
    res.json({ bookings, total: bookings.length });
  });

  app.put('/api/admin/bookings/:id', verifyAdmin, (req: Request, res: Response) => {
    const bookings = readJson<DeliveryBooking[]>(BOOKINGS_FILE, []);
    const index = bookings.findIndex(b => b.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    bookings[index] = {
      ...bookings[index],
      ...req.body
    };
    writeJson(BOOKINGS_FILE, bookings);
    res.json({ success: true, booking: bookings[index] });
  });

  // --- BULK CSV IMPORT / EXPORT (600+ RECORDS) ---
  app.post('/api/csv/import', verifyAdmin, (req: Request, res: Response) => {
    const { csvContent } = req.body;
    if (!csvContent || typeof csvContent !== 'string') {
      return res.status(400).json({ error: 'CSV content is missing.' });
    }

    const lines = csvContent
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      return res.status(400).json({ error: 'CSV file must have a header row and at least 1 data row.' });
    }

    function parseCSVLine(text: string): string[] {
      const values: string[] = [];
      let inQuote = false;
      let curr = '';
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '"' || char === "'") {
          inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
          values.push(curr.trim());
          curr = '';
        } else {
          curr += char;
        }
      }
      values.push(curr.trim());
      return values.map(v => v.replace(/^["']|["']$/g, '').trim());
    }

    const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase());
    const requiredHeaders = ['name', 'sku', 'category'];
    const missing = requiredHeaders.filter(h => !headers.includes(h));
    if (missing.length > 0) {
      return res.status(400).json({
        error: `CSV missing required headers: ${missing.join(', ')}. Expected: name, sku, category, price, sizes, colours, description, status`
      });
    }

    const nameIdx = headers.indexOf('name');
    const skuIdx = headers.indexOf('sku');
    const catIdx = headers.indexOf('category');
    const subcatIdx = headers.indexOf('subcategory') !== -1 ? headers.indexOf('subcategory') : headers.indexOf('sub_category');
    const priceIdx = headers.indexOf('price');
    const sizesIdx = headers.indexOf('sizes');
    const coloursIdx = headers.indexOf('colours');
    const descIdx = headers.indexOf('description');
    const statusIdx = headers.indexOf('status');
    const imageIdx = headers.indexOf('images');

    const products = readJson<Product[]>(PRODUCTS_FILE, []);
    const existingSkus = new Set(products.map(p => p.sku.toLowerCase()));
    const seenCsvSkus = new Set<string>();

    const errors: Array<{ row: number; sku?: string; message: string }> = [];
    const newProducts: Product[] = [];

    for (let i = 1; i < lines.length; i++) {
      const rowNum = i + 1;
      const values = parseCSVLine(lines[i]);
      if (values.length <= 1) continue;

      const name = values[nameIdx] || '';
      const sku = (values[skuIdx] || '').toUpperCase();
      const category = values[catIdx] as any;
      const subcategory = subcatIdx !== -1 && values[subcatIdx] ? values[subcatIdx].trim() : undefined;
      const priceRaw = priceIdx !== -1 ? values[priceIdx] : '';
      const sizesRaw = sizesIdx !== -1 ? values[sizesIdx] : '';
      const coloursRaw = coloursIdx !== -1 ? values[coloursIdx] : '';
      const desc = descIdx !== -1 ? values[descIdx] : '';
      const statusRaw = statusIdx !== -1 ? values[statusIdx] : 'Published';
      const imagesRaw = imageIdx !== -1 ? values[imageIdx] : '';

      if (!name) {
        errors.push({ row: rowNum, sku, message: 'Missing product name' });
        continue;
      }
      if (!sku) {
        errors.push({ row: rowNum, sku, message: 'Missing SKU' });
        continue;
      }
      if (existingSkus.has(sku.toLowerCase())) {
        errors.push({ row: rowNum, sku, message: `Duplicate SKU '${sku}' already exists in database.` });
        continue;
      }
      if (seenCsvSkus.has(sku.toLowerCase())) {
        errors.push({ row: rowNum, sku, message: `Duplicate SKU '${sku}' appears multiple times in CSV.` });
        continue;
      }

      seenCsvSkus.add(sku.toLowerCase());
      existingSkus.add(sku.toLowerCase());

      const parsedPrice = priceRaw ? parseFloat(priceRaw.replace(/[£$,]/g, '')) : undefined;
      const parsedSizes = sizesRaw ? sizesRaw.split('|').map(s => s.trim()).filter(Boolean) : [];
      const parsedColours = coloursRaw
        ? coloursRaw.split('|').map(c => ({ name: c.trim(), hex: '#808080' })).filter(c => c.name)
        : [];
      const parsedImages = imagesRaw ? imagesRaw.split('|').map(im => im.trim()).filter(Boolean).slice(0, 3) : [];

      newProducts.push({
        id: `prod_csv_${Date.now()}_${i}_${crypto.randomBytes(2).toString('hex')}`,
        name,
        sku,
        category: category || 'Other Furniture Units',
        subcategory,
        description: desc,
        price: isNaN(parsedPrice as number) ? undefined : parsedPrice,
        status: statusRaw.toLowerCase() === 'draft' ? 'Draft' : 'Published',
        images: parsedImages,
        sizes: parsedSizes,
        colours: parsedColours,
        stockStatus: 'In Stock',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    if (newProducts.length > 0) {
      products.push(...newProducts);
      saveProductsCatalogue(products);
    }

    res.json({
      success: true,
      importedCount: newProducts.length,
      errorCount: errors.length,
      errors,
      totalRowsProcessed: lines.length - 1
    });
  });

  app.get('/api/csv/export', verifyAdmin, (_req: Request, res: Response) => {
    const products = readJson<Product[]>(PRODUCTS_FILE, []);
    const headers = ['name', 'sku', 'category', 'subcategory', 'price', 'status', 'sizes', 'colours', 'images', 'description'];
    const rows = products.map(p => {
      return [
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.sku}"`,
        `"${p.category}"`,
        `"${(p.subcategory || '').replace(/"/g, '""')}"`,
        p.price !== undefined && p.price !== null ? p.price : '',
        `"${p.status}"`,
        `"${(p.sizes || []).join('|')}"`,
        `"${(p.colours || []).map(c => c.name).join('|')}"`,
        `"${(p.images || []).join('|')}"`,
        `"${(p.description || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="amd_furniture_catalog.csv"');
    res.send(csv);
  });

  // --- VITE DEV OR PROD HANDLER ---
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AMD Furniture UK Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
