import React, { useState, useEffect, useRef } from 'react';
import {
  Product,
  ProductCategory,
  ALL_CATEGORIES,
  SiteSettings,
  PostcodeZone,
  DeliveryBooking,
  FabricGroup,
  ColourOption
} from '../types';
import {
  BED_FABRICS,
  STANDARD_WARDROBE_COLOURS,
  SLIDING_WARDROBE_COLOURS,
  CHEST_OF_DRAWERS_COLOURS,
  DEFAULT_BED_SIZES,
  DEFAULT_DRAWER_OPTIONS,
  DEFAULT_MATTRESS_OPTIONS,
  CATEGORY_SUBCATEGORIES
} from '../data/constants';
import { api, getAuthToken } from '../services/api';
import {
  Lock,
  Unlock,
  Package,
  Plus,
  Edit,
  Trash2,
  Upload,
  Image as ImageIcon,
  DollarSign,
  Truck,
  FileSpreadsheet,
  Settings as SettingsIcon,
  CheckCircle2,
  AlertTriangle,
  X,
  Search,
  Check,
  Calendar,
  Eye,
  EyeOff,
  Layers,
  ArrowUpDown,
  Download,
  ArrowLeft
} from 'lucide-react';

interface Props {
  onGoBack?: () => void;
}

export const AdminView: React.FC<Props> = ({ onGoBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>(''); // NEVER prefilled
  const [loginError, setLoginError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'add-product' | 'export-deploy' | 'bed-pricing' | 'postcodes' | 'bookings' | 'csv' | 'settings'
  >('overview');

  const [isExportingZip, setIsExportingZip] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toLocaleTimeString());
  const jsonFileInputRef = useRef<HTMLInputElement>(null);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Settings & Pricing state
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [postcodeZones, setPostcodeZones] = useState<PostcodeZone[]>([]);
  const [bookings, setBookings] = useState<DeliveryBooking[]>([]);

  // Add / Edit Product Form state
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('Beds');
  const [formSubcategory, setFormSubcategory] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState<string>('');
  const [formStatus, setFormStatus] = useState<'Published' | 'Draft'>('Draft');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formSizes, setFormSizes] = useState<string[]>([]);
  const [formColours, setFormColours] = useState<ColourOption[]>([]);
  const [formFabricGroups, setFormFabricGroups] = useState<FabricGroup[]>(['Steel', 'Chenille', 'Crushed Velvet', 'Naples']);
  const [formDrawerOptions, setFormDrawerOptions] = useState<string[]>(DEFAULT_DRAWER_OPTIONS);
  const [formMattressOptions, setFormMattressOptions] = useState<string[]>(DEFAULT_MATTRESS_OPTIONS);
  const [formStockStatus, setFormStockStatus] = useState<'In Stock' | 'Low Stock' | 'Made to Order' | 'Out of Stock'>('In Stock');
  const [formDimensions, setFormDimensions] = useState('');
  const [formMaterial, setFormMaterial] = useState('');
  const [formSuccessMessage, setFormSuccessMessage] = useState('');
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  // CSV Import State
  const [csvText, setCsvText] = useState('');
  const [csvResult, setCsvResult] = useState<any | null>(null);
  const [isImportingCsv, setIsImportingCsv] = useState(false);

  // Password change state
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvFileInputRef = useRef<HTMLInputElement>(null);

  // Check initial authentication
  useEffect(() => {
    const checkAuth = async () => {
      const valid = await api.adminVerify();
      setIsAuthenticated(valid);
      if (valid) {
        loadAdminData();
      }
    };
    checkAuth();
  }, []);

  const loadAdminData = async () => {
    setLoadingProducts(true);
    try {
      const prodRes = await api.adminGetProducts();
      setProducts(prodRes.products || []);

      const setRes = await api.adminGetSettings();
      setSettings(setRes.settings);

      const pcRes = await api.adminGetPostcodes();
      setPostcodeZones(pcRes.zones || []);

      const bkRes = await api.adminGetBookings();
      setBookings(bkRes.bookings || []);
    } catch (err: any) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      await api.adminLogin(passwordInput);
      setIsAuthenticated(true);
      setPasswordInput(''); // Clear input
      loadAdminData();
    } catch (err: any) {
      setLoginError(err.message || 'Incorrect administrator password');
    }
  };

  const handleLogout = async () => {
    await api.adminLogout();
    setIsAuthenticated(false);
  };

  // Initialize Form for Category
  const setupFormForCategory = (cat: ProductCategory) => {
    setFormCategory(cat);
    if (cat === 'Beds') {
      setFormSizes(DEFAULT_BED_SIZES);
      setFormFabricGroups(['Steel', 'Chenille', 'Crushed Velvet', 'Naples']);
      setFormColours([
        ...BED_FABRICS.Steel.colours,
        ...BED_FABRICS.Chenille.colours,
        ...BED_FABRICS['Crushed Velvet'].colours,
        ...BED_FABRICS.Naples.colours
      ]);
      setFormDrawerOptions(DEFAULT_DRAWER_OPTIONS);
      setFormMattressOptions(DEFAULT_MATTRESS_OPTIONS);
    } else if (cat === 'Wardrobes') {
      setFormSizes(['120 cm', '150 cm', '180 cm', '200 cm']);
      setFormColours(STANDARD_WARDROBE_COLOURS);
    } else if (cat === 'Sliding Door Wardrobes') {
      setFormSizes(['150 cm', '180 cm', '200 cm', '250 cm']);
      setFormColours(SLIDING_WARDROBE_COLOURS);
    } else if (cat === 'Chest of Drawers') {
      setFormSizes(['4 Drawer (W: 80cm)', '5 Drawer (W: 80cm)', '6 Drawer Wide (W: 120cm)']);
      setFormColours(CHEST_OF_DRAWERS_COLOURS);
    } else if (cat === 'Mattresses') {
      setFormSizes(['Single (3ft)', 'Small Double (4ft)', 'Double (4ft6)', 'King (5ft)', 'Super King (6ft)']);
      setFormColours([{ name: 'White Damask', hex: '#FFFFFF' }]);
    } else {
      setFormSizes(['Standard']);
      setFormColours([{ name: 'Natural Oak', hex: '#C19A6B' }, { name: 'Grey', hex: '#808080' }]);
    }
  };

  // Start adding new product
  const startAddProduct = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSku('');
    setFormSubcategory('');
    setFormDescription('');
    setFormPrice('');
    setFormStatus('Draft');
    setFormImages([]);
    setFormStockStatus('In Stock');
    setFormDimensions('');
    setFormMaterial('');
    setFormSuccessMessage('');
    setFormErrorMessage('');
    setupFormForCategory('Beds');
    setActiveTab('add-product');
  };

  // Start editing existing product
  const startEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormSku(prod.sku);
    setFormCategory(prod.category);
    setFormSubcategory(prod.subcategory || '');
    setFormDescription(prod.description || '');
    setFormPrice(prod.price !== undefined && prod.price !== null ? String(prod.price) : '');
    setFormStatus(prod.status);
    setFormImages(prod.images || []);
    setFormSizes(prod.sizes || []);
    setFormColours(prod.colours || []);
    setFormFabricGroups(prod.fabricGroups || ['Steel', 'Chenille', 'Crushed Velvet', 'Naples']);
    setFormDrawerOptions(prod.bedConfig?.drawerOptions || DEFAULT_DRAWER_OPTIONS);
    setFormMattressOptions(prod.bedConfig?.mattressOptions?.options || DEFAULT_MATTRESS_OPTIONS);
    setFormStockStatus(prod.stockStatus || 'In Stock');
    setFormDimensions(prod.dimensions || '');
    setFormMaterial(prod.material || '');
    setFormSuccessMessage('');
    setFormErrorMessage('');
    setActiveTab('add-product');
  };

  // Handle direct computer image upload
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (formImages.length + files.length > 3) {
      alert('You can upload a maximum of 3 pictures per product.');
      return;
    }

    setIsUploadingImages(true);
    setFormErrorMessage('');
    try {
      const res = await api.adminUploadImages(Array.from(files));
      if (res.urls && res.urls.length > 0) {
        setFormImages(prev => [...prev, ...res.urls].slice(0, 3));
      }
    } catch (err: any) {
      setFormErrorMessage(err.message || 'Error uploading images from computer');
    } finally {
      setIsUploadingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeFormImage = (index: number) => {
    setFormImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const setAsMainImage = (index: number) => {
    setFormImages(prev => {
      const next = [...prev];
      const [chosen] = next.splice(index, 1);
      next.unshift(chosen);
      return next;
    });
  };

  // Save product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccessMessage('');
    setFormErrorMessage('');

    if (!formName.trim() || !formSku.trim()) {
      setFormErrorMessage('Product Name and SKU are mandatory.');
      return;
    }

    const payload: Partial<Product> = {
      name: formName.trim(),
      sku: formSku.trim().toUpperCase(),
      category: formCategory,
      subcategory: formSubcategory.trim() || undefined,
      description: formDescription.trim(),
      price: formPrice !== '' ? parseFloat(formPrice) : undefined,
      status: formStatus,
      images: formImages.slice(0, 3),
      sizes: formSizes,
      colours: formColours,
      fabricGroups: formCategory === 'Beds' ? formFabricGroups : undefined,
      bedConfig:
        formCategory === 'Beds'
          ? {
              sizes: formSizes,
              fabricGroups: formFabricGroups,
              colours: formColours,
              drawerOptions: formDrawerOptions,
              mattressOptions: {
                enabled: true,
                options: formMattressOptions as any
              }
            }
          : undefined,
      stockStatus: formStockStatus,
      dimensions: formDimensions,
      material: formMaterial
    };

    try {
      if (editingProduct) {
        const res = await api.adminUpdateProduct(editingProduct.id, payload);
        setProducts(prev => prev.map(p => (p.id === editingProduct.id ? res.product : p)));
        setFormSuccessMessage(`Product '${res.product.name}' updated successfully!`);
      } else {
        const res = await api.adminCreateProduct(payload);
        setProducts(prev => [res.product, ...prev]);
        setFormSuccessMessage(`Product '${res.product.name}' created successfully with SKU ${res.product.sku}!`);
        // Reset
        setFormName('');
        setFormSku('');
        setFormSubcategory('');
        setFormImages([]);
      }
    } catch (err: any) {
      setFormErrorMessage(err.message || 'Failed to save product');
    }
  };

  // Delete product (Admin only)
  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      await api.adminDeleteProduct(productToDelete.id);
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      setProductToDelete(null);
    } catch (err: any) {
      alert(err.message || 'Error deleting product');
    }
  };

  // Toggle publish / unpublish
  const handleToggleStatus = async (prod: Product) => {
    const nextStatus = prod.status === 'Published' ? 'Draft' : 'Published';
    try {
      const res = await api.adminUpdateProduct(prod.id, { status: nextStatus });
      setProducts(prev => prev.map(p => (p.id === prod.id ? res.product : p)));
    } catch (err: any) {
      alert(err.message || 'Error updating product status');
    }
  };

  // CSV import handling
  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      const content = evt.target?.result as string;
      setCsvText(content);
    };
    reader.readAsText(file);
  };

  const handleRunCsvImport = async () => {
    if (!csvText.trim()) {
      alert('Please upload or paste CSV text first.');
      return;
    }
    setIsImportingCsv(true);
    setCsvResult(null);
    try {
      const res = await api.adminImportCsv(csvText);
      setCsvResult(res);
      await loadAdminData();
    } catch (err: any) {
      setCsvResult({ success: false, error: err.message });
    } finally {
      setIsImportingCsv(false);
    }
  };

  // Change Admin Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeMessage('');
    setPasswordChangeError('');
    try {
      await api.adminChangePassword(currentPasswordInput, newPasswordInput);
      setPasswordChangeMessage('Administrator password updated successfully.');
      setCurrentPasswordInput('');
      setNewPasswordInput('');
    } catch (err: any) {
      setPasswordChangeError(err.message || 'Error changing password');
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await api.adminUpdateSettings(settings);
      alert('Settings saved successfully.');
    } catch (err: any) {
      alert(err.message || 'Error saving settings');
    }
  };

  const handleDownloadZip = async () => {
    setIsExportingZip(true);
    try {
      await api.adminExportCatalogueZip();
    } catch (err: any) {
      alert(err.message || 'Failed to download ZIP package');
    } finally {
      setIsExportingZip(false);
    }
  };

  const handleDownloadJson = async () => {
    try {
      await api.adminExportCatalogueJson();
    } catch (err: any) {
      alert(err.message || 'Failed to export JSON');
    }
  };

  const handleJsonFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async evt => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (!Array.isArray(parsed)) {
          alert('Invalid format: Expected a JSON array of products.');
          return;
        }
        const res = await api.adminImportCatalogueJson(parsed);
        alert(`Successfully imported ${res.imported} products into project source code!`);
        await loadAdminData();
      } catch (err: any) {
        alert(err.message || 'Failed to parse JSON file');
      }
    };
    reader.readAsText(file);
    if (jsonFileInputRef.current) jsonFileInputRef.current.value = '';
  };

  const totalImageCount = products.reduce((acc, p) => acc + (p.images ? p.images.length : 0), 0);

  // Filter products for table
  const filteredProducts = products.filter(p => {
    if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) return false;
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    }
    return true;
  });

  // IF NOT AUTHENTICATED: Display clean password login prompt (Password input NEVER prefilled)
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 sm:py-20 space-y-4">
        {onGoBack && (
          <div>
            <button
              onClick={onGoBack}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1C1917] bg-white border border-[#DCD7CD] px-3 py-1.5 rounded-lg hover:border-[#C5A059] shadow-2xs transition-all active:scale-95"
              title="Go Back One Step"
            >
              <ArrowLeft className="w-4 h-4 text-[#C5A059]" />
              <span>← Back to Website</span>
            </button>
          </div>
        )}

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7E2DA] shadow-xl text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-[#1C1917] text-[#C5A059] flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h1 className="font-serif text-2xl font-bold text-[#1C1917]">
              AMD Furniture UK
            </h1>
            <p className="text-xs text-stone-500 mt-1 uppercase tracking-widest font-semibold">
              Administrator Management Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                Enter Administrator Password
              </label>
              <input
                type="password"
                required
                autoComplete="off"
                value={passwordInput}
                onChange={e => {
                  setPasswordInput(e.target.value);
                  setLoginError('');
                }}
                placeholder="Type your password..."
                className="w-full bg-[#FAF8F5] border border-[#DCD7CD] focus:border-[#C5A059] rounded-xl px-4 py-3 text-sm outline-hidden font-mono tracking-wider"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#1C1917] hover:bg-[#C5A059] hover:text-[#1C1917] text-white font-bold text-xs sm:text-sm py-3.5 rounded-xl transition-all shadow-md"
            >
              Unlock Admin Portal
            </button>
          </form>

          {/* Help box specifying password */}
          <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EFEBE4] text-xs text-stone-600 text-left space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#1C1917]">
              <AlertTriangle className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Login Credentials Notice:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Default password: <code className="bg-stone-200 px-1.5 py-0.5 rounded font-mono font-bold text-[#1C1917]">AMD@Furniture2026</code>. As requested, this field is never pre-filled and must be typed in. You can change this password anytime in Settings.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- AUTHENTICATED ADMIN DASHBOARD ---
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Universal Step Back Navigation */}
      {onGoBack && (
        <div className="flex items-center justify-between">
          <button
            onClick={onGoBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1C1917] bg-white border border-[#DCD7CD] px-3.5 py-2 rounded-lg hover:border-[#C5A059] shadow-2xs transition-all active:scale-95"
            title="Go Back to Store Website"
          >
            <ArrowLeft className="w-4 h-4 text-[#C5A059]" />
            <span>← Back to Store Website</span>
          </button>
          <span className="text-xs text-stone-500 font-medium hidden sm:inline">AMD Furniture UK Administration</span>
        </div>
      )}

      {/* Admin Top Header */}
      <div className="bg-[#1C1917] text-white p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-sm bg-[#C5A059] text-[#1C1917] font-serif font-bold text-xs flex items-center justify-center">
              A
            </span>
            <span className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
              AMD Admin Management Portal
            </span>
          </div>
          <p className="text-xs text-[#A8A29E] mt-1">
            Catalogue Capacity: 600+ Products | Direct Computer Image Uploads | Bed Price Security
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleDownloadZip}
            disabled={isExportingZip}
            className="bg-[#25D366] hover:bg-[#20BD5A] active:bg-[#1E9E4B] text-white font-bold text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
            title="Download complete catalogue with images as ZIP package"
          >
            <Download className="w-4 h-4" />
            <span>{isExportingZip ? 'Preparing ZIP...' : 'Export Complete (.ZIP)'}</span>
          </button>

          <button
            onClick={startAddProduct}
            className="bg-[#C5A059] hover:bg-[#A88440] text-[#1C1917] font-bold text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>

          <button
            onClick={handleLogout}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2.5 rounded-lg border border-white/20 transition-colors flex items-center gap-1.5"
          >
            <Unlock className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#E7E2DA]">
        {[
          { id: 'overview', label: 'Overview', icon: Layers },
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'add-product', label: editingProduct ? 'Edit Product' : 'Add Product', icon: Plus },
          { id: 'export-deploy', label: 'Export & Netlify Source', icon: Download },
          { id: 'bed-pricing', label: 'Internal Bed Pricing', icon: DollarSign },
          { id: 'postcodes', label: 'Postcode Routes', icon: Truck },
          { id: 'bookings', label: `Delivery Bookings (${bookings.length})`, icon: Calendar },
          { id: 'csv', label: 'CSV Bulk Import (600+)', icon: FileSpreadsheet },
          { id: 'settings', label: 'Website Settings', icon: SettingsIcon }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                isActive
                  ? 'bg-[#1C1917] text-[#FAF8F5] shadow-xs'
                  : 'bg-white text-stone-600 border border-[#E7E2DA] hover:border-[#C5A059]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C5A059]' : 'text-stone-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* --- TAB 1: OVERVIEW --- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-[#E7E2DA] shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                Total Products
              </span>
              <span className="font-serif text-3xl font-bold text-[#1C1917]">{products.length}</span>
              <span className="text-[11px] text-stone-500 block mt-1">Capacity: 600+ active items</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#E7E2DA] shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                Published to Store
              </span>
              <span className="font-serif text-3xl font-bold text-emerald-700">
                {products.filter(p => p.status === 'Published').length}
              </span>
              <span className="text-[11px] text-stone-500 block mt-1">Live in customer catalogue</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#E7E2DA] shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block mb-1">
                Drafts (Private)
              </span>
              <span className="font-serif text-3xl font-bold text-amber-700">
                {products.filter(p => p.status === 'Draft').length}
              </span>
              <span className="text-[11px] text-stone-500 block mt-1">Includes test draft products</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#E7E2DA] shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A88440] block mb-1">
                Advance Bookings
              </span>
              <span className="font-serif text-3xl font-bold text-[#A88440]">{bookings.length}</span>
              <span className="text-[11px] text-stone-500 block mt-1">Customer date requests</span>
            </div>
          </div>

          {/* Quick Actions & Privacy Verification Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-[#E7E2DA] space-y-4">
              <h3 className="font-serif font-bold text-base text-[#1C1917] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Bed Price Privacy Safeguards Active
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Bed prices are protected on both API and database response levels. Non-admin visitors and WhatsApp enquiry messages are strictly restricted to <strong>“Price on WhatsApp — Please enquire.”</strong> Internal bed prices appear exclusively in this dashboard.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('bed-pricing')}
                  className="text-xs font-semibold text-[#A88440] hover:underline"
                >
                  Configure Internal Bed Drawer & Surcharge Defaults →
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#E7E2DA] space-y-4">
              <h3 className="font-serif font-bold text-base text-[#1C1917] flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#C5A059]" />
                UK Delivery & Glasgow Fleet Active
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {postcodeZones.length} postcode prefix zones registered, including Glasgow direct routes, London & South East next-day bed zones, and Wales hubs.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('postcodes')}
                  className="text-xs font-semibold text-[#A88440] hover:underline"
                >
                  Manage Postcode Prefixes & Eligibility →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: PRODUCTS TABLE --- */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-[#E7E2DA] p-5 sm:p-6 space-y-4 shadow-2xs">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EFEBE4]">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                placeholder="Search products by Name or SKU..."
                className="w-full bg-[#FAF8F5] border border-[#DCD7CD] rounded-lg pl-9 pr-3 py-2 text-xs outline-hidden focus:border-[#C5A059]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={productCategoryFilter}
                onChange={e => setProductCategoryFilter(e.target.value)}
                className="bg-[#FAF8F5] border border-[#DCD7CD] rounded-lg px-3 py-2 text-xs outline-hidden focus:border-[#C5A059]"
              >
                <option value="all">All 12 Categories</option>
                {ALL_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <button
                onClick={startAddProduct}
                className="bg-[#1C1917] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-[#C5A059] hover:text-[#1C1917] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-stone-500 uppercase tracking-wider font-semibold border-b border-[#E7E2DA]">
                <tr>
                  <th className="p-3">Image</th>
                  <th className="p-3">Product Name & SKU</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price Status</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEBE4]">
                {filteredProducts.map(prod => {
                  const isBed = prod.category === 'Beds';
                  const img = prod.images?.[0] || '';
                  return (
                    <tr key={prod.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="p-3 w-16">
                        {img ? (
                          <img src={img} alt="" className="w-12 h-12 rounded object-contain bg-white border border-[#E7E2DA] p-0.5" />
                        ) : (
                          <div className="w-12 h-12 rounded bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-[#1C1917] block">{prod.name}</span>
                        <span className="font-mono text-[10px] text-stone-500 uppercase">SKU: {prod.sku}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-stone-800 block">{prod.category}</span>
                        {prod.subcategory ? (
                          <span className="text-[10px] text-[#A88440] font-semibold bg-[#FAF6EE] px-1.5 py-0.5 rounded border border-[#EBE3D3] inline-block mt-0.5">
                            {prod.subcategory}
                          </span>
                        ) : (
                          <span className="text-[10px] text-stone-400 block">—</span>
                        )}
                      </td>
                      <td className="p-3">
                        {isBed ? (
                          <div>
                            <span className="font-bold text-[#8B6B2B] block">£{prod.price || 'N/A'} (Internal)</span>
                            <span className="text-[10px] text-stone-400">Hidden from public</span>
                          </div>
                        ) : (
                          <span className="font-bold text-stone-900">£{prod.price ?? 'Contact'}</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                          {prod.stockStatus}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleStatus(prod)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                            prod.status === 'Published'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                          title="Click to toggle Published / Draft"
                        >
                          {prod.status}
                        </button>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEditProduct(prod)}
                            className="p-1.5 rounded hover:bg-stone-100 text-stone-600 hover:text-[#C5A059]"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* DELETE PRODUCT BUTTON (ADMIN ONLY) */}
                          <button
                            onClick={() => setProductToDelete(prod)}
                            className="p-1.5 rounded hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 3: ADD / EDIT PRODUCT (UP TO 3 DIRECT COMPUTER IMAGES, CATEGORY LOGIC) --- */}
      {activeTab === 'add-product' && (
        <div className="bg-white rounded-2xl border border-[#E7E2DA] p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#EFEBE4]">
            <h3 className="font-serif font-bold text-lg text-[#1C1917]">
              {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Furniture Product'}
            </h3>
            {editingProduct && (
              <button
                onClick={startAddProduct}
                className="text-xs text-[#A88440] hover:underline"
              >
                + Switch to Add New
              </button>
            )}
          </div>

          {formSuccessMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{formSuccessMessage}</span>
            </div>
          )}

          {formErrorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs">
              {formErrorMessage}
            </div>
          )}

          <form onSubmit={handleSaveProduct} className="space-y-6">
            {/* Category selection */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  1. Furniture Category *
                </label>
                <select
                  value={formCategory}
                  onChange={e => setupFormForCategory(e.target.value as ProductCategory)}
                  className="w-full bg-[#FAF8F5] border border-[#DCD7CD] rounded-lg px-3 py-2 text-xs outline-hidden focus:border-[#C5A059]"
                >
                  {ALL_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <p className="text-[10px] text-stone-400 mt-1">
                  Selecting Beds, Wardrobes, or Chest of Drawers automatically configures their exact fabrics & colors.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Ambassador Chesterfield Wingback Bed"
                  className="w-full bg-[#FAF8F5] border border-[#DCD7CD] rounded-lg px-3 py-2 text-xs outline-hidden focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Unique SKU *
                </label>
                <input
                  type="text"
                  required
                  value={formSku}
                  onChange={e => setFormSku(e.target.value)}
                  placeholder="e.g. AMD-BED-001"
                  className="w-full bg-[#FAF8F5] border border-[#DCD7CD] rounded-lg px-3 py-2 text-xs font-mono uppercase outline-hidden focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* Sub-Category Selection (Ensures added products show under their subcategory in showroom) */}
            <div className="bg-[#FAF8F5] p-4 sm:p-5 rounded-xl border border-[#E7E2DA] space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#C5A059]" />
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1C1917]">
                    Sub-Category (Showroom Placement)
                  </label>
                  {formSubcategory && (
                    <span className="bg-[#1C1917] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      Selected: {formSubcategory}
                    </span>
                  )}
                </div>
                {formSubcategory && (
                  <button
                    type="button"
                    onClick={() => setFormSubcategory('')}
                    className="text-xs text-[#A88440] hover:underline font-semibold"
                  >
                    Clear Sub-Category
                  </button>
                )}
              </div>

              <p className="text-[11px] text-stone-500">
                Products added with a sub-category will automatically appear organized under that sub-category in the customer showroom catalogue.
              </p>

              {/* Recommended Subcategories for Selected Category */}
              {CATEGORY_SUBCATEGORIES[formCategory] && CATEGORY_SUBCATEGORIES[formCategory].length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">
                    Choose from standard {formCategory} sub-categories:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORY_SUBCATEGORIES[formCategory].map(sub => {
                      const isSelected = formSubcategory === sub;
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => setFormSubcategory(isSelected ? '' : sub)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-[#C5A059] text-[#1C1917] font-bold shadow-xs'
                              : 'bg-white text-stone-700 border border-[#DCD7CD] hover:border-[#C5A059]'
                          }`}
                        >
                          {sub}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Custom Subcategory input */}
              <div className="pt-1">
                <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                  Or enter custom sub-category name:
                </label>
                <input
                  type="text"
                  value={formSubcategory}
                  onChange={e => setFormSubcategory(e.target.value)}
                  placeholder={`e.g. ${CATEGORY_SUBCATEGORIES[formCategory]?.[0] || 'Modern Luxury Series'}`}
                  className="w-full bg-white border border-[#DCD7CD] rounded-lg px-3 py-2 text-xs outline-hidden focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* MANDATORY DIRECT COMPUTER IMAGE UPLOAD (UP TO 3 IMAGES) */}
            <div className="bg-[#FAF8F5] p-5 rounded-xl border border-[#E7E2DA] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1C1917] block">
                    Product Pictures (Select Direct From Computer - Max 3 Images) *
                  </label>
                  <p className="text-[11px] text-stone-500">
                    Supports JPG, JPEG, PNG, WebP. Permanent storage saved to database.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#A88440]">
                  {formImages.length} / 3 Uploaded
                </span>
              </div>

              {/* Upload Input & Button */}
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImages || formImages.length >= 3}
                  className="bg-[#1C1917] hover:bg-[#C5A059] hover:text-[#1C1917] text-white text-xs font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingImages ? 'Uploading Files...' : 'Choose Images from Computer'}</span>
                </button>
                <span className="text-xs text-stone-500">
                  Select 1, 2, or 3 images directly from your computer files.
                </span>
              </div>

              {/* Uploaded Image Previews */}
              {formImages.length > 0 && (
                <div className="grid grid-cols-3 gap-4 pt-2">
                  {formImages.map((img, idx) => (
                    <div key={idx} className="relative bg-white rounded-lg p-2 border border-[#E7E2DA] shadow-2xs group">
                      <img src={img} alt="" className="w-full h-32 object-contain rounded bg-[#FAF8F5]" />
                      <div className="mt-2 flex items-center justify-between">
                        {idx === 0 ? (
                          <span className="text-[10px] font-bold bg-[#C5A059] text-[#1C1917] px-2 py-0.5 rounded">
                            Main Image
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setAsMainImage(idx)}
                            className="text-[10px] text-[#A88440] hover:underline"
                          >
                            Set as Main
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeFormImage(idx)}
                          className="text-stone-400 hover:text-rose-600 p-1"
                          title="Remove image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  {formCategory === 'Beds' ? 'Internal Bed Base Price (£) [Private]' : 'Selling Price (£) *'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 font-bold">£</span>
                  <input
                    type="number"
                    step="0.01"
                    value={formPrice}
                    onChange={e => setFormPrice(e.target.value)}
                    placeholder={formCategory === 'Beds' ? 'e.g. 299 (Hidden from visitors)' : 'e.g. 199'}
                    className="w-full bg-[#FAF8F5] border border-[#DCD7CD] rounded-lg pl-8 pr-3 py-2 text-xs outline-hidden focus:border-[#C5A059]"
                  />
                </div>
                {formCategory === 'Beds' && (
                  <p className="text-[10px] text-amber-700 font-semibold mt-1">
                    🔒 Bed prices are NEVER shown publicly. Visitors only see “Price on WhatsApp — Please enquire.”
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Catalog Status
                </label>
                <select
                  value={formStatus}
                  onChange={e => setFormStatus(e.target.value as any)}
                  className="w-full bg-[#FAF8F5] border border-[#DCD7CD] rounded-lg px-3 py-2 text-xs outline-hidden focus:border-[#C5A059]"
                >
                  <option value="Draft">Draft (Private Test / Staging)</option>
                  <option value="Published">Published (Live to UK Customers)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Stock Status
                </label>
                <select
                  value={formStockStatus}
                  onChange={e => setFormStockStatus(e.target.value as any)}
                  className="w-full bg-[#FAF8F5] border border-[#DCD7CD] rounded-lg px-3 py-2 text-xs outline-hidden focus:border-[#C5A059]"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Made to Order">Made to Order</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                Product Description
              </label>
              <textarea
                rows={3}
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
                placeholder="Product specifications, frame materials, mattress recommendations..."
                className="w-full bg-[#FAF8F5] border border-[#DCD7CD] rounded-lg px-3 py-2 text-xs outline-hidden focus:border-[#C5A059]"
              />
            </div>

            {/* Category Specific Options (Beds vs Wardrobes vs Others) */}
            {formCategory === 'Beds' && (
              <div className="bg-[#FAF8F5] p-5 rounded-xl border border-[#E7E2DA] space-y-4">
                <span className="font-serif font-bold text-sm text-[#1C1917] block">
                  Beds Configuration: 4 British Fabric Groups & Swatches
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(BED_FABRICS).map(([fabGroup, data]) => (
                    <div key={fabGroup} className="p-3 bg-white rounded-lg border border-[#E7E2DA] space-y-2">
                      <span className="font-bold text-xs text-[#1C1917]">{data.name}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {data.colours.map((c, i) => (
                          <div key={i} className="flex items-center gap-1 bg-[#FAF8F5] border border-stone-200 px-1.5 py-0.5 rounded text-[10px]">
                            <span className="w-3 h-3 rounded-full border border-stone-300" style={{ backgroundColor: c.hex }} />
                            <span>{c.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(formCategory === 'Wardrobes' || formCategory === 'Chest of Drawers' || formCategory === 'Sliding Door Wardrobes') && (
              <div className="bg-[#FAF8F5] p-5 rounded-xl border border-[#E7E2DA] space-y-3">
                <span className="font-serif font-bold text-sm text-[#1C1917] block">
                  Configured Colours & Finishes (With Swatches)
                </span>
                <div className="flex flex-wrap gap-2">
                  {formColours.map((col, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 bg-white border border-[#E7E2DA] px-2.5 py-1 rounded-lg text-xs">
                      <span className="w-4 h-4 rounded-full border border-stone-300" style={{ backgroundColor: col.hex }} />
                      <span className="font-medium text-stone-800">{col.name}</span>
                      {col.onDemandOnly && <span className="text-[9px] text-amber-700 font-bold">(On Demand)</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#EFEBE4] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('products')}
                className="px-5 py-2.5 rounded-lg border border-[#DCD7CD] text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#1C1917] hover:bg-[#C5A059] hover:text-[#1C1917] text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow-sm transition-colors"
              >
                {editingProduct ? 'Save Product Changes' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- TAB 4: INTERNAL BED PRICING DEFAULTS --- */}
      {activeTab === 'bed-pricing' && settings && (
        <div className="bg-white rounded-2xl border border-[#E7E2DA] p-6 sm:p-8 space-y-6 shadow-2xs">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#1C1917]">
              Internal Bed Pricing Defaults (Private Admin Only)
            </h3>
            <p className="text-xs text-stone-500">
              Configure the internal calculation defaults for quotes. These amounts are strictly private and never shown to public visitors.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 max-w-xl">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Drawer Charge Per Drawer (£)
                </label>
                <input
                  type="number"
                  value={settings.pricingDefaults.drawerChargePerDrawer}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      pricingDefaults: {
                        ...settings.pricingDefaults,
                        drawerChargePerDrawer: parseFloat(e.target.value) || 0
                      }
                    })
                  }
                  className="w-full bg-[#FAF8F5] border border-[#DCD7CD] rounded-lg px-3 py-2 text-xs"
                />
                <span className="text-[10px] text-stone-400">Default: £15 per drawer</span>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Standard Spring Mattress (£)
                </label>
                <input
                  type="number"
                  value={settings.pricingDefaults.standardSpringMattressPrice}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      pricingDefaults: {
                        ...settings.pricingDefaults,
                        standardSpringMattressPrice: parseFloat(e.target.value) || 0
                      }
                    })
                  }
                  className="w-full bg-[#FAF8F5] border border-[#DCD7CD] rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Memory Foam Upgrade (£)
                </label>
                <input
                  type="number"
                  value={settings.pricingDefaults.memoryFoamUpgradePrice}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      pricingDefaults: {
                        ...settings.pricingDefaults,
                        memoryFoamUpgradePrice: parseFloat(e.target.value) || 0
                      }
                    })
                  }
                  className="w-full bg-[#FAF8F5] border border-[#DCD7CD] rounded-lg px-3 py-2 text-xs"
                />
                <span className="text-[10px] text-stone-400">Default: £20</span>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Orthopaedic Upgrade (£)
                </label>
                <input
                  type="number"
                  value={settings.pricingDefaults.orthopaedicUpgradePrice}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      pricingDefaults: {
                        ...settings.pricingDefaults,
                        orthopaedicUpgradePrice: parseFloat(e.target.value) || 0
                      }
                    })
                  }
                  className="w-full bg-[#FAF8F5] border border-[#DCD7CD] rounded-lg px-3 py-2 text-xs"
                />
                <span className="text-[10px] text-stone-400">Default: £20</span>
              </div>

              <div className="col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Postcode-Route Surcharge Per Bed in Configured Zones (£)
                </label>
                <input
                  type="number"
                  value={settings.pricingDefaults.zoneSurchargePerBed}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      pricingDefaults: {
                        ...settings.pricingDefaults,
                        zoneSurchargePerBed: parseFloat(e.target.value) || 0
                      }
                    })
                  }
                  className="w-full bg-[#FAF8F5] border border-[#DCD7CD] rounded-lg px-3 py-2 text-xs"
                />
                <span className="text-[10px] text-stone-400">
                  Applied only once per bed, not per drawer or mattress option. Default: £20
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#1C1917] hover:bg-[#C5A059] hover:text-[#1C1917] text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow-sm"
            >
              Save Internal Bed Pricing
            </button>
          </form>
        </div>
      )}

      {/* --- TAB 5: POSTCODE ROUTES --- */}
      {activeTab === 'postcodes' && (
        <div className="bg-white rounded-2xl border border-[#E7E2DA] p-6 sm:p-8 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#EFEBE4]">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#1C1917]">
                UK Postcode Route Management
              </h3>
              <p className="text-xs text-stone-500">
                UK-wide coverage including direct Glasgow routes ('G' prefix), London, Scotland, and Wales.
              </p>
            </div>
            <span className="text-xs font-bold text-[#A88440]">
              {postcodeZones.length} Configured Prefixes
            </span>
          </div>

          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-stone-500 uppercase tracking-wider font-semibold sticky top-0 border-b border-[#E7E2DA]">
                <tr>
                  <th className="p-3">Prefix</th>
                  <th className="p-3">Region</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Estimated Transit</th>
                  <th className="p-3">Surcharge (£)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEBE4]">
                {postcodeZones.map(z => (
                  <tr key={z.id} className="hover:bg-stone-50">
                    <td className="p-3 font-mono font-bold text-stone-800">{z.prefix}</td>
                    <td className="p-3 text-stone-700">{z.region}</td>
                    <td className="p-3">
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {z.status}
                      </span>
                    </td>
                    <td className="p-3 text-stone-600">{z.estimatedDays}</td>
                    <td className="p-3 font-semibold text-stone-800">£{z.surcharge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 6: ADVANCE DELIVERY BOOKINGS --- */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-2xl border border-[#E7E2DA] p-6 sm:p-8 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#EFEBE4]">
            <h3 className="font-serif font-bold text-lg text-[#1C1917]">
              Customer Advance Delivery Bookings & Enquiries
            </h3>
            <span className="text-xs text-stone-400">Total: {bookings.length}</span>
          </div>

          {bookings.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-400">
              No delivery bookings recorded yet. When customers submit requests on product pages or contact forms, they appear here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-stone-500 uppercase tracking-wider font-semibold border-b border-[#E7E2DA]">
                  <tr>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Postcode</th>
                    <th className="p-3">Product / SKU</th>
                    <th className="p-3">Requested Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFEBE4]">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-stone-50">
                      <td className="p-3 font-bold text-[#1C1917]">{b.customerName}</td>
                      <td className="p-3 font-mono text-stone-600">{b.customerPhone}</td>
                      <td className="p-3 font-mono font-bold text-stone-800">{b.postcode}</td>
                      <td className="p-3">
                        <span className="block font-medium">{b.productName}</span>
                        <span className="text-[10px] text-stone-400 font-mono">{b.sku}</span>
                      </td>
                      <td className="p-3 font-semibold text-[#A88440]">{b.preferredDate}</td>
                      <td className="p-3">
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 7: CSV BULK IMPORT / EXPORT (600+ RECORDS) --- */}
      {activeTab === 'csv' && (
        <div className="bg-white rounded-2xl border border-[#E7E2DA] p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EFEBE4]">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#1C1917]">
                Bulk CSV Import & Export (600+ Products)
              </h3>
              <p className="text-xs text-stone-500">
                Upload catalogues of 600 or more products. Validates SKUs, required fields, and identifies duplicates.
              </p>
            </div>
            <button
              onClick={() => api.adminExportCsv()}
              className="bg-[#1C1917] hover:bg-[#C5A059] hover:text-[#1C1917] text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Current Catalogue CSV</span>
            </button>
          </div>

          {/* Template helper */}
          <div className="p-4 bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl flex items-center justify-between gap-4">
            <div>
              <span className="font-bold text-xs text-[#1C1917] block">Standard Import Format</span>
              <span className="text-[11px] text-stone-500">
                Headers: <code className="bg-stone-200 px-1 py-0.5 rounded font-mono text-stone-800">name, sku, category, price, status, sizes, colours, images, description</code>
              </span>
            </div>
            <button
              onClick={() => {
                const sample = `name,sku,category,price,status,sizes,colours,images,description\n"Chesterfield High Bed","AMD-BED-CH01","Beds",349,"Published","Double|King","Silver|Grey","","Luxury chesterfield bed"\n"3 Door Wardrobe","AMD-WD-002","Wardrobes",249,"Published","150 cm","White|Oak","","Contemporary 3 door wardrobe"`;
                setCsvText(sample);
              }}
              className="text-xs text-[#A88440] font-semibold hover:underline shrink-0"
            >
              Load Sample Template
            </button>
          </div>

          {/* File Upload or Paste */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="file"
                ref={csvFileInputRef}
                accept=".csv"
                onChange={handleCsvFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => csvFileInputRef.current?.click()}
                className="bg-[#FAF8F5] hover:bg-[#F2ECE1] border border-[#DCD7CD] text-[#1C1917] text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#C5A059]" />
                <span>Select CSV File From Computer</span>
              </button>
              <span className="text-xs text-stone-500">Or paste raw CSV text below:</span>
            </div>

            <textarea
              rows={8}
              value={csvText}
              onChange={e => setCsvText(e.target.value)}
              placeholder="Paste comma-separated CSV text here..."
              className="w-full bg-[#FAF8F5] border border-[#DCD7CD] rounded-xl p-3.5 text-xs font-mono outline-hidden focus:border-[#C5A059]"
            />

            <button
              onClick={handleRunCsvImport}
              disabled={isImportingCsv || !csvText.trim()}
              className="bg-[#1C1917] hover:bg-[#C5A059] hover:text-[#1C1917] text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all disabled:opacity-40"
            >
              {isImportingCsv ? 'Processing Bulk Records...' : 'Execute Bulk CSV Import'}
            </button>
          </div>

          {/* Result summary */}
          {csvResult && (
            <div className="p-5 bg-white border border-[#E7E2DA] rounded-xl space-y-3">
              <h4 className="font-serif font-bold text-sm text-[#1C1917]">Import Results Summary</h4>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded">
                  <span className="text-stone-400 block">Total Rows</span>
                  <span className="font-bold text-stone-800">{csvResult.totalRowsProcessed || 0}</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded">
                  <span className="text-emerald-700 block">Successfully Imported</span>
                  <span className="font-bold text-emerald-800">{csvResult.importedCount || 0}</span>
                </div>
                <div className="p-3 bg-rose-50 rounded">
                  <span className="text-rose-700 block">Failed / Skipped</span>
                  <span className="font-bold text-rose-800">{csvResult.errorCount || 0}</span>
                </div>
              </div>

              {csvResult.errors && csvResult.errors.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-bold text-rose-700 block mb-1">Row Errors & Duplicates:</span>
                  <div className="max-h-48 overflow-y-auto divide-y divide-rose-100 border border-rose-200 rounded-lg text-xs bg-rose-50/50">
                    {csvResult.errors.map((err: any, idx: number) => (
                      <div key={idx} className="p-2 text-rose-800">
                        Row {err.row}: {err.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* --- TAB: EXPORT & NETLIFY DEPLOYMENT SOURCE CODE SYNC --- */}
      {activeTab === 'export-deploy' && (
        <div className="bg-white rounded-2xl border border-[#E7E2DA] p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EFEBE4]">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#1C1917]">
                Project Source Code Synchronisation & Netlify Deployment
              </h3>
              <p className="text-xs text-stone-500">
                Automated source file management for AMD Furniture UK catalogue and direct computer image storage.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                Auto-Sync Active ({lastSyncTime})
              </span>
            </div>
          </div>

          {/* Real-time Status Card */}
          <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E7E2DA] grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-white rounded-xl border border-[#E7E2DA] shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">
                Total Products Saved
              </span>
              <span className="font-serif text-2xl font-bold text-[#1C1917]">{products.length}</span>
              <span className="text-[10px] text-emerald-700 block mt-0.5">
                ✓ Stored in <code className="bg-stone-100 px-1 rounded">src/data/products.json</code>
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#E7E2DA] shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">
                Total Product Photos
              </span>
              <span className="font-serif text-2xl font-bold text-[#1C1917]">{totalImageCount}</span>
              <span className="text-[10px] text-emerald-700 block mt-0.5">
                ✓ Stored in <code className="bg-stone-100 px-1 rounded">public/images/products/</code>
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#E7E2DA] shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">
                Netlify Compatibility
              </span>
              <span className="font-serif text-2xl font-bold text-emerald-700">100% Ready</span>
              <span className="text-[10px] text-stone-500 block mt-0.5">
                No paid database needed for live store
              </span>
            </div>
          </div>

          {/* Action Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box 1: One-Click ZIP Export */}
            <div className="p-5 bg-white rounded-2xl border border-[#E7E2DA] space-y-3 shadow-2xs flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-base text-[#1C1917]">
                  Export Complete Catalogue Package (.ZIP)
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Downloads a single ZIP package containing the master <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">src/data/products.json</code> file, all uploaded image files in <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">public/images/products/</code>, and Netlify deployment instructions.
                </p>
              </div>

              <button
                onClick={handleDownloadZip}
                disabled={isExportingZip}
                className="w-full bg-[#25D366] hover:bg-[#20BD5A] active:bg-[#1E9E4B] text-white font-bold text-xs sm:text-sm py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isExportingZip ? 'Packaging Files...' : 'Download Complete Project (.ZIP)'}</span>
              </button>
            </div>

            {/* Box 2: JSON Direct Export & Import */}
            <div className="p-5 bg-white rounded-2xl border border-[#E7E2DA] space-y-3 shadow-2xs flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA] text-[#C5A059] flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-base text-[#1C1917]">
                  JSON Catalogue Backup & Restore
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Export or restore raw product catalogue records directly. Merges existing SKUs and prevents duplicate product entries automatically.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadJson}
                  className="flex-1 bg-[#1C1917] hover:bg-[#C5A059] hover:text-[#1C1917] text-white font-bold text-xs py-3 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export products.json</span>
                </button>

                <input
                  type="file"
                  ref={jsonFileInputRef}
                  accept=".json"
                  onChange={handleJsonFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => jsonFileInputRef.current?.click()}
                  className="flex-1 bg-[#FAF8F5] hover:bg-[#F2ECE1] border border-[#DCD7CD] text-[#1C1917] font-bold text-xs py-3 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Import products.json</span>
                </button>
              </div>
            </div>
          </div>

          {/* Deployment Instructions Walkthrough */}
          <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#E7E2DA] space-y-4">
            <h4 className="font-serif font-bold text-sm text-[#1C1917]">
              Step-by-Step Guide: Deploying AMD Furniture to Netlify
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-white p-4 rounded-xl border border-[#E7E2DA] space-y-1.5">
                <span className="w-5 h-5 rounded-full bg-[#1C1917] text-white text-[10px] font-bold flex items-center justify-center">
                  1
                </span>
                <span className="font-bold text-[#1C1917] block">Add Your Products</span>
                <p className="text-stone-500">
                  Add up to 1,000 products through this admin panel. Every save automatically writes into the project source files.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E7E2DA] space-y-1.5">
                <span className="w-5 h-5 rounded-full bg-[#1C1917] text-white text-[10px] font-bold flex items-center justify-center">
                  2
                </span>
                <span className="font-bold text-[#1C1917] block">Export Project Package</span>
                <p className="text-stone-500">
                  Tap "Download Complete Project (.ZIP)" above to download a complete archive of your catalogue and pictures.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E7E2DA] space-y-1.5">
                <span className="w-5 h-5 rounded-full bg-[#1C1917] text-white text-[10px] font-bold flex items-center justify-center">
                  3
                </span>
                <span className="font-bold text-[#1C1917] block">Build Project</span>
                <p className="text-stone-500">
                  Run <code className="bg-stone-100 px-1 rounded">npm run build</code>. Vite compiles all 12 category pages, cards, and pictures into <code className="bg-stone-100 px-1 rounded">dist/</code>.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E7E2DA] space-y-1.5">
                <span className="w-5 h-5 rounded-full bg-[#1C1917] text-white text-[10px] font-bold flex items-center justify-center">
                  4
                </span>
                <span className="font-bold text-[#1C1917] block">Deploy to Netlify</span>
                <p className="text-stone-500">
                  Push your project to GitHub and connect to Netlify, or drag-and-drop the <code className="bg-stone-100 px-1 rounded">dist</code> folder directly. All products appear live!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 8: WEBSITE SETTINGS & PASSWORD CHANGE --- */}
      {activeTab === 'settings' && settings && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Announcement Bar & Contact Settings */}
          <div className="bg-white rounded-2xl border border-[#E7E2DA] p-6 space-y-4 shadow-2xs">
            <h3 className="font-serif font-bold text-base text-[#1C1917]">
              Announcement Bar & Public Settings
            </h3>

            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.announcementEnabled}
                  onChange={e => setSettings({ ...settings, announcementEnabled: e.target.checked })}
                  className="accent-[#C5A059]"
                />
                <span className="text-xs font-semibold text-[#1C1917]">Enable Scrolling Announcement Bar</span>
              </label>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Marquee Announcement Text
                </label>
                <textarea
                  rows={3}
                  value={settings.announcementText}
                  onChange={e => setSettings({ ...settings, announcementText: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#DCD7CD] rounded-lg p-2.5 text-xs outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  WhatsApp Contact Number
                </label>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={e => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#DCD7CD] rounded-lg px-3 py-2 text-xs font-mono outline-hidden"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveSettings}
                className="bg-[#1C1917] hover:bg-[#C5A059] hover:text-[#1C1917] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>

          {/* Change Admin Password */}
          <div className="bg-white rounded-2xl border border-[#E7E2DA] p-6 space-y-4 shadow-2xs">
            <h3 className="font-serif font-bold text-base text-[#1C1917]">
              Change Administrator Password
            </h3>
            <p className="text-xs text-stone-500">
              Update your master administrator password. Password input is never pre-filled on login.
            </p>

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Current Password *
                </label>
                <input
                  type="password"
                  required
                  value={currentPasswordInput}
                  onChange={e => setCurrentPasswordInput(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#DCD7CD] rounded-lg px-3 py-2 text-xs outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  New Password (Min 6 Characters) *
                </label>
                <input
                  type="password"
                  required
                  value={newPasswordInput}
                  onChange={e => setNewPasswordInput(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#DCD7CD] rounded-lg px-3 py-2 text-xs outline-hidden"
                />
              </div>

              {passwordChangeMessage && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded text-xs">
                  {passwordChangeMessage}
                </div>
              )}
              {passwordChangeError && (
                <div className="p-2.5 bg-rose-50 text-rose-800 rounded text-xs">
                  {passwordChangeError}
                </div>
              )}

              <button
                type="submit"
                className="bg-[#1C1917] hover:bg-[#C5A059] hover:text-[#1C1917] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DELETE PRODUCT CONFIRMATION MODAL */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[#E7E2DA] space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>

            <div>
              <h4 className="font-serif font-bold text-lg text-[#1C1917]">
                Confirm Delete Product?
              </h4>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Are you sure you want to permanently delete <strong>{productToDelete.name}</strong> (SKU: {productToDelete.sku}) from the catalogue? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-lg border border-[#DCD7CD] text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteProduct}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-sm"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
