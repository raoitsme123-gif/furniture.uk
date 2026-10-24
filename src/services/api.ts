import { Product, SiteSettings, PostcodeZone, DeliveryBooking } from '../types';
import { DEFAULT_SITE_SETTINGS } from '../data/constants';

const TOKEN_KEY = 'amd_admin_token';

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const authHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Bed price sanitization helper for static Netlify fallback
function sanitizeStaticProduct(product: Product): Product {
  const cloned = { ...product };
  if (cloned.category === 'Beds') {
    delete cloned.price;
    cloned.displayPrice = 'Price on WhatsApp — Please enquire.';
  } else {
    if (cloned.price !== undefined && cloned.price !== null) {
      cloned.displayPrice = `£${cloned.price}`;
    } else {
      cloned.displayPrice = 'Contact us for price.';
    }
  }
  return cloned;
}

let cachedProducts: { products: Product[]; total: number; timestamp: number } | null = null;

export const api = {
  // Public
  async getProducts(forceRefresh = false): Promise<{ products: Product[]; total: number }> {
    // 0. Return instant memory cache if fresh (< 60s) and not forced
    const now = Date.now();
    if (!forceRefresh && cachedProducts && (now - cachedProducts.timestamp < 60000)) {
      return { products: cachedProducts.products, total: cachedProducts.total };
    }

    // Try reading from sessionStorage for instant refresh rate
    if (!forceRefresh && !cachedProducts && typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('amd_products_cache');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (now - parsed.timestamp < 120000) {
            cachedProducts = parsed;
            // Return cached immediately while revalidating in background
            setTimeout(() => { api.getProducts(true).catch(() => {}); }, 100);
            return { products: parsed.products, total: parsed.total };
          }
        }
      } catch {
        // Ignore storage errors
      }
    }

    // 1. Try server API
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        cachedProducts = { products: data.products, total: data.total, timestamp: Date.now() };
        if (typeof window !== 'undefined') {
          try {
            sessionStorage.setItem('amd_products_cache', JSON.stringify(cachedProducts));
          } catch {
            // Ignore quota errors
          }
        }
        return data;
      }
    } catch {
      // Backend not running (e.g. static Netlify build)
    }

    // 2. Fallback to static JSON file (for Netlify production)
    try {
      const staticRes = await fetch('/data/products.json');
      if (staticRes.ok) {
        const rawProducts: Product[] = await staticRes.json();
        const published = rawProducts.filter(p => p.status === 'Published');
        const sanitized = published.map(sanitizeStaticProduct);
        const data = { products: sanitized, total: sanitized.length };
        cachedProducts = { ...data, timestamp: Date.now() };
        return data;
      }
    } catch (err) {
      console.warn('Could not fetch /data/products.json static fallback:', err);
    }

    if (cachedProducts) {
      return { products: cachedProducts.products, total: cachedProducts.total };
    }

    return { products: [], total: 0 };
  },

  async getProduct(id: string): Promise<{ product: Product }> {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Static fallback
    }

    // Static fallback
    const { products } = await api.getProducts();
    const found = products.find(p => p.id === id || p.sku.toLowerCase() === id.toLowerCase());
    if (found) {
      return { product: found };
    }
    throw new Error('Product not found');
  },

  async getSettings(): Promise<{ settings: SiteSettings }> {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return { settings: DEFAULT_SITE_SETTINGS };
  },

  async checkPostcode(postcode: string): Promise<any> {
    try {
      const res = await fetch('/api/postcodes/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postcode })
      });
      if (res.ok) return await res.json();
    } catch {
      // Offline / static calculation
    }

    const clean = postcode.toUpperCase().replace(/\s+/g, '');
    const isGlasgow = clean.startsWith('G');
    return {
      found: true,
      postcode: postcode.toUpperCase(),
      region: isGlasgow ? 'Scotland (Glasgow Metro & Clyde)' : 'United Kingdom Nationwide',
      status: 'Eligible',
      estimatedDays: isGlasgow ? '1-2 Days (Glasgow Direct Route)' : '2-3 Days',
      surcharge: 0,
      isGlasgow,
      notes: isGlasgow ? 'Direct Glasgow route active. Priority scheduled delivery.' : 'UK-wide delivery available.',
      isNextDayEligible: isGlasgow
    };
  },

  async submitBooking(data: Partial<DeliveryBooking>): Promise<{ success: boolean; booking: DeliveryBooking }> {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch {
      // Netlify static offline fallback
    }
    return {
      success: true,
      booking: {
        id: `bk_${Date.now()}`,
        productName: data.productName || '',
        sku: data.sku || '',
        customerName: data.customerName || '',
        customerPhone: data.customerPhone || '',
        postcode: data.postcode || '',
        preferredDate: data.preferredDate || '',
        category: data.category || 'Beds',
        status: 'Requested',
        createdAt: new Date().toISOString()
      }
    };
  },

  // Admin Auth
  async adminLogin(password: string): Promise<{ success: boolean; token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Login failed');
    setAuthToken(json.token);
    return json;
  },

  async adminVerify(): Promise<boolean> {
    const token = getAuthToken();
    if (!token) return false;
    try {
      const res = await fetch('/api/auth/verify', {
        headers: authHeaders()
      });
      const data = await res.json();
      return !!data.authenticated;
    } catch {
      return false;
    }
  },

  async adminLogout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: authHeaders()
      });
    } finally {
      clearAuthToken();
    }
  },

  async adminChangePassword(currentPassword: string, newPassword: string): Promise<any> {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to change password');
    return json;
  },

  // Admin Products
  async adminGetProducts(): Promise<{ products: Product[]; total: number }> {
    const res = await fetch('/api/admin/products', {
      headers: authHeaders()
    });
    if (!res.ok) throw new Error('Unauthorized or failed to load products');
    return res.json();
  },

  async adminCreateProduct(data: Partial<Product>): Promise<{ success: boolean; product: Product }> {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create product');
    return json;
  },

  async adminUpdateProduct(id: string, data: Partial<Product>): Promise<{ success: boolean; product: Product }> {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update product');
    return json;
  },

  async adminDeleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to delete product');
    return json;
  },

  // Admin Direct Computer Image Upload (Saved directly into public/images/products/)
  async adminUploadImages(files: File[]): Promise<{ urls: string[] }> {
    const formData = new FormData();
    files.slice(0, 3).forEach(f => formData.append('images', f));

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: authHeaders(),
      body: formData
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Image upload failed');
    return json;
  },

  // --- AUTOMATIC EXPORT COMPLETE CATALOGUE ZIP & JSON FOR NETLIFY ---
  async adminExportCatalogueZip(): Promise<void> {
    const token = getAuthToken();
    const res = await fetch('/api/admin/catalogue/export-zip', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) throw new Error('Failed to generate complete catalogue ZIP package');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amd_furniture_complete_catalogue_source_${new Date().toISOString().split('T')[0]}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  },

  async adminExportCatalogueJson(): Promise<void> {
    const token = getAuthToken();
    const res = await fetch('/api/admin/catalogue/export-json', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) throw new Error('Failed to export catalogue JSON');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  },

  async adminImportCatalogueJson(products: Product[]): Promise<any> {
    const res = await fetch('/api/admin/catalogue/import-json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ products })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to import catalogue JSON');
    return json;
  },

  // Admin Settings & Pricing
  async adminGetSettings(): Promise<{ settings: SiteSettings }> {
    const res = await fetch('/api/admin/settings', {
      headers: authHeaders()
    });
    if (!res.ok) throw new Error('Failed to load admin settings');
    return res.json();
  },

  async adminUpdateSettings(settings: Partial<SiteSettings>): Promise<any> {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(settings)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update settings');
    return json;
  },

  // Admin Postcodes
  async adminGetPostcodes(): Promise<{ zones: PostcodeZone[] }> {
    const res = await fetch('/api/postcodes');
    return res.json();
  },

  async adminSavePostcodes(zones: PostcodeZone[]): Promise<any> {
    const res = await fetch('/api/admin/postcodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ zones })
    });
    return res.json();
  },

  // Admin Bookings
  async adminGetBookings(): Promise<{ bookings: DeliveryBooking[]; total: number }> {
    const res = await fetch('/api/admin/bookings', {
      headers: authHeaders()
    });
    return res.json();
  },

  async adminUpdateBooking(id: string, data: Partial<DeliveryBooking>): Promise<any> {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Admin CSV Bulk Import/Export
  async adminImportCsv(csvContent: string): Promise<any> {
    const res = await fetch('/api/csv/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ csvContent })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'CSV import failed');
    return json;
  },

  async adminExportCsv(): Promise<void> {
    const token = getAuthToken();
    const res = await fetch('/api/csv/export', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amd_furniture_catalog_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
};
